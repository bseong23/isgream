package com.ssafy.iscream.children.dto.res;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ChildrenGetRes {
    Integer childId;
    String nickname;
    LocalDate birthDate;
    String gender;
}
