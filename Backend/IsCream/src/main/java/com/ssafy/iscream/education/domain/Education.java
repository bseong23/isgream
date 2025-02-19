package com.ssafy.iscream.education.domain;

import com.ssafy.iscream.htpTest.domain.Emoji;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer EducationId;
    String title;
    String description;
    String url;
    String thumbnailUrl;
    @Enumerated(EnumType.STRING)
    RecommendType recommendType;
}
