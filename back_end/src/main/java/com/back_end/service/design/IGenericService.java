package com.back_end.service.design;

import java.util.List;
import java.util.Optional;

public interface IGenericService<T> {

    List<T> findAll();
    Optional<T> findById(Long id);
    T save(T t);
    void deleteById(Long id);


}
