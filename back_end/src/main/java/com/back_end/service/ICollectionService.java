package com.back_end.service;


import com.back_end.model.Collection;
import com.back_end.service.design.IGenericService;

import java.util.List;

public interface ICollectionService extends IGenericService<Collection> {
    List<Collection> findByUserId(Long userId);
    boolean existsByIdAndPostId(Long id, Long PostId);
    void deleteByCollectionId(Long id);
}
