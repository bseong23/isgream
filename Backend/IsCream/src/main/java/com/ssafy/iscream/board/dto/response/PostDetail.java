package com.ssafy.iscream.board.dto.response;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.common.util.DateUtil;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.dto.response.UserProfile;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class PostDetail {

    private Integer postId;
    private String title;
    private String content;
    private Integer likes;
    private Boolean userLiked;
    private Integer viewCount;
    private List<String> images;
    private String createdAt;
    private UserProfile author;
    private String userImageUrl;

    public static PostDetail of(Post post, User user, Boolean userLiked, Integer viewCount,
                                List<String> images, Integer likes, UserProfile author) {
        return PostDetail.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .likes(likes)
                .userLiked(userLiked)
                .viewCount(viewCount)
                .images(images)
                .createdAt(DateUtil.format(post.getCreatedAt()))
                .author(author)
                .userImageUrl(user != null ? user.getImageUrl() : null)
                .build();
    }
}
