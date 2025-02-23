package com.ssafy.iscream.user.dto.response;

import com.ssafy.iscream.user.domain.User;

public record UserProfile(
        Integer userId,
        String nickname,
        String imageUrl
) {
    public UserProfile(User user) {
        this(user.getUserId(), user.getNickname(), user.getImageUrl());
    }
}
