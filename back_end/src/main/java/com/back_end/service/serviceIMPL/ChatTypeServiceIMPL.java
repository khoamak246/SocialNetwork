package com.back_end.service.serviceIMPL;

import com.back_end.model.ChatContentType;
import com.back_end.model.ChatType;
import com.back_end.repository.IChatTypeRepository;
import com.back_end.service.IChatTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatTypeServiceIMPL implements IChatTypeService {

    private final IChatTypeRepository chatTypeRepository;

    @Override
    public Optional<ChatType> findByName(ChatContentType name) {
        return chatTypeRepository.findByName(name);
    }
}
