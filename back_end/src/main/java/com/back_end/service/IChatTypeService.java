package com.back_end.service;

import com.back_end.model.ChatContentType;
import com.back_end.model.ChatType;

import java.util.Optional;

public interface IChatTypeService {
    Optional<ChatType> findByName(ChatContentType name);
}
