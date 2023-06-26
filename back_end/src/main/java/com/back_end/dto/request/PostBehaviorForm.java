package com.back_end.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostBehaviorForm {

    private Long postId;
    private Long userId;
    private String type;

}
