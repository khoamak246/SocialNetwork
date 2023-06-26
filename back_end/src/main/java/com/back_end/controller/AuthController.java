package com.back_end.controller;

import com.back_end.dto.request.SignInForm;
import com.back_end.dto.request.SignUpForm;
import com.back_end.dto.response.JwtResponse;
import com.back_end.dto.response.ResponseMessage;
import com.back_end.model.*;
import com.back_end.security.jwt.JwtProvider;
import com.back_end.security.userPrincipal.UserPrincipal;
import com.back_end.service.IRoleService;
import com.back_end.service.IRoomService;
import com.back_end.service.IUserRoomService;
import com.back_end.service.IUserService;
import com.back_end.utils.constant.ValidationRegex;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserService userService;
    private final IRoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final IRoomService roomService;
    private final IUserRoomService userRoomService;

    @PostMapping("/signUp")
    public ResponseEntity<ResponseMessage> doSignUp(
            @Validated @RequestBody SignUpForm signUpForm,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    ResponseMessage.builder()
                            .status("FAILED")
                            .message(ValidationRegex.INVALID_MESSAGE)
                            .data("")
                            .build()
            );
        }

        boolean isExistUserName = userService.existsByUsername(signUpForm.getUsername());
        if (isExistUserName) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    ResponseMessage.builder()
                            .status("FAILED")
                            .message("Username are already exist!")
                            .data("")
                            .build()
            );
        }

        boolean isExistEmail = userService.existsByEmail(signUpForm.getEmail());
        if (isExistEmail) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    ResponseMessage.builder()
                            .status("FAILED")
                            .message("Email are already exist!")
                            .data("")
                            .build()
            );
        }

        boolean isExistPhoneNumber = userService.existsByPhoneNumber(signUpForm.getPhoneNumber());
        if (isExistPhoneNumber) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    ResponseMessage.builder()
                            .status("FAILED")
                            .message("Phone Number are already exist!")
                            .data("")
                            .build()
            );
        }

        Set<Role> roles = new HashSet<>();
        if (signUpForm.getRoles() == null || signUpForm.getRoles().isEmpty()) {
            Role userRole = roleService.findByName(RoleName.USER).orElseThrow(() -> new RuntimeException("FAILED -> NOT EXIST ROLE IN DB"));
            roles.add(userRole);
        } else {
            for (String role : signUpForm.getRoles()) {
                switch (role) {
                    case "admin":
                        Role adminRole = roleService.findByName(RoleName.ADMIN).orElseThrow(() -> new RuntimeException("FAILED -> NOT EXIST ROLE IN DB"));
                        roles.add(adminRole);
                    case "pm":
                        Role pmRole = roleService.findByName(RoleName.PM).orElseThrow(() -> new RuntimeException("FAILED -> NOT EXIST ROLE IN DB"));
                        roles.add(pmRole);
                    case "user":
                        Role userRole = roleService.findByName(RoleName.USER).orElseThrow(() -> new RuntimeException("FAILED -> NOT EXIST ROLE IN DB"));
                        roles.add(userRole);
                }
            }
        }

        UserInfo userInfo = UserInfo.builder()
                .createdDate(LocalDate.now().toString())
                .avatar("https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/defaultAvatar.jpg?alt=media&token=156e7504-89ab-41e0-b185-864196000f98&_gl=1*1d2dync*_ga*OTg5NTExNTUxLjE2ODYzMjQzMDE.*_ga_CW55HF8NVT*MTY4NjM3MjI1NC4zLjEuMTY4NjM3MjMyNi4wLjAuMA..")
                .introduce("Hello Instagram! Write something to introduce yourself here!")
                .build();

        User user = User.builder()
                .fullName(signUpForm.getFullName())
                .username(signUpForm.getUsername())
                .password(passwordEncoder.encode(signUpForm.getPassword()))
                .email(signUpForm.getEmail())
                .phoneNumber(signUpForm.getPhoneNumber())
                .userInfo(userInfo)
                .roles(roles)
                .build();

        User justSavedUser = userService.save(user);
        Room room = Room.builder()
                .userNumber(1)
                .status(true)
                .build();
        Room justSavedRoom = roomService.save(room);
        Role memberRole = roleService.findByName(RoleName.MEMBER).orElseThrow(() -> new IllegalArgumentException("Not found role matches"));

        UserRoom userRoom = UserRoom.builder()
                .role(memberRole)
                .room(justSavedRoom)
                .displayStatus(true)
                .user(justSavedUser)
                .latsAccess(System.currentTimeMillis())
                .build();

        userRoomService.save(userRoom);

        return ResponseEntity.ok().body(ResponseMessage.builder()
                .status("OK")
                .message("New account had been created!")
                .data("")
                .build());
    }

    @PostMapping("/signIn")
    public ResponseEntity<?> doSingIn(
            @Validated @RequestBody SignInForm signInForm,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    ResponseMessage.builder()
                            .status("FAILED")
                            .message(ValidationRegex.INVALID_MESSAGE)
                            .data("")
                            .build()
            );
        }


        Optional<User> user = userService.findByUsername(signInForm.getUsername());
        if (!user.isPresent()) {
            user = userService.findByEmail(signInForm.getUsername());
            if (!user.isPresent()) {
                user = userService.findByPhoneNumber(signInForm.getUsername());
            }
        }


        if (!user.isPresent()) {
            return new ResponseEntity<>(ResponseMessage.builder()
                    .status("FAILED")
                    .message("Wrong username or password!")
                    .data("")
                    .build(), HttpStatus.UNAUTHORIZED);
        } else {
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.get().getUsername(),
                                signInForm.getPassword()
                        ));
                user.get().getUserInfo().setLastLogin(LocalDate.now().toString());
                userService.save(user.get());
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                String token = jwtProvider.generateToken(authentication);
                return new ResponseEntity<>(JwtResponse.builder()
                        .expiredTime(jwtProvider.getExpiredTimeFromToken(token))
                        .status("OK")
                        .type("Bearer")
                        .fullName(userPrincipal.getFullName())
                        .token(token)
                        .roles(userPrincipal.getRoles())
                        .build(), HttpStatus.OK);
            } catch (AuthenticationException e) {
                return new ResponseEntity<>(ResponseMessage.builder()
                        .status("FAILED")
                        .message("Wrong username or password!")
                        .data("")
                        .build(), HttpStatus.UNAUTHORIZED);
            }
        }
    }
}
