package com.back_end.dto.request;

import com.back_end.utils.constant.ValidationRegex;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Pattern;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignUpForm {

    @Pattern(regexp = ValidationRegex.FULL_NAME_REGEX)
    private String fullName;

    @Pattern(regexp = ValidationRegex.USER_NAME_REGEX)
    private String username;

    @Pattern(regexp = ValidationRegex.PASSWORD_REGEX)
    private String password;

    @Pattern(regexp = ValidationRegex.PHONE_NUMBER_REGEX)
    private String phoneNumber;

    @Pattern(regexp = ValidationRegex.EMAIL_REGEX)
    private String email;

    private Set<String> roles;

}
