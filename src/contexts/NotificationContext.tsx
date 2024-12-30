import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Json } from "@/integrations/supabase/types";

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

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const fetchNotificationsWithRetry = async (retryCount = 0) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying fetch notifications (attempt ${retryCount + 1})`);
          setTimeout(() => fetchNotificationsWithRetry(retryCount + 1), RETRY_DELAY);
        }
        return;
      }

      setNotifications(
        data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type as NotificationType,
          timestamp: new Date(n.created_at),
          read: n.read || false,
          link: n.link,
          data: typeof n.data === 'string' ? JSON.parse(n.data) : n.data as Record<string, any>
        }))
      );
    } catch (err) {
      console.error("Error in fetchNotifications:", err);
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => fetchNotificationsWithRetry(retryCount + 1), RETRY_DELAY);
      }
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]); // Clear notifications when user is not authenticated
      return;
    }

    fetchNotificationsWithRetry();

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [
              {
                id: payload.new.id,
                title: payload.new.title,
                message: payload.new.message,
                type: payload.new.type as NotificationType,
                timestamp: new Date(payload.new.created_at),
                read: payload.new.read || false,
                link: payload.new.link,
                data: typeof payload.new.data === 'string' 
                  ? JSON.parse(payload.new.data) 
                  : payload.new.data as Record<string, any>
              },
              ...prev,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const addNotification = async (notification: Omit<Notification, "id" | "timestamp">) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          data: notification.data,
          read: notification.read,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding notification:", error);
        return;
      }

      setNotifications((prev) => [
        {
          id: data.id,
          title: data.title,
          message: data.message,
          type: data.type as NotificationType,
          timestamp: new Date(data.created_at),
          read: data.read || false,
          link: data.link,
          data: typeof data.data === 'string' 
            ? JSON.parse(data.data) 
            : data.data as Record<string, any>
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error in addNotification:", err);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error in markAsRead:", err);
    }
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotification,
        clearAllNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};