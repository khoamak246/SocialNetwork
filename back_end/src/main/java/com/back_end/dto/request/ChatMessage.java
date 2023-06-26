package com.back_end.dto.request;

import com.back_end.model.ChatContentType;
import com.back_end.model.ChatMessageStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ChatMessage {

    private String senderName;
    private String receiverName;
    private String content;
    private double size;
    private String chatContentType;
    private Long roomId;
    private ChatMessageStatus chatMessageStatus;

}
