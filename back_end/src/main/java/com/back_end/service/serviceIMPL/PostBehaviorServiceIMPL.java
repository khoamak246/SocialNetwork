package com.back_end.service.serviceIMPL;

import com.back_end.model.PostBehavior;
import com.back_end.repository.IPostBehaviorRepository;
import com.back_end.service.IPostBehaviorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostBehaviorServiceIMPL implements IPostBehaviorService {

    private final IPostBehaviorRepository postBehaviorRepository;
    @Override
    public List<PostBehavior> findByPostId(Long postId) {
        return postBehaviorRepository.findByPostsId(postId);
    }

    @Override
    public Optional<PostBehavior> findByPostIdAndUserIdAndType(Long postId, Long userId, String type) {
        return postBehaviorRepository.findByPostsIdAndUsersIdAndType(postId, userId, type);
    }

    @Override
    public void deleteByBehaviorById(Long id) {
        postBehaviorRepository.deleteByBehaviorById(id);
    }


    @Override
    public List<PostBehavior> findAll() {
        return postBehaviorRepository.findAll();
    }

    @Override
    public Optional<PostBehavior> findById(Long id) {
        return postBehaviorRepository.findById(id);
    }

    @Override
    public PostBehavior save(PostBehavior postBehavior) {
        return postBehaviorRepository.save(postBehavior);
    }

    @Override
    public void deleteById(Long id) {
        postBehaviorRepository.deleteById(id);
    }
}
