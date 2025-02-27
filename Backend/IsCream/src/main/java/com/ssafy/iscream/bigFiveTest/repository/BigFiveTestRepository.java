package com.ssafy.iscream.bigFiveTest.repository;

import com.ssafy.iscream.bigFiveTest.domain.BigFiveTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BigFiveTestRepository extends JpaRepository<BigFiveTest, Integer> {
    @Query("SELECT b FROM BigFiveTest b WHERE b.childId = :childId ORDER BY b.testDate DESC, b.testId DESC LIMIT 1")
    BigFiveTest findFirstByChildIdOrderByTestDateDesc(@Param("childId") Integer childId);

    @Query("SELECT b.pdfUrl FROM BigFiveTest b WHERE b.childId = :childId AND b.pdfUrl IS NOT NULL")
    List<String> findPdfUrlByChildIdIn(@Param("childId") Integer childId);

    @Query("SELECT b FROM BigFiveTest b " +
            "WHERE b.userId = :userId " +
            "AND b.testDate BETWEEN :startDate AND :endDate " +
            "ORDER BY b.testDate DESC")
    List<BigFiveTest> findByUserIdAndDate(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    BigFiveTest findFirstByChildIdOrderByCreatedAtDesc(Integer childId);
}
