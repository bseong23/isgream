package com.ssafy.iscream.patTest.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "pat_test")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pat_test_id")
    private Integer patTestId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    @Column(name = "a_score", nullable = false)
    private Integer aScore;

    @Column(name = "b_score", nullable = false)
    private Integer bScore;

    @Column(name = "c_score", nullable = false)
    private Integer cScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultType result;

    @Column(name = "pdf_url")
    private String pdfUrl;

    public enum ResultType {
        A("A형 : 허용형/익애적 양육태도"),
        B("B형 : 권위주의적 양육태도"),
        C("C형 : 민주적/균형잡힌 양육태도");

        private final String description;

        ResultType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
