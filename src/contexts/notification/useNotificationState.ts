import { useState } from 'react';
import { Notification } from './types';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '../AuthContext';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useNotificationState = () => {
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
          type: n.type as Notification["type"],
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

  return {
    notifications,
    setNotifications,
    fetchNotificationsWithRetry,
  };
};