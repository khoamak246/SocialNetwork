package com.back_end.repository;

import com.back_end.model.UserRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRoomRepository extends JpaRepository<UserRoom, Long> {
    List<UserRoom> findByUserIdOrderByLatsAccessDesc(Long userId);
    Optional<UserRoom> findByUserIdAndRoomId(Long userId, Long roomId);
}
