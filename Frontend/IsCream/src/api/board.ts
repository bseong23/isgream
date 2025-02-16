import { api } from "../utils/common/axiosInstance";
import type {
  ApiResponse,
  MainBoardResponse,
  BoardListRequest,
  BoardListResponse,
  PostDetail,
  CreatePostRequest,
  UpdatePostRequest,
  CommentRequest,
  CommentsResponse
} from "@/types/board";

export const boardKeys = {
  all: ["board"] as const,
  lists: () => [...boardKeys.all, "list"] as const,
  list: (filters: BoardListRequest) => [...boardKeys.lists(), filters] as const,
  details: () => [...boardKeys.all, "detail"] as const,
  detail: (id: number) => [...boardKeys.details(), id] as const,
  comments: (postId: number) => [...boardKeys.all, "comments", postId] as const,
  mains: () => [...boardKeys.all, "main"] as const,
  main: () => [...boardKeys.mains()] as const
};

export const boardApi = {
  // 게시글 작성
  createPost: (data: CreatePostRequest) => {
    const formData = new FormData();
    formData.append("post", JSON.stringify(data.post));
    if (data.files) {
      data.files.forEach((file) => formData.append("files", file));
    }
    return api.post<ApiResponse<{ postId: number }>>("/board/post", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  // 게시글 수정
  updatePost: (postId: number, data: UpdatePostRequest) => {
    const formData = new FormData();
    formData.append("post", JSON.stringify(data.post));
    if (data.files) {
      data.files.forEach((file) => formData.append("files", file));
    }
    return api.put<ApiResponse>(`/board/post/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  // 게시글 삭제
  deletePost: (postId: number) =>
    api.delete<ApiResponse>(`/board/post/${postId}`),

  // 메인 게시글 조회
  getMainPosts: () => api.get<ApiResponse<MainBoardResponse>>("/board/main"),

  // 게시글 목록 조회
  getBoardList: (params: BoardListRequest) =>
    api.post<ApiResponse<BoardListResponse>>("/board", params),

  // 게시글 상세 조회
  getPostDetail: (postId: number) =>
    api.get<ApiResponse<PostDetail>>(`/board/post/${postId}`),

  // 좋아요 관련
  likePost: (postId: number) =>
    api.get<ApiResponse>(`/board/post/${postId}/like`),

  unlikePost: (postId: number) =>
    api.delete<ApiResponse>(`/board/post/${postId}/like`),

  // 댓글 관련
  getComments: (postId: number) =>
    api.get<ApiResponse<CommentsResponse>>(`/comments/${postId}`),

  createComment: (data: CommentRequest) =>
    api.post<ApiResponse>("/comments", data),

  updateComment: (commentId: number, content: string) =>
    api.put<ApiResponse>(`/comments/${commentId}`, { content }),

  deleteComment: (commentId: number) =>
    api.delete<ApiResponse>(`/comments/${commentId}`)
};
