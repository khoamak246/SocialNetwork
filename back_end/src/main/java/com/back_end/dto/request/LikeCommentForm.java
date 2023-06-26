package com.back_end.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikeCommentForm {

    private Long userId;
    private Long commentId;

}
