package com.ssafy.iscream.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@AllArgsConstructor
@RedisHash(value = "refreshToken", timeToLive = 8640000000L)
public class RefreshToken {

    @Id
    private String refreshToken;
    private Integer userId;
}
