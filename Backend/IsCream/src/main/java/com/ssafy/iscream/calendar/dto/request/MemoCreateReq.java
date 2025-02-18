package com.ssafy.iscream.calendar.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MemoCreateReq {
    Integer childId;
    LocalDate selectedDate;
    String memo;
}
