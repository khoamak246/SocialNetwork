package com.back_end.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NestedCommentForm {

    private Long nestedId;
    private String content;
    private Long userId;
    private Long postId;

}
