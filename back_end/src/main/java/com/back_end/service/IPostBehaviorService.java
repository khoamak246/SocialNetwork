package com.back_end.service;

import com.back_end.model.PostBehavior;
import com.back_end.service.design.IGenericService;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IPostBehaviorService extends IGenericService<PostBehavior> {
    List<PostBehavior> findByPostId(Long postId);
    Optional<PostBehavior> findByPostIdAndUserIdAndType(Long postId, Long userId, String type);
    void deleteByBehaviorById(@Param("postId") Long id);
}
