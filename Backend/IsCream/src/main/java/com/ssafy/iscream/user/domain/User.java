package com.ssafy.iscream.user.domain;

import com.ssafy.iscream.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert @DynamicUpdate
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false)
    private String username;

    @Column(unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    private LocalDate birthDate;

    @Column(length = 50)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(length = 50)
    private String nickname;

    @Column(length = 1024)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Relation relation;

    @Enumerated(EnumType.STRING)
    private Role role;

}

