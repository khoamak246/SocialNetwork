package com.back_end.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryInDayForm {

    private Long userId;
    private String date;

}
