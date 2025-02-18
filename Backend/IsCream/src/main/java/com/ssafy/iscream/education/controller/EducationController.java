package com.ssafy.iscream.education.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.education.dto.req.EducationsGetReq;
import com.ssafy.iscream.education.service.EducationFacade;
import com.ssafy.iscream.education.service.EducationService;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/educations")
@Tag(name = "education")
public class EducationController {

    private final EducationFacade educationFacade;

    @PostMapping
    public ResponseEntity<?> getEducation(@Login User user, @RequestBody EducationsGetReq educationsGetReq) {
        return ResponseUtil.success(educationFacade.getEducations(user.getUserId(), educationsGetReq));
    }


}
