package com.back_end.repository;

import com.back_end.model.PostImg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPostImgRepository extends JpaRepository<PostImg, Long> {
}
