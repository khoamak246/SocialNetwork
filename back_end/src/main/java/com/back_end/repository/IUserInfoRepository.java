package com.back_end.repository;


import com.back_end.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface IUserInfoRepository extends JpaRepository<UserInfo, Long> {
}
