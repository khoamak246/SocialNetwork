package com.back_end.repository;

import com.back_end.model.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserId(Long userId);
    boolean existsByIdAndPostId(Long id, Long PostId);

    @Modifying
    @Transactional
    @Query(value = "delete from collection where id = ?1", nativeQuery = true)
    void deleteByCollectionId(Long id);
}
