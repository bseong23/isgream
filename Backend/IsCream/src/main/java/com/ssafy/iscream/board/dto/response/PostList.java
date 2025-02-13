package com.ssafy.iscream.board.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder @Getter
public class PostList {
    private Integer lastId;
    private Integer lastLikeCount;
    private Integer size;
    private Boolean hasNext;
    private List<PostInfo> info;

    public static PostList of(Integer lastId, Integer lastLikeCount, Integer size,
                              Boolean hasNext, List<PostInfo> info) {
        return PostList.builder()
                .lastId(lastId)
                .lastLikeCount(lastLikeCount)
                .size(size)
                .hasNext(hasNext)
                .info(info)
                .build();
    }
}

