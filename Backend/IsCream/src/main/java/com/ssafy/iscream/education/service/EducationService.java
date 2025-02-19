package com.ssafy.iscream.education.service;

import com.ssafy.iscream.education.domain.Education;
import com.ssafy.iscream.education.domain.RecommendType;
import com.ssafy.iscream.education.dto.res.EducationsGetRes;
import com.ssafy.iscream.education.repository.EducationRepository;
import com.ssafy.iscream.htpTest.domain.Emoji;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {


    private final EducationRepository educationRepository;


    public List<EducationsGetRes> getAll() {
        List<Education> educationList =  educationRepository.findAll();
        List<EducationsGetRes> educationsGetResList = new ArrayList<>();
        for(Education education : educationList){
            educationsGetResList.add(new EducationsGetRes(education));
        }
        return educationsGetResList;
    }

    public List<EducationsGetRes> getByRecommendType(RecommendType recommendType) {
        List<Education> educationList = educationRepository.findAllByRecommendType(recommendType);
        List<EducationsGetRes> educationsGetResList = new ArrayList<>();
        for(Education education : educationList){
            educationsGetResList.add(new EducationsGetRes(education));
        }
        return educationsGetResList;
    }
}
