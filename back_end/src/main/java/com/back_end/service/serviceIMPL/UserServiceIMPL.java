package com.back_end.service.serviceIMPL;

import com.back_end.model.User;
import com.back_end.repository.IUserRepository;
import com.back_end.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceIMPL implements IUserService {

    private final IUserRepository userRepository;

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    @Override
    public List<User> findByFullNameContainingIgnoreCase(String name) {
        return userRepository.findByFullNameContainingIgnoreCase(name);
    }

    @Override
    public List<User> findByPhoneNumberContainingIgnoreCase(String phoneNumber) {
        return userRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber);
    }

    @Override
    public List<User> findByEmailContainingIgnoreCase(String phoneNumber) {
        return userRepository.findByEmailContainingIgnoreCase(phoneNumber);
    }

    @Override
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

    @Override
    public List<User> findByFollowerId(Long followedId) {
        return userRepository.findByFollowerId(followedId);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
