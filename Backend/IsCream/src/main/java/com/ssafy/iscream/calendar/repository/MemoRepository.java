package com.ssafy.iscream.calendar.repository;

import com.ssafy.iscream.calendar.domain.Memo;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemoRepository extends JpaRepository<Memo, Integer> {
    @Query("SELECT m FROM Memo m WHERE m.childId = :childId AND m.createdAt >= :startDate AND m.createdAt < :endDate")
    List<Memo> findByChildIdAndCreatedAtBetween(
            @Param("childId") int childId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT m FROM Memo m WHERE m.childId = :childId AND FUNCTION('DATE', m.createdAt) = :selectedDate")
    Optional<Memo> findByChildIdAndDate(
            @Param("childId") Integer childId,
            @Param("selectedDate") LocalDate selectedDate
    );//여기밑

}
