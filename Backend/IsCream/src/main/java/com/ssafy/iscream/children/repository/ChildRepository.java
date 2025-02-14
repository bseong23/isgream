package com.ssafy.iscream.children.repository;

import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChildRepository extends JpaRepository<Child, Integer> {
    List<Child> findAllByUserIdAndStatus(Integer userId, Status status);

    @Query("SELECT c.childId FROM Child c WHERE c.status = :status")
    List<Integer> findChildIdsByStatus(@Param("status") Status status);

}
