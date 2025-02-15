package com.ssafy.iscream.bigFiveTest.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "big_five_test")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BigFiveTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "big_five_test_id")
    private Integer testId;

    @Column(nullable = false)
    private Integer childId;

    @Column(nullable = false)
    private Integer userId;

    private LocalDate testDate;

    @Column(nullable = false)
    private Double conscientiousness;

    @Column(nullable = false)
    private Double agreeableness;

    @Column(nullable = false)
    private Double emotionalStability;

    @Column(nullable = false)
    private Double extraversion;

    @Column(nullable = false)
    private Double openness;

    @Column
    private String pdfUrl;
}