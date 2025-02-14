package com.ssafy.iscream.board.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postImageId;

    @Column(nullable = false, length = 1024)
    private String imageUrl;

    private Integer postId;

}
