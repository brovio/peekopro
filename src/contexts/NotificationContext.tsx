import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "error" | "warning" | "info" | "success" | "signup";
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

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(
        data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          timestamp: new Date(n.created_at),
          read: n.read,
          link: n.link,
          data: n.data
        }))
      );
    };

    fetchNotifications();

    // Subscribe to new notifications
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
                type: payload.new.type,
                timestamp: new Date(payload.new.created_at),
                read: payload.new.read,
                link: payload.new.link,
                data: payload.new.data,
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

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link,
        data: notification.data,
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
        type: data.type,
        timestamp: new Date(data.created_at),
        read: data.read,
        link: data.link,
        data: data.data,
      },
      ...prev,
    ]);
  };

  const markAsRead = async (id: string) => {
    if (!user?.id) return;

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