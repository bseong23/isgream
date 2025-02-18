package com.ssafy.iscream.user.dto.response;

import com.ssafy.iscream.user.domain.User;

public record UserProfile(
        String nickname,
        String imageUrl
) {
    public UserProfile(User user) {
        this(user.getNickname(), user.getImageUrl());
    }
}
