package com.ssafy.iscream.board.domain;

import com.ssafy.iscream.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert @DynamicUpdate
public class Post extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    @Column(nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column
    private Integer viewCount = 0;

    @Column
    private Integer likeCount = 0;

    public void updatePost(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void updateViewCount(int views) {
        this.viewCount = views;
    }

    public void updateLikeCount(int likes) {
        this.likeCount = likes;
    }

}
