package com.ssafy.iscream.bigFiveTest.repository;

import com.ssafy.iscream.bigFiveTest.domain.BigFiveScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BigFiveScoreRepository extends JpaRepository<BigFiveScore, Integer> {
    BigFiveScore findByBigFiveType(String type);
}
