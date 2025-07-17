import { useEffect, useState } from 'react';
import { getNotificationStatus } from '../api'; // Подключи если нет

function Notifications({ userId }) {
  const [enabled, setEnabled] = useState(null);

  useEffect(() => {
    getNotificationStatus()
      .then(data => {
        setEnabled(data.notifications_enabled);
      })
      .catch(err => {
        console.error('Ошибка получения настроек уведомлений:', err);
        setEnabled(false); // по умолчанию
      });
  }, []);

  useEffect(() => {
    if (!userId || enabled !== true) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/`);

    socket.onopen = () => {
      console.log('✅ WebSocket подключен');
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      alert(`🔔 Уведомление: ${data.message}`);
    };

    socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };

    socket.onclose = () => {
      console.log('❌ WebSocket отключён');
    };

    return () => socket.close();
  }, [userId, enabled]);

  return null;
}

export default Notifications;
