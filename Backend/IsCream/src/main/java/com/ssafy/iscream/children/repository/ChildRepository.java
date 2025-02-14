package com.ssafy.iscream.children.repository;

import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChildRepository extends JpaRepository<Child, Integer> {
    List<Child> findAllByUserIdAndStatus(Integer userId, Status status);

    Child findByChildId(Integer childId);
}
