package com.back_end.controller;

import com.back_end.dto.request.CommentForm;
import com.back_end.dto.request.LikeCommentForm;
import com.back_end.dto.request.NestedCommentForm;
import com.back_end.dto.response.ResponseMessage;
import com.back_end.model.Comment;
import com.back_end.model.Post;
import com.back_end.model.User;
import com.back_end.security.userPrincipal.UserPrincipal;
import com.back_end.service.ICommentService;
import com.back_end.service.IPostService;
import com.back_end.service.IUserService;
import com.back_end.utils.util.Utils;
import jdk.nashorn.internal.runtime.options.Option;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController {

    private final IPostService postService;
    private final IUserService userService;
    private final ICommentService commentService;

    @PostMapping("/dislikeComment")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> dislikeComment(@RequestBody LikeCommentForm likeCommentForm){
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(likeCommentForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }
        Optional<User> user = userService.findById(likeCommentForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + likeCommentForm.getUserId()));
        }

        Optional<Comment> comment = commentService.findById(likeCommentForm.getCommentId());
        if (!comment.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found comment at id: " + likeCommentForm.getCommentId()));
        }

        List<User> currentLikeCommentUserList = comment.get().getLikeUser();
        currentLikeCommentUserList.remove(user.get());
        comment.get().setLikeUser(currentLikeCommentUserList);
        comment.get().setLikeNumber(comment.get().getLikeNumber() - 1);
        Comment justSaveComment = commentService.save(comment.get());
        return ResponseEntity.ok().body(Utils.buildSuccessMessage("Dislike comment successfully!", justSaveComment));
    }

    @PostMapping("/likeComment")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> createLikeComment(@RequestBody LikeCommentForm likeCommentForm) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(likeCommentForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }



        Optional<User> user = userService.findById(likeCommentForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + likeCommentForm.getUserId()));
        }

        Optional<Comment> comment = commentService.findById(likeCommentForm.getCommentId());
        if (!comment.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found comment at id: " + likeCommentForm.getCommentId()));
        }

        List<User> currentLikeCommentUserList = comment.get().getLikeUser();
        currentLikeCommentUserList.add(user.get());
        comment.get().setLikeUser(currentLikeCommentUserList);
        comment.get().setLikeNumber(comment.get().getLikeNumber() + 1);
        Comment justSaveComment = commentService.save(comment.get());
        return ResponseEntity.ok().body(Utils.buildSuccessMessage("Create new like comment successfully!", justSaveComment));
    }


    @PostMapping("/nestedComment")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> saveNestedComment(@RequestBody NestedCommentForm nestedCommentForm){
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(nestedCommentForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<Comment> comment = commentService.findById(nestedCommentForm.getNestedId());
        if (!comment.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found comment at id: " + nestedCommentForm.getNestedId()));
        }

        Optional<User> user = userService.findById(nestedCommentForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + nestedCommentForm.getUserId()));
        }

        Optional<Post> post = postService.findById(nestedCommentForm.getPostId());
        if (!post.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found post at id: " + nestedCommentForm.getPostId()));
        }

        post.get().setCommentNumber(post.get().getCommentNumber() + 1);
        postService.save(post.get());

        Comment nestedComment = Comment.builder()
                .content(nestedCommentForm.getContent())
                .commentTime(System.currentTimeMillis())
                .user(user.get())
                .post(post.get())
                .type(false)
                .build();
        Comment justAddedNestedComment = commentService.save(nestedComment);

        List<Comment> commentNestedList =  comment.get().getComments();
        commentNestedList.add(justAddedNestedComment);
        comment.get().setComments(commentNestedList);
        comment.get().setCommentNumber(comment.get().getCommentNumber() + 1);
        Comment returnDataComment = commentService.save(comment.get());

        return ResponseEntity.ok()
                .body(Utils.buildSuccessMessage("Create nested comment successfully!", returnDataComment));
    }


    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> saveComment(@RequestBody CommentForm commentForm) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(commentForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<Post> post = postService.findById(commentForm.getPostId());
        if (!post.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found post at id: " + commentForm.getPostId()));
        }

        Optional<User> user = userService.findById(commentForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + commentForm.getUserId()));
        }
        post.get().setCommentNumber(post.get().getCommentNumber() + 1);
        postService.save(post.get());

        Comment comment = Comment.builder()
                .content(commentForm.getContent())
                .commentTime(System.currentTimeMillis())
                .user(user.get())
                .post(post.get())
                .type(true)
                .build();

        Comment returnData = commentService.save(comment);
        return ResponseEntity.ok(Utils.buildSuccessMessage("Created new comment successfully!", returnData));
    }

}
