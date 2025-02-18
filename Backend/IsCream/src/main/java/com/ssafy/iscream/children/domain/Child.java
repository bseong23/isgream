package com.ssafy.iscream.children.domain;

import com.ssafy.iscream.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;

@Entity
@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@DynamicUpdate @DynamicInsert
public class Child extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer childId;

    Integer userId;

    String nickname;

    LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    Gender gender;

    @Enumerated(EnumType.STRING)
    Status status;

    public void updateChild(String nickname, LocalDate birthDate, Gender gender) {
        this.nickname = nickname;
        this.birthDate = birthDate;
        this.gender = gender;
    }

    public void deleteChild() {
        this.status = Status.DELETED;
    }
}
