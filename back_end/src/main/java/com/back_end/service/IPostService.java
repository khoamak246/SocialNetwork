package com.back_end.service;

import com.back_end.model.Post;
import com.back_end.service.design.IGenericService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPostService extends IGenericService<Post> {
    List<Post> findByUserId(Long id);
    List<Post> findByUserIdAndTypeAndCreatedDate(Long userId, boolean type, String createdDate);
    Page<Post> findByUserIdAndCreatedDateAndType(Long id, String createdDate, boolean type, Pageable pageable);
}
