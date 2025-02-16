package com.ssafy.iscream.board.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.dto.request.PostReq;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ssafy.iscream.board.domain.QPost.post;

@Repository
@RequiredArgsConstructor
public class PostQueryRepository {
    private final JPAQueryFactory queryFactory;

    public Page<Post> searchPosts(PostReq req, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        String sort = req.getSort();
        String keyword = req.getKeyword();
        Integer lastId = req.getLastId();
        Integer lastLikeCount = req.getLastLikeCount();

        if (keyword != null) {
            predicate.and(
                    post.title.contains(keyword).or(post.content.contains(keyword))
            );
        }

        if (lastId != null && sort.equals("create")) {
            predicate.and(post.postId.lt(lastId));
        }

        JPAQuery<Post> query = queryFactory
                .selectFrom(post)
                .where(predicate);

        if (sort.equals("like")) {
            if (lastLikeCount != null) {
                query.where(post.likeCount.loe(lastLikeCount));
            }

            if (lastId != null && lastLikeCount != null) {
                query.where(
                        post.likeCount.eq(lastLikeCount)
                                .and(post.postId.lt(lastId))
                                .or(post.likeCount.lt(lastLikeCount))
                );
            }

            query.orderBy(post.likeCount.desc(), post.createdAt.desc(), post.postId.desc());
        } else {
            query.orderBy(post.createdAt.desc(), post.postId.desc());
        }

        List<Post> posts = query.limit(pageable.getPageSize()).fetch();

        return PageableExecutionUtils.getPage(posts, pageable, query::fetchCount);
    }

    public List<Post> findTop5LikePost() {
        return queryFactory
                .select(post)
                .from(post)
                .orderBy(post.likeCount.desc(), post.createdAt.desc(), post.postId.desc())
                .limit(5)
                .fetch();
    }
}
