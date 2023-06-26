package com.back_end.controller;

import com.back_end.dto.request.CollectionForm;
import com.back_end.dto.response.ResponseMessage;
import com.back_end.model.Collection;
import com.back_end.model.Post;
import com.back_end.model.User;
import com.back_end.security.userPrincipal.UserPrincipal;
import com.back_end.service.ICollectionService;
import com.back_end.service.IPostService;
import com.back_end.service.IUserService;
import com.back_end.utils.util.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/collection")
@RequiredArgsConstructor
public class CollectionController {

    private final ICollectionService collectionService;
    private final IUserService userService;
    private final IPostService postService;

    @PutMapping("/{collectionId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> updateCollection(@PathVariable("collectionId") Long collectionId,
                                                            @RequestBody CollectionForm collectionForm) {
        String name = collectionForm.getName();
        if (name == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Sending data not match (field 'name')"));
        }

        Optional<Collection> collection = collectionService.findById(collectionId);


        if (!collection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found collection at id: " + collectionId));
        }

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(collection.get().getUser().getId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        collection.get().setName(name);
        Collection justSavedCollection = collectionService.save(collection.get());
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Update collection successfully!", justSavedCollection));
    }

    @DeleteMapping("/{collectionId}")
    public ResponseEntity<ResponseMessage> deleteCollection(@PathVariable("collectionId") Long collectionId){
        Optional<Collection> collection = collectionService.findById(collectionId);
        if (!collection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found collection at id: " + collectionId));
        }


        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(collection.get().getUser().getId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }


        collection.get().setPost(new ArrayList<>());
        collectionService.save(collection.get());
        collectionService.deleteByCollectionId(collectionId);
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Delete successfully!"));
    }


    @DeleteMapping ("/deletePost/{collectionId}/{postId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> deletePostFromCollection(@PathVariable("collectionId") Long collectionId,
                                                                    @PathVariable("postId") Long postId){
        Optional<Collection> collection = collectionService.findById(collectionId);
        if (!collection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found collection at id: " + collectionId));
        }

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(collection.get().getUser().getId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<Post> post = postService.findById(postId);
        if (!post.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found post at id: " + postId));
        }

        boolean existsPostInCollection = collectionService.existsByIdAndPostId(collectionId, postId);
        if (!existsPostInCollection) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("This post not exist in collection id: " + collectionId));
        }

        List<Post> currentPostInCollection = collection.get().getPost();
        currentPostInCollection.remove(post.get());
        collection.get().setPostNumber(collection.get().getPostNumber() - 1);
        Collection justSavedCollection = collectionService.save(collection.get());
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Delete post to collection successfully!", justSavedCollection));
    }

    @PostMapping("/savePost")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> savePostToCollection(@RequestBody CollectionForm collectionForm) {
        Optional<Post> post = postService.findById(collectionForm.getPostId());
        if (!post.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found post at id: "+ collectionForm.getPostId()));
        }

        Optional<Collection> collection = collectionService.findById(collectionForm.getCollectionId());
        if (!collection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found collection at id: " + collectionForm.getCollectionId()));
        }

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(collection.get().getUser().getId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        boolean existsPostInCollection = collectionService.existsByIdAndPostId(collectionForm.getCollectionId(), collectionForm.getPostId());
        if (existsPostInCollection) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("This post exist in collection id: " + collectionForm.getCollectionId()));
        }


        List<Post> currentPostInCollection = collection.get().getPost();
        currentPostInCollection.add(post.get());
        collection.get().setPostNumber(collection.get().getPostNumber() + 1);
        Collection justSavedCollection = collectionService.save(collection.get());
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Add post to collection successfully!", justSavedCollection));
    }

    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> saveCollection(@RequestBody CollectionForm collectionForm) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(collectionForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<User> user = userService.findById(collectionForm.getUserId());
        if (!user.isPresent()) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + collectionForm.getUserId()));
        }



        Collection collection = Collection.builder()
                .name(collectionForm.getName())
                .createDate(LocalDate.now().toString())
                .user(user.get())
                .post(new ArrayList<>())
                .build();

        Collection justSavedCollection = collectionService.save(collection);
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Create new collection successfully!", justSavedCollection));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findCollectionByUserId(@PathVariable("userId") Long userId){
        Optional<User> user = userService.findById(userId);


        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + userId));
        }

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(userId)){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }


        List<Collection> collections = collectionService.findByUserId(userId);
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Query successfully!", collections));
    }




}
