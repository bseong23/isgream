// types/board.ts

export type ApiResponseCode = "S0000" | "E4001" | "E4002" | "E4003" | "E4006";

export interface ApiResponse<T = void> {
  code: ApiResponseCode;
  message: string;
  data?: T;
}

export interface Author {
  id: string;
  nickname: string;
  imageUrl: string;
}

export interface Post {
  postId: number;
  title: string;
  content: string;
  thumbnail: string;
  likes: number;
  userLiked: boolean;
  viewCount: number;
  createdAt: string;
  authorName: string;
  authorId: string;
  author: Author;
}

export interface PostItemProps {
  post: {
    postId: number;
    title: string;
    content: string;
    thumbnail: string;
    createdAt: string;
    authorName: string;
    authorId: string;
    likes: number;
    userLiked: boolean;
    hits: number;
  };
}

export interface PostDetail {
  postId: number;
  title: string;
  content: string;
  likes: number;
  userLiked: boolean;
  viewCount: number;
  images?: string[];
  createdAt: string;
  author: Author;
  userImageUrl?: string;
}

export interface Comment {
  commentId: number;
  content: string;
  parentId: number | null;
  createdAt: string;
  author: Author;
}

export interface CommentsResponse {
  totalCount: number;
  comments: Comment[];
}

export interface MainBoardResponse {
  hot: Post[];
  latest: Post[];
}

export interface BoardListRequest {
  lastId: number | null;
  lastLikeCount: number | null;
  size: number;
  sort: "create" | "like";
  keyword?: string;
}

export interface BoardListResponse {
  lastId: number | null;
  lastLikeCount: number | null;
  size: number;
  hasNext: boolean;
  info: Post[];
}

export interface CreatePostRequest {
  post: {
    title: string;
    content: string;
  };
  files?: File[];
}

export interface CreatePostResponse {
  postId: number;
}

export interface UpdatePostRequest {
  post: {
    title: string;
    content: string;
    deleteFiles: string[];
  };
  files?: File[];
}

export interface LikePostResponse {
  code: ApiResponseCode;
  message: string;
}

export interface CommentRequest {
  postId: number;
  commentId: number | null; // 댓글 작성 시 null, 대댓글 작성 시 부모 댓글 ID
  content: string;
}

export interface CreateCommentResponse {
  code: ApiResponseCode;
  message: string;
}

export interface CommentsListResponse {
  totalCount: number;
  comments: Comment[];
}

export interface CommentDropdownProps {
  comment: Comment;
  currentUserId?: string;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
  onChat?: (authorId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface CommentFormProps {
  onSubmit: (content: string, parentId?: number | null) => void;
  onEdit?: (content: string) => void;
  isEditing?: boolean;
  initialContent?: string;
  isVisible?: boolean;
  parentId?: number | null;
  onCancel?: () => void;
  placeholder?: string;
  imageUrl?: string;
  userImageUrl?: string;
}

export interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
  onChat?: (authorId: string) => void;
  onReply?: () => void;
  onToggleReplies?: () => void;
  repliesCount?: number;
  isRepliesExpanded?: boolean;
  children?: React.ReactNode;
  isReply?: boolean;
  isEditing?: boolean;
  userImageUrl?: string;
}
