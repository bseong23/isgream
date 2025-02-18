package com.ssafy.iscream.education.dto.res;

import com.ssafy.iscream.education.domain.Education;
import lombok.Data;

@Data
public class EducationsGetRes {
    String title;
    String description;
    String imageUrl;
    String videoUrl;
    public EducationsGetRes(Education education){
        title = education.getTitle();
        description = education.getDescription();
        imageUrl = education.getThumbnailUrl();
        videoUrl = education.getUrl();
    }
}
