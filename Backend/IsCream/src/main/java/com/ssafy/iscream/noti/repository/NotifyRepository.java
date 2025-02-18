package com.ssafy.iscream.noti.repository;

import com.ssafy.iscream.noti.domain.Notify;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotifyRepository extends JpaRepository<Notify, Integer> {
    List<Notify> findAllByUserId(Integer userId);
}
