package com.ssafy.iscream.calendar.dto.request;

import lombok.Data;


import java.time.LocalDate;

@Data
public class CalendarGetDetailReq {
    Integer childId;
    LocalDate selectedDate;
}
