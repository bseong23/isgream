package com.ssafy.iscream.calendar.service;

import com.ssafy.iscream.calendar.domain.Memo;
import com.ssafy.iscream.calendar.dto.request.CalendarGetDetailReq;
import com.ssafy.iscream.calendar.dto.request.CalendarGetReq;
import com.ssafy.iscream.calendar.dto.response.CalendarGetDetailRes;
import com.ssafy.iscream.calendar.dto.response.CalendarGetRes;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.htpTest.service.HtpTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CalendarFacade {
    private final CalendarService calendarService;
    private final HtpTestService htpTestService;
    private final ChildrenService childrenService;

    public Map<Integer, CalendarGetRes> getCalendar(Integer userId, CalendarGetReq calendarGetReq) {
        List<HtpTest> htpTests = htpTestService.getByYearMonth(userId, calendarGetReq);
        List<Integer> memoDays = calendarService.getDaysByYearMonth(userId, calendarGetReq);
        
        // 권한 체크
        childrenService.checkAccess(userId, calendarGetReq.getChildId());

        Map<Integer, CalendarGetRes> calendarGetResMap = new HashMap<>();
        for (HtpTest htpTest : htpTests) {

            CalendarGetRes calendarGetRes = CalendarGetRes.builder()
                    .emoji(htpTest.getEmoji())
                    .isHtp(true)
                    .isMemo(false)
                    .build();
            calendarGetResMap.put(htpTest.getCreatedAt().getDayOfMonth(), calendarGetRes);
        }

        for(Integer memoDay : memoDays) {
            if (calendarGetResMap.containsKey(memoDay))
                calendarGetResMap.get(memoDay).updateIsMemo(true);

            else{
                CalendarGetRes calendarGetRest = CalendarGetRes.builder()
                        .isHtp(false)
                        .emoji(null)
                        .isMemo(true)
                        .build();
                calendarGetResMap.put(memoDay, calendarGetRest);
            }
        }

        return calendarGetResMap;
    }

    public CalendarGetDetailRes getCalendarDetail(Integer userId, CalendarGetDetailReq calendarGetDetailReq) {
        HtpTest htpTest = htpTestService.getByChildIdAndDate(calendarGetDetailReq.getChildId(),calendarGetDetailReq.getSelectedDate());
        Memo memo = calendarService.getByChildIdDate(userId, calendarGetDetailReq.getChildId(),calendarGetDetailReq.getSelectedDate());
        return new CalendarGetDetailRes(htpTest, memo);
    }
}
