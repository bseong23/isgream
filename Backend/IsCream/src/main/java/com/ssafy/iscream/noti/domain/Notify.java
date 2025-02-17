package com.ssafy.iscream.noti.domain;

import com.ssafy.iscream.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicUpdate @DynamicInsert
public class Notify extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notifyId;

    private Integer userId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private NotifyType type;

    private boolean isRead;

    private Integer postId;
    
    private Integer chatId; // 채팅방 아이디

}
