package com.back_end.repository;

import com.back_end.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IChatRepository extends JpaRepository<Chat, Long> {
}
