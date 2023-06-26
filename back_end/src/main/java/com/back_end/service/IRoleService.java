package com.back_end.service;

import com.back_end.model.Role;
import com.back_end.model.RoleName;

import java.util.Optional;

public interface IRoleService {
    Optional<Role> findByName(RoleName name);
}
