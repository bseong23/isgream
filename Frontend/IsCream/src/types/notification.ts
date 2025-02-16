export interface NotificationItem {
  notifyId: number;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  postId?: number;
  chatId?: number;
}
