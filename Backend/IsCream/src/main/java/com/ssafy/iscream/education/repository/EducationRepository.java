package com.ssafy.iscream.education.repository;

import com.ssafy.iscream.education.domain.Education;
import com.ssafy.iscream.education.domain.RecommendType;
import com.ssafy.iscream.htpTest.domain.Emoji;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Integer> {
    List<Education> findAllByRecommendType(RecommendType recommendType);
}
