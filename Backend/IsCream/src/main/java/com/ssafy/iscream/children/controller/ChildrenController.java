package com.ssafy.iscream.children.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.children.dto.req.ChildrenCreateReq;
import com.ssafy.iscream.children.dto.req.ChildrenUpdateReq;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/children")
@Tag(name = "children")
public class ChildrenController {

    private final ChildrenService childrenService;


    @GetMapping()
    @Operation(summary = "전체 자녀 목록 조회")
    public ResponseEntity<?> getChildren(@Login User user) {
        return ResponseUtil.success(childrenService.getChildren(user.getUserId()));
    }

    @PostMapping()
    @Operation(summary = "자녀 등록(생년월일, 닉네임, 성별)")
    public ResponseEntity<?> createChildren(@Login User user, @RequestBody ChildrenCreateReq childrenCreateReq){
        childrenService.createChildren(user.getUserId(), childrenCreateReq);
        return ResponseUtil.success();
    }

    @PutMapping()
    @Operation(summary = "자녀 수정(생년월일, 닉네임, 성별)")
    public ResponseEntity<?> updateChildren(@Login User user, @RequestBody ChildrenUpdateReq childrenUpdateReq){
        childrenService.updateChildren(user.getUserId(), childrenUpdateReq);
        return ResponseUtil.success();
    }

    @DeleteMapping("/{childrenId}")
    @Operation(summary = "자녀 삭제")
    public ResponseEntity<?> deleteChildren(@Login User user, @PathVariable Integer childrenId){
        childrenService.deleteChildren(user.getUserId(), childrenId);
        return ResponseUtil.success();
    }

}
