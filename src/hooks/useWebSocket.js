import { useEffect, useRef, useCallback } from 'react';

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws';

export function useWebSocket(path, { onMessage, onOpen, onClose, enabled = true } = {}) {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (!enabled) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const url = `${WS_BASE}${path}?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => onOpen?.();
    ws.onmessage = (e) => {
      try { onMessage?.(JSON.parse(e.data)); } catch (_) {}
    };
    ws.onclose = (e) => {
      onClose?.(e);
      // Reconnect after 3s unless closed cleanly
      if (e.code !== 1000) {
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    };
    ws.onerror = () => ws.close();
  }, [path, enabled, onMessage, onOpen, onClose]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close(1000);
    };
  }, [connect]);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { send };
}
