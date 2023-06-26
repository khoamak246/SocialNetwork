package com.back_end.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateForm {

    @NotEmpty
    private String content;

    @NotEmpty
    private String location;

    @NotEmpty
    private String privacy;

    @NotEmpty
    private String type;

    private Set<String> listImg;

    private Long userId;

}
