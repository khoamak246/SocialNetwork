package com.back_end.controller;

import com.back_end.dto.request.PagingAndSorting;
import com.back_end.dto.request.PostBehaviorForm;
import com.back_end.dto.request.PostCreateForm;
import com.back_end.dto.request.StoryInDayForm;
import com.back_end.dto.response.ResponseMessage;
import com.back_end.model.Post;
import com.back_end.model.PostBehavior;
import com.back_end.model.PostImg;
import com.back_end.model.User;
import com.back_end.security.userPrincipal.UserPrincipal;
import com.back_end.service.IPostBehaviorService;
import com.back_end.service.IPostImgService;
import com.back_end.service.IPostService;
import com.back_end.service.IUserService;
import com.back_end.utils.constant.ValidationRegex;
import com.back_end.utils.util.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import javax.validation.Valid;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostController {

    private final IPostService postService;
    private final IUserService userService;
    private final IPostImgService postImgService;
    private final IPostBehaviorService postBehaviorService;

    @DeleteMapping("/postBehavior")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    @Transactional
    public ResponseEntity<ResponseMessage> deleteBehaviorForPost(@RequestBody PostBehaviorForm postBehaviorForm) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(postBehaviorForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }


        Optional<Post> post = postService.findById(postBehaviorForm.getPostId());
        if (!post.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found post at id: " + postBehaviorForm.getPostId()));
        }

        Optional<User> user = userService.findById(postBehaviorForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + postBehaviorForm.getUserId()));
        }

        switch (postBehaviorForm.getType()) {
            case "like":
                if (post.get().getLikeNumber() != 0) {
                    post.get().setLikeNumber(post.get().getLikeNumber() - 1);
                }
                break;
            case "share":
                if (post.get().getShareNumber() != 0) {
                    post.get().setShareNumber(post.get().getShareNumber() - 1);
                }
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Data not matches (Type)"));
        }

        postService.save(post.get());
        Optional<PostBehavior> postBehavior = postBehaviorService.findByPostIdAndUserIdAndType(postBehaviorForm.getPostId(), postBehaviorForm.getUserId(), postBehaviorForm.getType());
        if (!postBehavior.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Not found behavior action with data"));
        } else {
            postBehaviorService.deleteByBehaviorById(postBehavior.get().getId());
            return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Delete Successfully!"));
        }


    }

    @PostMapping("/postBehavior")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> createNewBehaviorForPost(@RequestBody PostBehaviorForm postBehaviorForm) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(postBehaviorForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<Post> post = postService.findById(postBehaviorForm.getPostId());
        if (!post.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found post at id: " + postBehaviorForm.getPostId()));
        }

        Optional<User> user = userService.findById(postBehaviorForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + postBehaviorForm.getUserId()));
        }

        switch (postBehaviorForm.getType()) {
            case "like":
                post.get().setLikeNumber(post.get().getLikeNumber() + 1);
                break;
            case "share":
                post.get().setShareNumber(post.get().getShareNumber() + 1);
                break;
            case "story":
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Data not matches (Type)"));
        }

        postService.save(post.get());


        PostBehavior postBehavior = PostBehavior.builder()
                .posts(post.get())
                .users(user.get())
                .type(postBehaviorForm.getType())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Add new behavior successfully!", postBehaviorService.save(postBehavior)));

    }



    @PostMapping("/pagingPost")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findPostByPaging(@RequestBody PagingAndSorting pagingAndSorting) {
        Optional<User> user = userService.findById(pagingAndSorting.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + pagingAndSorting.getUserId()));
        }

        List<Post> postWithPaging = new ArrayList<>();
        List<User> followerList = user.get().getFollower();
        Pageable pageable = PageRequest.of(
                pagingAndSorting.getPaging(),
                pagingAndSorting.getSize(),
                Sort.by("createdDate").descending()
        );

        boolean isPost = pagingAndSorting.getType().equals("post");
        followerList.forEach(follower -> {
            Page<Post> followerPagingPost = postService.findByUserIdAndCreatedDateAndType(follower.getId(), pagingAndSorting.getDate(), isPost, pageable);
            followerPagingPost.forEach(postWithPaging::add);
        });
        Collections.shuffle(postWithPaging);
        return ResponseEntity.ok(Utils.buildSuccessMessage("Query success!", postWithPaging));
    }

    @GetMapping("/userPost/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findPostByUserId(@PathVariable("userId") Long id) {
        List<Post> posts = postService.findByUserId(id);
        HttpStatus status = HttpStatus.OK;
        if (posts.isEmpty()) {
            status = HttpStatus.NO_CONTENT;
        }
        return ResponseEntity.status(status).body(
                Utils.buildSuccessMessage("Query successfully!", posts)
        );
    }

    @PostMapping("/storyInDay")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findStoryBySpecificDay(@RequestBody StoryInDayForm storyInDayForm){

        Optional<User> user = userService.findById(storyInDayForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id" + storyInDayForm.getUserId()));
        }

        List<Post> storyInDay = new ArrayList<>();
        List<User> followerList = user.get().getFollower();
        followerList.forEach(follower -> {
            List<Post> postList = postService.findByUserIdAndTypeAndCreatedDate(follower.getId(),false, storyInDayForm.getDate());
            storyInDay.addAll(postList);
        });

        return ResponseEntity.ok(Utils.buildSuccessMessage("Query successfully!", storyInDay));

    }

    @GetMapping("/story/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findStoryById(@PathVariable("id") Long id) {
        Optional<Post> post = postService.findById(id);
        HttpStatus status = HttpStatus.NOT_FOUND;
        if (post.isPresent() && !post.get().isType()) {
            status = HttpStatus.OK;
            return ResponseEntity.status(status).body(Utils.buildSuccessMessage("Query successfully!", post.get()));
        }
        return ResponseEntity.status(status).body(Utils.buildFailMessage("Not found story at id: " + id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findPostById(@PathVariable("id") Long id) {
        Optional<Post> post = postService.findById(id);
        return post.map(value ->
                ResponseEntity
                        .ok(Utils.buildSuccessMessage("Query successfully!", value)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Utils.buildFailMessage("Not found post at id: " + id)));
    }

    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    @Transactional
    public ResponseEntity<ResponseMessage> savePost(
            @Valid @RequestBody PostCreateForm postCreateForm,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    Utils.buildFailMessage(ValidationRegex.INVALID_MESSAGE)
            );
        }

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(postCreateForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }


        Optional<User> user = userService.findById(postCreateForm.getUserId());
        if (user.isPresent()) {


            Post post = Post.builder()
                    .content(postCreateForm.getContent())
                    .location(postCreateForm.getLocation())
                    .createdDate(LocalDate.now().toString())
                    .privacy(postCreateForm.getPrivacy().equalsIgnoreCase("public"))
                    .type(postCreateForm.getType().equalsIgnoreCase("post"))
                    .user(user.get())
                    .build();

            Post savedPost = postService.save(post);
            Set<PostImg> postImgList = postCreateForm.getListImg().stream().map(
                    img -> PostImg.builder().url(img).type(img.split("_assetType:")[1].equalsIgnoreCase("img")).post(savedPost).build()
            ).collect(Collectors.toSet());

            postImgList.forEach(postImgService::save);

            return ResponseEntity.status(HttpStatus.OK).body(
                    Utils.buildSuccessMessage("Created new post successfully!", postService.findById(savedPost.getId()))
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    Utils.buildFailMessage("Not found user at id: " + postCreateForm.getUserId())
            );
        }


    }
}
