package com.back_end.service.serviceIMPL;

import com.back_end.model.Role;
import com.back_end.model.RoleName;
import com.back_end.repository.IRoleRepository;
import com.back_end.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceIMPL implements IRoleService {

    private final IRoleRepository roleService;

    @Override
    public Optional<Role> findByName(RoleName name) {
        return roleService.findByName(name);
    }
}
