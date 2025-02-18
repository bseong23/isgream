package com.ssafy.iscream.comment.domain;

import com.ssafy.iscream.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert @DynamicUpdate
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentId;

    private Integer postId;

    private Integer userId;

    private Integer parentCommentId;

    @Column(length = 1024)
    private String content;

}
