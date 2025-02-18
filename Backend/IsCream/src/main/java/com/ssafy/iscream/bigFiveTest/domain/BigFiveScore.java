package com.ssafy.iscream.bigFiveTest.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "big_five_score")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BigFiveScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bigFiveScoreId;

    @Column(nullable = false)
    private String bigFiveType;

    @Column(nullable = false)
    private Integer totalUsers;

    @Column(nullable = false)
    private Double totalScore;

    @Column(nullable = false)
    private Double averageScore;
}
