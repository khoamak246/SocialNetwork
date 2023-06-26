package com.back_end.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportForm {

    private Long userId;
    private Long postId;
    private Long reportReason;

}
