package com.ssafy.iscream.children.dto.req;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ChildrenUpdateReq {
    Integer childId;
    LocalDate birthDate;
    String nickname;
    String gender;
}
