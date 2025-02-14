package com.ssafy.iscream.children.dto.req;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ChildrenCreateReq {
    LocalDate birthDate;
    String nickname;
    String gender;
}
