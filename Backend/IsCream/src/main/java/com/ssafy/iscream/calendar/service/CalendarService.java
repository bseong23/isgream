package com.ssafy.iscream.calendar.service;

import com.ssafy.iscream.calendar.domain.Memo;
import com.ssafy.iscream.calendar.dto.request.CalendarGetDetailReq;
import com.ssafy.iscream.calendar.dto.request.CalendarGetReq;
import com.ssafy.iscream.calendar.dto.request.MemoCreateReq;
import com.ssafy.iscream.calendar.dto.request.MemoUpdateReq;
import com.ssafy.iscream.calendar.dto.response.CalendarGetDetailRes;
import com.ssafy.iscream.calendar.dto.response.CalendarGetRes;
import com.ssafy.iscream.calendar.repository.MemoRepository;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.common.exception.BadRequestException;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.NotFoundException;
import com.ssafy.iscream.common.exception.UnauthorizedException;
import com.ssafy.iscream.common.response.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final MemoRepository memoRepository;

    public void createMemo(Integer userId, MemoCreateReq memoCreateReq) {
        // 메모길이 0일때 아무것도 안함
        if(memoCreateReq.getMemo().isEmpty())
            return;

        if (memoRepository.existsByChildIdAndSelectedDate(memoCreateReq.getChildId(), memoCreateReq.getSelectedDate()))
            throw new BadRequestException(new ResponseData<>(ErrorCode.DATA_SAVE_FAILED.getCode(), ErrorCode.DATA_SAVE_FAILED.getMessage(),null));



        Memo memo = Memo.builder()
                .userId(userId)
                .childId(memoCreateReq.getChildId())
                .content(memoCreateReq.getMemo())
                .selectedDate(memoCreateReq.getSelectedDate())
                .build();
        memoRepository.save(memo);
    }

    public void updateMemo(Integer userId, MemoUpdateReq memoUpdateReq) {
        // 존재 하지 않을 경우
        Memo memo = memoRepository.findById(memoUpdateReq.getMemoId())
                .orElseThrow(() -> new NotFoundException(
                        new ResponseData<>(ErrorCode.DATA_NOT_FOUND.getCode(), ErrorCode.DATA_NOT_FOUND.getMessage(), null)));




        // 권한 없는 경우
        if (!memo.getUserId().equals(userId)) {
            throw new UnauthorizedException(new ResponseData<>(ErrorCode.DATA_FORBIDDEN_ACCESS.getCode(), ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }

        // 길이 0일 때 삭제 해줌
        if(memoUpdateReq.getMemo().isEmpty()){
            memoRepository.deleteById(memoUpdateReq.getMemoId());
            return;
        }

        memo.updateContent(memoUpdateReq.getMemo());
        memoRepository.save(memo);
    }

    public void deleteMemo(Integer userId, Integer memoId){
        // 존재하지 않을 경우
        Memo memo = memoRepository.findById(memoId)
                .orElseThrow(() -> new NotFoundException(
                        new ResponseData<>(ErrorCode.DATA_NOT_FOUND.getCode(), ErrorCode.DATA_NOT_FOUND.getMessage(), null)));

        // 권한 없는 경우
        if (!memo.getUserId().equals(userId)) {
            throw new UnauthorizedException(new ResponseData<>(ErrorCode.DATA_FORBIDDEN_ACCESS.getCode(), ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }

        memoRepository.deleteById(memoId);
    }

    public List<Integer> getDaysByYearMonth(Integer userId, CalendarGetReq calendarGetReq) {
        LocalDateTime startDate = LocalDateTime.of(calendarGetReq.getYear(), calendarGetReq.getMonth(), 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1); // 다음 달 1일 (해당 월의 끝까지 포함)

        List<Memo> memos = memoRepository.findByChildIdAndCreatedAtBetween(calendarGetReq.getChildId(), startDate, endDate);
        List<Integer> days = new ArrayList<>();
        for (Memo memo : memos) {
            days.add(memo.getSelectedDate().getDayOfMonth());
        }

        // 권한 없는 경우
        if (!memos.isEmpty() && !memos.get(0).getUserId().equals(userId)) {
            throw new UnauthorizedException(new ResponseData<>(ErrorCode.DATA_FORBIDDEN_ACCESS.getCode(), ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }

        return days;

    }

    public Memo getByChildIdDate(Integer userId, Integer childId, LocalDate selectedDate) {
        Memo memo = memoRepository.findByChildIdAndSelectedDate(childId, selectedDate).orElse(null);
        if(memo != null && !memo.getUserId().equals(userId)) {
            throw new UnauthorizedException(new ResponseData<>(ErrorCode.DATA_FORBIDDEN_ACCESS.getCode(), ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }

        return memo;
    }
}
