package com.back_end.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomCreateForm {
    private String name;
    private Long creatorUser;
    private List<Long> userList;

}
