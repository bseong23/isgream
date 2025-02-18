package com.ssafy.iscream.bigFiveTest.repository;

import com.ssafy.iscream.bigFiveTest.domain.BigFiveQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BigFiveQuestionRepository extends JpaRepository<BigFiveQuestion, Integer> {
    List<BigFiveQuestion> findAll();
}
