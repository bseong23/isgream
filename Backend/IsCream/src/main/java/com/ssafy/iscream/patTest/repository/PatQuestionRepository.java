package com.ssafy.iscream.patTest.repository;

import com.ssafy.iscream.patTest.domain.PatQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatQuestionRepository extends JpaRepository<PatQuestion, Integer> {

}
