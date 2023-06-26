package com.back_end.repository;

import com.back_end.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {

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
