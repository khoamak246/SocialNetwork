package com.back_end.service;

import com.back_end.model.UserRoom;
import com.back_end.service.design.IGenericService;

import java.util.List;
import java.util.Optional;

public interface IUserRoomService extends IGenericService<UserRoom> {
    List<UserRoom> findByUserIdOrderByLatsAccessDesc(Long userId);
    Optional<UserRoom> findByUserIdAndRoomId(Long userId, Long roomId);
}
