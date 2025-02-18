package com.ssafy.iscream.board.dto.response;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.common.util.DateUtil;
import lombok.Builder;
import lombok.Getter;

@Builder @Getter
public class PostInfo {
    private Integer postId;
    private String title;
    private String content;
    private String thumbnail;
    private Integer likes;
    private Boolean userLiked;
    private Integer viewCount;
    private String createdAt;
    private String authorName;
    private Integer commentCount;

    public static PostInfo of(Post post, String thumbnail, boolean userLiked,
                              Integer likes, Integer viewCount, String authorName, Integer commentCount) {
        return PostInfo.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .thumbnail(thumbnail)
                .likes(likes)
                .userLiked(userLiked)
                .viewCount(viewCount)
                .createdAt(DateUtil.format(post.getCreatedAt()))
                .authorName(authorName)
                .commentCount(commentCount)
                .build();
    }
}
