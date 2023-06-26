package com.back_end.dto.request;

import lombok.*;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FollowerForm {

    private Long userId;
    private Long followerId;

}
