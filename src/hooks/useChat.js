import { useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export function useChat(courseId) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const handleMessage = useCallback((msg) => {
    if (msg.type === 'chat.message') {
      setMessages((prev) => [...prev, msg]);
    } else if (msg.type === 'presence.list') {
      setUsers(msg.users || []);
    }
  }, []);

  const { send } = useWebSocket(
    courseId ? `/chat/${courseId}/` : null,
    { onMessage: handleMessage, enabled: !!courseId }
  );

  const sendMessage = useCallback((text) => {
    send({ type: 'chat.message', message: text });
  }, [send]);

  return { messages, users, sendMessage };
}
