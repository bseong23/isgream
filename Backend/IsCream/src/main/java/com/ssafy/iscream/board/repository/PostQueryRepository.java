package com.ssafy.iscream.board.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.dto.request.PostReq;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import static com.ssafy.iscream.board.domain.QPost.post;
import static com.ssafy.iscream.board.domain.QPostLike.postLike;

@Repository
@RequiredArgsConstructor
public class PostQueryRepository {
    private final JPAQueryFactory queryFactory;

    public Page<Post> searchPosts(PostReq req, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        String keyword = req.getKeyword();
        Integer lastId = req.getLastId();

        if (keyword != null) {
            predicate.and(
                    post.title.contains(keyword).or(post.content.contains(keyword))
            );
        }

        if (lastId != null) {
            predicate.and(post.postId.lt(lastId));
        }

        JPAQuery<Post> query = queryFactory
                .selectFrom(post)
                .where(predicate)
                .orderBy(post.createdAt.desc(), post.postId.desc());

        List<Post> posts = query.limit(pageable.getPageSize()).fetch();

        return PageableExecutionUtils.getPage(posts, pageable, query::fetchCount);
    }

    public Page<Post> searchPosts(PostReq req, Pageable pageable, List<Integer> postIdsFromRedis) {
        BooleanBuilder predicate = new BooleanBuilder();

        String keyword = req.getKeyword();
        Integer lastId = req.getLastId();
        Integer lastLikeCount = req.getLastLikeCount();

        if (keyword != null) {
            predicate.and(post.title.containsIgnoreCase(keyword)
                    .or(post.content.containsIgnoreCase(keyword)));
        }

        if (lastLikeCount != null) {
            predicate.and(post.postId.loe(lastLikeCount));
        }

//        if (lastId != null) {
//            predicate.and(post.postId.gt(lastId));
//        }

        JPAQuery<Post> query = queryFactory
                .selectFrom(post)
                .where(post.postId.in(postIdsFromRedis))
                .where(predicate);
//                .orderBy(post.createdAt.desc(), post.postId.desc());

//        List<Post> posts = query.limit(pageable.getPageSize()).fetch();

        List<Post> posts = query.fetch();

        return PageableExecutionUtils.getPage(posts, pageable, query::fetchCount);
    }
}
