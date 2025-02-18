package com.ssafy.iscream.education.service;

import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.UnauthorizedException;
import com.ssafy.iscream.common.response.ResponseData;
import com.ssafy.iscream.education.dto.req.EducationsGetReq;
import com.ssafy.iscream.education.dto.res.EducationsGetRes;
import com.ssafy.iscream.htpTest.domain.Emoji;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.htpTest.service.HtpTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationFacade {

    private final EducationService educationService;
    private final HtpTestService htpTestService;
    private final ChildrenService childrenService;

    public List<EducationsGetRes> getEducations(Integer userId, EducationsGetReq educationsGetReq) {

        List<EducationsGetRes> educationsGetResList = new ArrayList<>();

        if (educationsGetReq.getRecommend()){
            // 권한 체크
            Child child = childrenService.getById(educationsGetReq.getChildId());
            if(!child.getUserId().equals(userId)){
                throw new UnauthorizedException(new ResponseData<>((ErrorCode.DATA_FORBIDDEN_ACCESS.getCode()),ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
            }
            // 최신 htp 불러오기
            HtpTest htpTest = htpTestService.getLastHtpTest(educationsGetReq.getChildId());
            if (htpTest != null){
                Emoji emoji = htpTest.getEmoji();
                educationsGetResList = educationService.getByEmoji(emoji);
            }
        }
        // htp 없으면 전체 반환
        if (educationsGetResList.isEmpty())
            educationsGetResList = educationService.getAll();

        return educationsGetResList;
    }


}
