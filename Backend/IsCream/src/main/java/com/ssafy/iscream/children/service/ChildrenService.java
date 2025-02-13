package com.ssafy.iscream.children.service;

import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.dto.req.ChildrenCreateReq;
import com.ssafy.iscream.children.dto.req.ChildrenUpdateReq;
import com.ssafy.iscream.children.dto.res.ChildrenGetRes;
import com.ssafy.iscream.children.repository.ChildRepository;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.NotFoundException;
import com.ssafy.iscream.common.exception.UnauthorizedException;
import com.ssafy.iscream.common.response.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// TODO: 기능 완성 후 에러 처리 다룰 예정
@Service
@RequiredArgsConstructor
public class ChildrenService {

    private final ChildRepository childRepository;

    public List<ChildrenGetRes> getChildren(Integer userId) {
        List<Child> children = childRepository.findAllByUserId(userId);

        List<ChildrenGetRes> childrenGetResList = new ArrayList<>();
        for (Child child : children) {
            ChildrenGetRes childrenGetRes = ChildrenGetRes.builder()
                    .childId(child.getChildId())
                    .nickname(child.getNickname())
                    .birthDate(child.getBirthDate())
                    .gender(child.getGender())
                    .build();
            childrenGetResList.add(childrenGetRes);
        }

        return childrenGetResList;
    }



    public void createChildren(Integer userId, ChildrenCreateReq childrenCreateReq) {
        Child child = Child.builder()
                .userId(userId)
                .nickname(childrenCreateReq.getNickname())
                .birthDate(childrenCreateReq.getBirthDate())
                .gender(childrenCreateReq.getGender())
                .build();
        childRepository.save(child);
    }


    public void updateChildren(Integer userId, ChildrenUpdateReq childrenUpdateReq) {
        Child childOriginal = childRepository.findById(childrenUpdateReq.getChildId())
                .orElseThrow(() -> new NotFoundException(new ResponseData<>(ErrorCode.DATA_NOT_FOUND.getCode(), ErrorCode.DATA_NOT_FOUND.getMessage(), null)));

        if (!userId.equals(childOriginal.getUserId())) {
            throw new UnauthorizedException(new ResponseData<>((ErrorCode.DATA_FORBIDDEN_ACCESS.getCode()),ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }

        childOriginal.updateChild(childrenUpdateReq.getNickname(), childrenUpdateReq.getBirthDate(), childrenUpdateReq.getGender());
        childRepository.save(childOriginal);

    }



    public void deleteChildren(Integer userId, Integer childrenId) {
        Child childOriginal = childRepository.findById(childrenId)
                .orElseThrow(() -> new NotFoundException(
                        new ResponseData<>(ErrorCode.DATA_NOT_FOUND.getCode(), ErrorCode.DATA_NOT_FOUND.getMessage(), null)));

        if (!userId.equals(childOriginal.getUserId())) {
            throw new UnauthorizedException(
                    new ResponseData<>(ErrorCode.DATA_FORBIDDEN_ACCESS.getCode(), ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }

        childRepository.delete(childOriginal);
    }

    public Child getById(Integer childId) {
        return childRepository.findById(childId).orElseThrow(() -> new NotFoundException(
                new ResponseData<>(ErrorCode.DATA_NOT_FOUND.getCode(), ErrorCode.DATA_NOT_FOUND.getMessage(), null)));
    }

    public void checkAccess(Integer userId, Integer childId) {
        Child child = childRepository.findById(childId).orElseThrow(() -> new NotFoundException(
                new ResponseData<>(ErrorCode.DATA_NOT_FOUND.getCode(), ErrorCode.DATA_NOT_FOUND.getMessage(), null)));

        if (!child.getUserId().equals(userId)) {
            throw new UnauthorizedException(new ResponseData<>(ErrorCode.DATA_FORBIDDEN_ACCESS.getCode(), ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }
    }
}
