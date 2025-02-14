package com.ssafy.iscream.bigFiveTest.repository;

import com.ssafy.iscream.bigFiveTest.domain.BigFiveQuestion;
import com.ssafy.iscream.bigFiveTest.domain.BigFiveTest;
import com.ssafy.iscream.bigFiveTest.dto.response.BigFiveTestRes;
import com.ssafy.iscream.patTest.domain.PatTest;
import com.ssafy.iscream.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BigFiveTestRepository extends JpaRepository<BigFiveTest, Integer> {
    @Query("SELECT b FROM BigFiveTest b WHERE b.childId = :childId ORDER BY b.date DESC LIMIT 1")
    BigFiveTest findFirstByChildIdOrderByTestDateDesc(@Param("childId") Integer childId);

    List<BigFiveTest> findByChildId(Integer childId);

    List<BigFiveTest> findByUserId(Integer userId);
}
