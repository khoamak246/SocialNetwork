package com.back_end.dto.request;

import lombok.*;

import javax.persistence.Entity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentForm {

    private String content;
    private Long userId;
    private Long postId;

}
