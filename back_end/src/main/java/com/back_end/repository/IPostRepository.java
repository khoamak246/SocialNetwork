package com.back_end.repository;

import com.back_end.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long id);
    List<Post> findByUserIdAndTypeAndCreatedDate(Long userId, boolean type, String createdDate);
    Page<Post> findByUserIdAndCreatedDateAndType(Long id, String createdDate, boolean type, Pageable pageable);

}
