package com.back_end.repository;

import com.back_end.model.ChatContentType;
import com.back_end.model.ChatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IChatTypeRepository extends JpaRepository<ChatType, Long> {
    Optional<ChatType> findByName(ChatContentType name);
}
