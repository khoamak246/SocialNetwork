package com.back_end.repository;

import com.back_end.model.PostBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPostBehaviorRepository extends JpaRepository<PostBehavior, Long> {
    List<PostBehavior> findByPostsId(Long postId);
    Optional<PostBehavior> findByPostsIdAndUsersIdAndType(Long postId, Long userId, String type);

    @Modifying
    @Transactional
    @Query(value = "delete from post_behavior where id like ?1", nativeQuery = true)
    void deleteByBehaviorById(Long id);
}
