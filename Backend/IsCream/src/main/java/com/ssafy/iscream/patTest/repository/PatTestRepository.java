package com.ssafy.iscream.patTest.repository;

import com.ssafy.iscream.patTest.domain.PatTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PatTestRepository extends JpaRepository<PatTest, Integer> {
    @Query("SELECT p FROM PatTest p WHERE p.userId = :user ORDER BY p.testDate DESC LIMIT 1")
    Optional<PatTest> findLatestByUserId(@Param("userId") Integer userId);

    @Query("SELECT p FROM PatTest p " +
            "WHERE p.userId = :userId " +
            "AND p.testDate BETWEEN :startDate AND :endDate " +
            "ORDER BY p.testDate DESC")
    List<PatTest> findByUserIdAndDate(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
