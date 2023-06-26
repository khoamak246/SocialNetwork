package com.back_end.service;

import com.back_end.model.User;
import com.back_end.service.design.IGenericService;

import java.util.List;
import java.util.Optional;

public interface IUserService extends IGenericService<User> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByPhoneNumber(String phoneNumber);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    List<User> findByFullNameContainingIgnoreCase(String name);
    List<User> findByPhoneNumberContainingIgnoreCase(String phoneNumber);
    List<User> findByEmailContainingIgnoreCase(String phoneNumber);
    boolean existsById(Long id);
    List<User> findByFollowerId(Long followedId);

}
