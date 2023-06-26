package com.back_end.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {

    private String status;
    private long expiredTime;
    private String type;
    private String token;
    private String fullName;
    private Collection<? extends GrantedAuthority> roles;

}
