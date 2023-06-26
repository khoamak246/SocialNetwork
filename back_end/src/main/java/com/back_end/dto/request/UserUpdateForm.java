package com.back_end.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.Column;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateForm {

    private String fullName;
    private String phoneNumber;
    private String email;
    private String introduce;
    private String currentPassword;
    private String newPassword;
    private String avatarUrl;
    private List<String> updateField;
}
