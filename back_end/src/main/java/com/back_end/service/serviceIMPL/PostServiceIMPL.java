package com.back_end.service.serviceIMPL;

import com.back_end.model.Post;
import com.back_end.repository.IPostRepository;
import com.back_end.service.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostServiceIMPL implements IPostService {

    private final IPostRepository postRepository;

    @Override
    public List<Post> findAll() {
        return postRepository.findAll();
    }

    @Override
    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    @Override
    public Post save(Post post) {
        return postRepository.save(post);
    }

    @Override
    public void deleteById(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public List<Post> findByUserId(Long id) {
        return postRepository.findByUserId(id);
    }

    @Override
    public List<Post> findByUserIdAndTypeAndCreatedDate(Long userId, boolean type, String createdDate) {
        return postRepository.findByUserIdAndTypeAndCreatedDate(userId, type, createdDate);
    }

    @Override
    public Page<Post> findByUserIdAndCreatedDateAndType(Long id, String createdDate, boolean type, Pageable pageable) {
        return postRepository.findByUserIdAndCreatedDateAndType(id, createdDate, type, pageable);
    }


}
