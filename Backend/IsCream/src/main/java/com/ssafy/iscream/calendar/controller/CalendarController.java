package com.ssafy.iscream.calendar.controller;


import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.calendar.dto.request.CalendarGetDetailReq;
import com.ssafy.iscream.calendar.dto.request.CalendarGetReq;
import com.ssafy.iscream.calendar.dto.request.MemoCreateReq;
import com.ssafy.iscream.calendar.dto.request.MemoUpdateReq;
import com.ssafy.iscream.calendar.service.CalendarFacade;
import com.ssafy.iscream.calendar.service.CalendarService;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/calendars")
@Tag(name = "calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final CalendarFacade calendarFacade;

    @PostMapping()
    @Operation(summary = "선택된 자녀 달력 출력")
    public ResponseEntity<?> getCalendar(@Login User user, @RequestBody CalendarGetReq calendarGetReq) {
        return ResponseUtil.success(calendarFacade.getCalendar(user.getUserId(), calendarGetReq));
    }

    @PostMapping("/detail")
    @Operation(summary = "선택된 자녀 달력 날짜별 정보 출력")
    public ResponseEntity<?> getCalendarDetail(@Login User user,@RequestBody CalendarGetDetailReq calendarGetDetailReq) {
        return ResponseUtil.success(calendarFacade.getCalendarDetail(user.getUserId(), calendarGetDetailReq));
    }


    @PostMapping("/memo")
    @Operation(summary = "날짜 별로 메모를 작성")
    public ResponseEntity<?> createMemo(@Login User user, @RequestBody MemoCreateReq memoCreateReq) {
        calendarService.createMemo(user.getUserId(), memoCreateReq);
        return ResponseUtil.success();
    }

    @PutMapping("/memo")
    @Operation(summary = "날짜 별로 메모를 수정")
    public ResponseEntity<?> updateMemo(@Login User user, @RequestBody MemoUpdateReq memoUpdateReq){
        calendarService.updateMemo(user.getUserId(), memoUpdateReq);
        return ResponseUtil.success();
    }


    @DeleteMapping("/memo/{memoId}")
    @Operation(summary = "날짜 별로 메모를 삭제")
    public ResponseEntity<?> deleteMemo(@Login User user, @PathVariable Integer memoId){
        calendarService.deleteMemo(user.getUserId(), memoId);
        return ResponseUtil.success();
    }


}
