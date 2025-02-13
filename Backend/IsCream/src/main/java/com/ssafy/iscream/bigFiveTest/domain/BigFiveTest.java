package com.ssafy.iscream.bigFiveTest.domain;

import com.ssafy.iscream.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

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
    private Integer userId;

    @Column(name = "test_date",nullable = false)
    private String date;

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