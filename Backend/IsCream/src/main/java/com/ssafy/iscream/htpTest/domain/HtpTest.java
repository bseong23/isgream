package com.ssafy.iscream.htpTest.domain;

import com.ssafy.iscream.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class HtpTest extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer htpTestId;

    @Column(nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private Integer childId;

    private LocalDate testDate;

    @Column(length = 1024)
    private String houseDrawingUrl;

    @Column(length = 1024)
    private String treeDrawingUrl;

    @Column(length = 1024)
    private String maleDrawingUrl;

    @Column(length = 1024)
    private String femaleDrawingUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String analysisResult;

    @Column(length = 1024)
    private String pdfUrl;

    private Emoji emoji;
}
