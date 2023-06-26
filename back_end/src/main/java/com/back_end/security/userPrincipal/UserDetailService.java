package com.back_end.security.userPrincipal;

import com.back_end.model.User;
import com.back_end.service.IUserService;
import com.back_end.utils.constant.ValidationRegex;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {

    private final IUserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("FAILED -> NOT FOUND: Not found user at username " + username));

        return UserPrincipal.build(user);
    }
}
