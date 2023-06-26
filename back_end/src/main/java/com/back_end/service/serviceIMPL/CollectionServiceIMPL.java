package com.back_end.service.serviceIMPL;

import com.back_end.model.Collection;
import com.back_end.repository.ICollectionRepository;
import com.back_end.service.ICollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CollectionServiceIMPL implements ICollectionService {

    private final ICollectionRepository collectionRepository;

    @Override
    public List<Collection> findAll() {
        return collectionRepository.findAll();
    }

    @Override
    public Optional<Collection> findById(Long id) {
        return collectionRepository.findById(id);
    }

    @Override
    public Collection save(Collection collection) {
        return collectionRepository.save(collection);
    }

    @Override
    public void deleteById(Long id) {
        collectionRepository.deleteById(id);
    }

    @Override
    public List<Collection> findByUserId(Long userId) {
        return collectionRepository.findByUserId(userId);
    }

    @Override
    public boolean existsByIdAndPostId(Long id, Long PostId) {
        return collectionRepository.existsByIdAndPostId(id, PostId);
    }

    @Override
    public void deleteByCollectionId(Long id) {
        collectionRepository.deleteByCollectionId(id);
    }
}
