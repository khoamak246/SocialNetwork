package com.back_end.service.serviceIMPL;

import com.back_end.model.UserRoom;
import com.back_end.repository.IUserRoomRepository;
import com.back_end.service.IUserRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserRoomServiceIMPL implements IUserRoomService {

    private final IUserRoomRepository userRoomRepository;

    @Override
    public List<UserRoom> findAll() {
        return userRoomRepository.findAll();
    }

    @Override
    public Optional<UserRoom> findById(Long id) {
        return userRoomRepository.findById(id);
    }

    @Override
    public UserRoom save(UserRoom userRoom) {
        return userRoomRepository.save(userRoom);
    }

    @Override
    public void deleteById(Long id) {
        userRoomRepository.deleteById(id);
    }


    @Override
    public List<UserRoom> findByUserIdOrderByLatsAccessDesc(Long userId) {
        return userRoomRepository.findByUserIdOrderByLatsAccessDesc(userId);
    }

    @Override
    public Optional<UserRoom> findByUserIdAndRoomId(Long userId, Long roomId) {
        return userRoomRepository.findByUserIdAndRoomId(userId, roomId);
    }


}
