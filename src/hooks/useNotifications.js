import { useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import * as notificationsApi from '../api/notifications';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleMessage = useCallback((msg) => {
    if (msg.type === 'notification.created') {
      setNotifications((prev) => [msg, ...prev]);
      setUnreadCount((c) => c + 1);
    }
  }, []);

  useWebSocket('/notifications/', { onMessage: handleMessage });

  const loadNotifications = useCallback(async () => {
    try {
      const { data } = await notificationsApi.getNotifications();
      const list = data.results || data;
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.is_read).length);
    } catch (_) {}
  }, []);

  const markRead = useCallback(async (id) => {
    try {
      await notificationsApi.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (_) {}
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (_) {}
  }, []);

  return { notifications, unreadCount, loadNotifications, markRead, markAllRead };
}
