package com.ssafy.iscream.patTest.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "pat_question")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatQuestion {
    @Id
    private Integer questionId;
    @Column(nullable = false)
    private String question;
    @Column(nullable = false)
    private String answer1;
    @Column(nullable = false)
    private String answer2;
    @Column(nullable = false)
    private String answer3;
}
