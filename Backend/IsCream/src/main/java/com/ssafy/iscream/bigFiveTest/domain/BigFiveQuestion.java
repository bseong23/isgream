package com.ssafy.iscream.bigFiveTest.domain;

import com.ssafy.iscream.board.domain.Post;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Table(name = "big_five_question")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BigFiveQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bigFiveQuestionId;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private String questionType;

}