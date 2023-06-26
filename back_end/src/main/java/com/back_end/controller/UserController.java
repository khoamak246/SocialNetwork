package com.back_end.controller;

import com.back_end.dto.request.FollowerForm;
import com.back_end.dto.request.UserUpdateForm;
import com.back_end.dto.response.ResponseMessage;
import com.back_end.model.User;
import com.back_end.security.userPrincipal.UserPrincipal;
import com.back_end.service.IUserService;
import com.back_end.utils.util.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/suggestionUser/{userId}")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> getSuggestionUser(@PathVariable("userId") Long userId) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(userId)){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<User> user = userService.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at userId: " + userId));
        }

        List<User> currentFollowers = user.get().getFollower();
        List<User> listFollowerOfFromCurrentFollowersList = new ArrayList<>();
        for (User follower : currentFollowers) {
            listFollowerOfFromCurrentFollowersList.addAll(follower.getFollower());
        }

        Set<User> currentFollowerSet = new HashSet<>(currentFollowers);
        Set<User> suggestionList = new HashSet<>();
        for (User follower : listFollowerOfFromCurrentFollowersList) {
            if (!currentFollowerSet.contains(follower) && !Objects.equals(follower.getId(), userId)) {
                suggestionList.add(follower);
            }
        }

        return ResponseEntity.ok(Utils.buildSuccessMessage("Query successfully!", suggestionList));


    }

    @GetMapping("/getListFollowedUser/{userId}")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> getListFollowedUser(@PathVariable("userId") Long userId){

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(userId)){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        if (!userService.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at userId: " + userId));
        }
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Query successfully!", userService.findByFollowerId(userId)));

    }

    @PutMapping("/unfollow/{userId}/{followerId}")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> unfollowUser(
            @PathVariable("userId") Long userId,
            @PathVariable("followerId") Long followerId) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(userId)){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        if (userId.equals(followerId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("UserId and followerId can not equal!"));
        }

        Optional<User> user = userService.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at userId: " + userId));
        }

        Optional<User> follower = userService.findById(followerId);
        if (!follower.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found follower at userId: " + followerId));
        }

        List<User> listFollower = user.get().getFollower();
        listFollower.remove(follower.get());
        user.get().setFollower(listFollower);
        return ResponseEntity.ok(Utils.buildSuccessMessage("Unfollow successfully!", userService.save(user.get())));

    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> updateUserInfo(@PathVariable("id") Long id,
                                                          @RequestBody UserUpdateForm userUpdateForm) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(id)){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<User> user = userService.findById(id);
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at userId: " + id));
        }

        if (userUpdateForm.getUpdateField() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Not change any value because doesn't declare what to chane in list update field!"));
        } else {
            for (String field : userUpdateForm.getUpdateField()) {
                switch (field) {
                    case "fullName":
                        user.get().setFullName(userUpdateForm.getFullName());
                        break;
                    case "phoneNumber":
                        boolean existPhoneNumber = userService.existsByPhoneNumber(userUpdateForm.getPhoneNumber());
                        if (existPhoneNumber) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Phone number is already existed!"));
                        }
                        user.get().setPhoneNumber(userUpdateForm.getPhoneNumber());
                        break;
                    case "email":
                        boolean existEmail = userService.existsByEmail(userUpdateForm.getEmail());
                        if (existEmail) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Email number is already existed!"));
                        }
                        user.get().setEmail(userUpdateForm.getEmail());
                        break;
                    case "introduce":
                        user.get().getUserInfo().setIntroduce(userUpdateForm.getIntroduce());
                        break;
                    case "password":
                        boolean isPasswordMatches = passwordEncoder.matches(userUpdateForm.getCurrentPassword(), user.get().getPassword());
                        if (!isPasswordMatches) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("Email number is already existed!"));
                        }
                        user.get().setPassword(passwordEncoder.encode(userUpdateForm.getNewPassword()));
                        break;
                    case "avatar":
                        user.get().getUserInfo().setAvatar(userUpdateForm.getAvatarUrl());
                        break;
                    default:
                        return ResponseEntity.ok(Utils.buildSuccessMessage("Nothing to change!"));
                }
            }

            User justSavedUser = userService.save(user.get());
            return ResponseEntity.ok(Utils.buildSuccessMessage("Update successfully!", justSavedUser));
        }
    }


    @PostMapping("/follower/create")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> saveNewFollower(@RequestBody FollowerForm followerForm) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(followerForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<User> user = userService.findById(followerForm.getUserId());
        Optional<User> follower = userService.findById(followerForm.getFollowerId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at userId: " + followerForm.getUserId()));
        } else if (!follower.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at userId: " + followerForm.getFollowerId()));
        }

        List<User> currentFollowerList = user.get().getFollower();
        currentFollowerList.add(follower.get());
        user.get().setFollower(currentFollowerList);

        User returnUser = userService.save(user.get());
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Query successfully!", returnUser));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findUserByUserId(@PathVariable("id") Long id) {

        Optional<User> user = userService.findById(id);
        HttpStatus status = HttpStatus.OK;
        if (!user.isPresent()) {
            status = HttpStatus.NOT_FOUND;
            return ResponseEntity.status(status).body(Utils.buildFailMessage("Not found user at id: " + id));
        }
        return ResponseEntity.status(status).body(Utils.buildSuccessMessage("Query successfully!", user.get()));
    }

    @GetMapping("/searchRelativeValue/{value}")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findUserByRelativeValue(@PathVariable("value") String value) {
        List<User> users = userService.findByFullNameContainingIgnoreCase(value);
        if (users.isEmpty()) {
            users = userService.findByPhoneNumberContainingIgnoreCase(value);
            if (users.isEmpty()) {
                users = userService.findByEmailContainingIgnoreCase(value);
            }
        }

        HttpStatus status = HttpStatus.OK;
        if (!users.isEmpty()) {
            return ResponseEntity.status(status).body(Utils.buildSuccessMessage("Query successfully!", users));
        } else {
            status = HttpStatus.NOT_FOUND;
            return ResponseEntity.status(status).body(Utils.buildFailMessage("Not found user at value: " + value));
        }
    }

    @GetMapping("/searchAbsoluteValue/{value}")
    @PreAuthorize("hasAnyAuthority('AMDIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> findUserByExpectedValue(
            @PathVariable("value") String value) {
        Optional<User> user = userService.findByUsername(value);
        if (!user.isPresent()) {
            user = userService.findByEmail(value);
            if (!user.isPresent()) {
                user = userService.findByPhoneNumber(value);
            }
        }

        return user.map(user1 -> ResponseEntity.status(HttpStatus.OK).body(
                Utils.buildSuccessMessage("Query successfully!", user1)
        )).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Utils.buildFailMessage("Not found with expected value!")
        ));

    }


}
