package com.ssafy.iscream.htpTest.repository;

import com.ssafy.iscream.htpTest.domain.HtpTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HtpTestRepository extends JpaRepository<HtpTest, Integer> {
    @Query("SELECT h FROM HtpTest h WHERE h.childId = :childId AND h.createdAt >= :startDate AND h.createdAt < :endDate")
    List<HtpTest> findByChildIdAndCreatedAtBetween(
            @Param("childId") int childId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT h FROM HtpTest h WHERE h.childId = :childId AND FUNCTION('DATE', h.createdAt) = :selectedDate")
    Optional<HtpTest> findByChildIdAndDate(
            @Param("childId") int childId,
            @Param("selectedDate") LocalDate selectedDate
    );

    List<HtpTest> findByChildId(Integer childId);

    HtpTest findByHtpTestId(Integer htpTestId);

    Optional<HtpTest> findFirstByChildIdOrderByCreatedAtDesc(Integer childId);

    @Query(value = "SELECT h.pdf_url FROM htp_test h WHERE h.child_id IN :childIds AND h.pdf_url IS NOT NULL " +
            "UNION " +
            "SELECT h.house_drawing_url FROM htp_test h WHERE h.child_id IN :childIds AND h.house_drawing_url IS NOT NULL " +
            "UNION " +
            "SELECT h.tree_drawing_url FROM htp_test h WHERE h.child_id IN :childIds AND h.tree_drawing_url IS NOT NULL " +
            "UNION " +
            "SELECT h.male_drawing_url FROM htp_test h WHERE h.child_id IN :childIds AND h.male_drawing_url IS NOT NULL " +
            "UNION " +
            "SELECT h.female_drawing_url FROM htp_test h WHERE h.child_id IN :childIds AND h.female_drawing_url IS NOT NULL",
            nativeQuery = true)
    List<String> findHtpFileUrlsByChildIds(@Param("childIds") List<Integer> childIds);
}
