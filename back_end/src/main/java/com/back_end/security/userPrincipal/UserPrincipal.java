package com.back_end.security.userPrincipal;

import com.back_end.model.User;
import com.back_end.model.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Column;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPrincipal implements UserDetails {


    private Long id;
    private String fullName;
    private String username;
    private String phoneNumber;
    private String email;
    private String password;
    private UserInfo userInfo;
    private Collection<? extends GrantedAuthority> roles;


    public static UserPrincipal build(User user) {
        List<GrantedAuthority> grantedAuthorities = user.getRoles().stream().map(
                role -> new SimpleGrantedAuthority(role.getName().name())
        ).collect(Collectors.toList());

        return UserPrincipal.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .userInfo(user.getUserInfo())
                .roles(grantedAuthorities)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
