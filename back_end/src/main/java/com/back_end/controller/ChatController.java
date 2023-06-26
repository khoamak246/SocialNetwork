package com.back_end.controller;

import com.back_end.dto.request.ChatMessage;
import com.back_end.model.*;
import com.back_end.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final IRoomService roomService;
    private final IUserRoomService userRoomService;
    private final IUserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final IChatTypeService chatTypeService;
    private final IChatService chatService;

    @MessageMapping("/public-message")
    @SendTo("/chatroom/{publicRoomId}/public")
    public ChatMessage receivePublicMessage(@Payload ChatMessage chatMessage) {
        System.out.println(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/private-message")
    @Transactional
    public ChatMessage receivePrivateMessage(@Payload ChatMessage chatMessage) {
        Room room = roomService.findById(chatMessage.getRoomId()).orElseThrow(() -> new IllegalArgumentException("Not found room at id: " + chatMessage.getRoomId()));
        User senderUser = userService.findByUsername(chatMessage.getSenderName()).orElseThrow(() -> new IllegalArgumentException("Not found user at username: " + chatMessage.getSenderName()));
        Chat newChat = Chat.builder()
                .createdTime(System.currentTimeMillis())
                .displayStatus(true)
                .user(senderUser)
                .room(room)
                .build();
        ChatType textChatType = null;
        switch (chatMessage.getChatContentType()) {
            case "TEXT":
                textChatType = chatTypeService.findByName(ChatContentType.TEXT).orElseThrow(() -> new IllegalArgumentException("Not found content type at: " + chatMessage.getChatContentType()));
                newChat.setContent(chatMessage.getContent());
                break;
            case "IMG":
                textChatType = chatTypeService.findByName(ChatContentType.IMG).orElseThrow(() -> new IllegalArgumentException("Not found content type at: " + chatMessage.getChatContentType()));
                newChat.setUrl(chatMessage.getContent());
                break;
            case "VIDEO":
                textChatType = chatTypeService.findByName(ChatContentType.VIDEO).orElseThrow(() -> new IllegalArgumentException("Not found content type at: " + chatMessage.getChatContentType()));
                newChat.setUrl(chatMessage.getContent());
                break;
            case "FILE":
                textChatType = chatTypeService.findByName(ChatContentType.FILE).orElseThrow(() -> new IllegalArgumentException("Not found content type at: " + chatMessage.getChatContentType()));
                newChat.setUrl(chatMessage.getContent());
                newChat.setSize(chatMessage.getSize());
                break;
        }
        newChat.setChatType(textChatType);
        chatService.save(newChat);
        UserRoom userRoomSender = userRoomService.findByUserIdAndRoomId(senderUser.getId(), room.getId()).orElseThrow(() -> new RuntimeException("Not found userRoom at userId: " + senderUser.getId() + " and roomId: " + room.getId()));
        long lastAccessTime = System.currentTimeMillis();
        userRoomSender.setLatsAccess(lastAccessTime);
        UserRoom justUpdateUserRoomSenderUser = userRoomService.save(userRoomSender);

        if (chatMessage.getSenderName().equals(chatMessage.getReceiverName())) {
            simpMessagingTemplate.convertAndSendToUser(
                    chatMessage.getReceiverName(),
                    "/private",
                    justUpdateUserRoomSenderUser
            );
        } else {
            User receiverUser = userService.findByUsername(chatMessage.getReceiverName()).orElseThrow(() -> new IllegalArgumentException("Not found user at username: " + chatMessage.getSenderName()));
            UserRoom userRoomReceiver = userRoomService.findByUserIdAndRoomId(receiverUser.getId(), room.getId()).orElseThrow(() -> new RuntimeException("Not found userRoom at userId: " + receiverUser.getId() + " and roomId: " + room.getId()));
//            userRoomReceiver.setLatsAccess(lastAccessTime);
//            UserRoom justUpdateUserRoomReceivedUser = userRoomService.save(userRoomReceiver);
            simpMessagingTemplate.convertAndSendToUser(
                    chatMessage.getSenderName(),
                    "/private",
                    justUpdateUserRoomSenderUser
            );
            simpMessagingTemplate.convertAndSendToUser(
                    chatMessage.getReceiverName(),
                    "/private",
                    userRoomReceiver
            );
        }


        return chatMessage;
    }

}
