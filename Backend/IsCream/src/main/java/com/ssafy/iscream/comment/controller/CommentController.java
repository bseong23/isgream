package com.ssafy.iscream.comment.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.comment.dto.request.CommentCreateReq;
import com.ssafy.iscream.comment.service.CommentFacade;
import com.ssafy.iscream.comment.service.CommentService;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentFacade commentFacade;
    private final CommentService commentService;

    @Operation(summary = "댓글/대댓글 작성", tags = "comments")
    @PostMapping
    public ResponseEntity<?> createComment(@Login User user, @RequestBody CommentCreateReq req) {
        return ResponseUtil.success(commentFacade.createComment(user, req));
    }

    @Operation(summary = "댓글/대댓글 수정", tags = "comments")
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@Login User user,
                     @PathVariable Integer commentId,
                     @Schema(example = "{\"content\": \"string\"}")
                     @RequestBody Map<String, String> map) {
        commentService.updateComment(user.getUserId(), commentId, map.get("content"));
        return ResponseUtil.success();
    }

    @Operation(summary = "댓글/대댓글 삭제", tags = "comments")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@Login User user,
                                           @PathVariable Integer commentId) {
        commentService.deleteComment(user.getUserId(), commentId);
        return ResponseUtil.success();
    }

    @Operation(summary = "댓글 조회", tags = "comments")
    @GetMapping("/{postId}")
    public ResponseEntity<?> getComments(@PathVariable Integer postId) {
        return ResponseUtil.success(commentFacade.getCommentList(postId));
    }

}
