package com.ssafy.iscream.board.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "postId"})
)
public class PostLike {

    @EmbeddedId
    private PostLikeId id;
}
