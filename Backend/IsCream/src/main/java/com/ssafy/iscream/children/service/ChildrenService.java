package com.ssafy.iscream.children.service;

import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.domain.Gender;
import com.ssafy.iscream.children.domain.Status;
import com.ssafy.iscream.children.dto.req.ChildrenCreateReq;
import com.ssafy.iscream.children.dto.req.ChildrenUpdateReq;
import com.ssafy.iscream.children.dto.res.ChildrenGetRes;
import com.ssafy.iscream.children.repository.ChildRepository;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException.DataException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChildrenService {

    private final ChildRepository childRepository;

    public List<ChildrenGetRes> getChildren(Integer userId) {
        // 삭제되지 않은 자녀 정보만 가져오기
        List<Child> children = childRepository.findAllByUserIdAndStatus(userId, Status.USED);

        List<ChildrenGetRes> childrenGetResList = new ArrayList<>();
        for (Child child : children) {
            ChildrenGetRes childrenGetRes = ChildrenGetRes.builder()
                    .childId(child.getChildId())
                    .nickname(child.getNickname())
                    .birthDate(child.getBirthDate())
                    .gender(child.getGender().name())
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
                .gender(Gender.valueOf(childrenCreateReq.getGender()))
                .build();

        childRepository.save(child);
    }

    @Transactional
    public void updateChildren(Integer userId, ChildrenUpdateReq childrenUpdateReq) {
        Child childOriginal = childRepository.findById(childrenUpdateReq.getChildId())
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        if (!userId.equals(childOriginal.getUserId())) {
            throw new DataException(ErrorCode.DATA_FORBIDDEN_ACCESS);
        }

        childOriginal.updateChild(childrenUpdateReq.getNickname(), childrenUpdateReq.getBirthDate(),
                Gender.valueOf(childrenUpdateReq.getGender()));

//        childRepository.save(childOriginal);
    }

    @Transactional
    public void deleteChildren(Integer userId, Integer childrenId) {
        Child childOriginal = childRepository.findById(childrenId)
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        if (!userId.equals(childOriginal.getUserId())) {
            throw new DataException(ErrorCode.DATA_FORBIDDEN_ACCESS);
        }

        childOriginal.deleteChild(); // 자녀 정보 삭제 (삭제 상태로 변경)
    }

    public Child getById(Integer childId) {
        return childRepository.findById(childId).orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));
    }

    public void checkAccess(Integer userId, Integer childId) {
        Child child = childRepository.findById(childId).orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        if (!child.getUserId().equals(userId)) {
            throw new DataException(ErrorCode.DATA_FORBIDDEN_ACCESS);
        }
    }

    // 자녀 삭제
    public void deleteChild(List<Integer> childIds) {
        childRepository.deleteAllById(childIds);
    }

    // 삭제할 자녀 리스트 가져오기
    public List<Integer> getDeleteChildId() {
        return childRepository.findChildIdsByStatus(Status.DELETED);
    }
}
