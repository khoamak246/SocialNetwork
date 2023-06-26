package com.back_end.dto.request;

import com.back_end.utils.constant.ValidationRegex;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignInForm {

    @Pattern(regexp = ValidationRegex.LOGIN_USERNAME_REGEX)
    private String username;

    @Pattern(regexp = ValidationRegex.PASSWORD_REGEX)
    private String password;
}
