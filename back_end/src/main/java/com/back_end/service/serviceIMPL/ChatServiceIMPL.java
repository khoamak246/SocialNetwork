package com.back_end.service.serviceIMPL;

import com.back_end.model.Chat;
import com.back_end.repository.IChatRepository;
import com.back_end.service.IChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceIMPL implements IChatService {

    private final IChatRepository chatRepository;

    @Override
    public List<Chat> findAll() {
        return chatRepository.findAll();
    }

    @Override
    public Optional<Chat> findById(Long id) {
        return chatRepository.findById(id);
    }

    @Override
    public Chat save(Chat chat) {
        return chatRepository.save(chat);
    }

    @Override
    public void deleteById(Long id) {
        chatRepository.deleteById(id);
    }
}
