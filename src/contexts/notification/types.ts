export type NotificationType = "error" | "warning" | "info" | "success" | "signup";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  link?: string;
  data?: Record<string, any>;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => Promise<void>;
}