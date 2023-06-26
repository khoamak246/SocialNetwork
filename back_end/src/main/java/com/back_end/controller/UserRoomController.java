package com.back_end.controller;

import com.back_end.dto.request.RoomCreateForm;
import com.back_end.dto.response.ResponseMessage;
import com.back_end.model.*;
import com.back_end.security.userPrincipal.UserPrincipal;
import com.back_end.service.IRoleService;
import com.back_end.service.IRoomService;
import com.back_end.service.IUserRoomService;
import com.back_end.service.IUserService;
import com.back_end.utils.util.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/userRoom")
@RequiredArgsConstructor
public class UserRoomController {

    private final IUserRoomService userRoomService;
    private final IRoomService roomService;
    private final IUserService userService;
    private final IRoleService roleService;

    @PutMapping("/updateLasted/{userRoomId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> updateLatestAccess(@PathVariable("userRoomId") Long id){

        Optional<UserRoom> userRoom = userRoomService.findById(id);
        if (!userRoom.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user_room at id: " + id));
        }

        userRoom.get().setLatsAccess(System.currentTimeMillis());
        UserRoom justSavedUserRoom = userRoomService.save(userRoom.get());
        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Update successfully!", justSavedUserRoom));
    }


    @GetMapping("/getByUserId/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> getRoomByUserId(@PathVariable("userId") Long userId){
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(userId)){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<User> user = userService.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + userId));
        }

        List<UserRoom> userRoomList = userRoomService.findByUserIdOrderByLatsAccessDesc(userId);
        return ResponseEntity.ok().body(Utils.buildSuccessMessage("Query successfully!", userRoomList));
    }


    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> createNewRoom(@RequestBody RoomCreateForm roomCreateForm){
        if (roomCreateForm.getUserList() == null || roomCreateForm.getUserList().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Utils.buildFailMessage("List user to create room not matches: " + roomCreateForm.getUserList()));
        }

        for (Long userId : roomCreateForm.getUserList()){
            boolean isExistUserId = userService.existsById(userId);
            if (!isExistUserId) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + userId));
            }
        }

        boolean isExistUserId = userService.existsById(roomCreateForm.getCreatorUser());
        if (!isExistUserId) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + roomCreateForm.getCreatorUser()));
        }

        Room room = Room.builder()
                .userNumber(roomCreateForm.getUserList().size())
                .status(false)
                .build();

        if (roomCreateForm.getName() != null && roomCreateForm.getUserList().size() > 2) {
            room.setName(roomCreateForm.getName());
        }

        if (roomCreateForm.getUserList().size() > 3){
            room.setStatus(true);
        }



        Room justSavedRoom = roomService.save(room);


        Role creatorRole = roleService.findByName(RoleName.CREATOR).orElseThrow(() -> new IllegalArgumentException("Not found role matches"));
        Role memberRole = roleService.findByName(RoleName.MEMBER).orElseThrow(() -> new IllegalArgumentException("Not found role matches"));
        if (roomCreateForm.getUserList().size() < 3){
            for (Long userId : roomCreateForm.getUserList()){
                Optional<User> user = userService.findById(userId);
                UserRoom userRoom = UserRoom.builder()
                        .role(memberRole)
                        .room(justSavedRoom)
                        .displayStatus(user.isPresent() && userId.equals(roomCreateForm.getCreatorUser()))
                        .user(user.get())
                        .build();
                if (userId.equals(roomCreateForm.getCreatorUser())){
                    userRoom.setLatsAccess(System.currentTimeMillis());
                }
                userRoomService.save(userRoom);
            }
        } else {

            for (Long userId : roomCreateForm.getUserList()){
                UserRoom userRoom = UserRoom
                        .builder()
                        .room(justSavedRoom)
                        .build();
                Optional<User> user = userService.findById(userId);
                if (user.isPresent() && userId.equals(roomCreateForm.getCreatorUser())) {
                    userRoom.setRole(creatorRole);
                    userRoom.setDisplayStatus(true);
                    userRoom.setLatsAccess(System.currentTimeMillis());
                } else {
                    userRoom.setDisplayStatus(false);
                    userRoom.setRole(memberRole);
                }
                userRoom.setUser(user.get());
                userRoomService.save(userRoom);
            }
        }

        return ResponseEntity.ok().body(Utils.buildSuccessMessage("Create room successfully!", justSavedRoom));
    }
}
