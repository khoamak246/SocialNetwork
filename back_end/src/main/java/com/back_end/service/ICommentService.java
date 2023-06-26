package com.back_end.service;

import com.back_end.model.Comment;
import com.back_end.service.design.IGenericService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICommentService extends IGenericService<Comment> {
}
