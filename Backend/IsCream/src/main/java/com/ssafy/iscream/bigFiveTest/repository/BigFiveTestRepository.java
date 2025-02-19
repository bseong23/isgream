package com.ssafy.iscream.bigFiveTest.repository;

import com.ssafy.iscream.bigFiveTest.domain.BigFiveTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BigFiveTestRepository extends JpaRepository<BigFiveTest, Integer> {
    @Query(value = "SELECT * FROM big_five_test WHERE child_id = :childId ORDER BY test_date DESC, big_five_test_id DESC LIMIT 1", nativeQuery = true)
    BigFiveTest findFirstByChildIdOrderByTestDateDesc(@Param("childId") Integer childId);

    @Query("SELECT b.pdfUrl FROM BigFiveTest b WHERE b.childId IN :childIds")
    List<String> findPdfUrlByChildIdIn(List<Integer> childIds);

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
