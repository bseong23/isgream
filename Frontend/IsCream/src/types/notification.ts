export interface NotifyItem {
  notifyId: number;
  title: string;
  content: string;
  type: string;
  read: boolean;
  createdAt: string;
  postId?: number;
  chatId?: number;
}

export interface NotifyResponse {
  code: "S0000" | "E4001";
  message: string;
  data: NotifyItem[];
}
