package com.ssafy.iscream.board.domain;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class PostLikeId implements Serializable {
    private Integer userId;
    private Integer postId;

    public PostLikeId() {}

    public PostLikeId(Integer userId, Integer postId) {
        this.userId = userId;
        this.postId = postId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PostLikeId that = (PostLikeId) o;
        return userId.equals(that.userId) && postId.equals(that.postId);
    }

    @Override
    public int hashCode() {
        return 31 * userId.hashCode() + postId.hashCode();
    }
}

