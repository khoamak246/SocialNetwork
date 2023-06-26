package com.back_end.service.serviceIMPL;

import com.back_end.model.PostImg;
import com.back_end.repository.IPostImgRepository;
import com.back_end.service.IPostImgService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostImgServiceIMPL implements IPostImgService {

    private final IPostImgRepository postImgRepository;
    @Override
    public List<PostImg> findAll() {
        return postImgRepository.findAll();
    }

    @Override
    public Optional<PostImg> findById(Long id) {
        return postImgRepository.findById(id);
    }

    @Override
    public PostImg save(PostImg postImg) {
        return postImgRepository.save(postImg);
    }

    @Override
    public void deleteById(Long id) {
        postImgRepository.deleteById(id);
    }
}
