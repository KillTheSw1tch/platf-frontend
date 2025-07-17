import React, { useState, useEffect, useRef } from 'react';
import '../styles/notificationBell.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotificationBell({ token }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    fetch('http://127.0.0.1:8000/api/notifications/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error("⛔ Expected array of notifications, but received:", data);
          setNotifications([]);
        }
      })
      .catch(err => console.error(t("error_loading_notifications"), err));
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleClick = () => {
    setShowList(!showList);

    notifications.forEach(n => {
      if (!n.is_read) {
        fetch(`http://127.0.0.1:8000/api/notifications/${n.id}/read/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(err => console.error(t("error_marking_read"), err));
      }
    });

    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  const handleClearAll = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read);

      await Promise.all(
        unread.map(n =>
          fetch(`http://127.0.0.1:8000/api/notifications/${n.id}/read/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      setNotifications([]);
    } catch (err) {
      console.error(t("error_clearing_notifications"), err);
    }
  };

  return (
    <div className="notification-bell-wrapper" ref={bellRef}>
      <button onClick={handleClick} className="notification-bell">
        🔔
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>

      {showList && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <button
              className="notification-clear-btn"
              onClick={handleClearAll}
            >
              {t("clear")}
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="notification-empty">{t("no_notifications")}</p>
          ) : (
            <ul className="notification-list">
              {notifications.map(n => (
                <li
                  key={n.id}
                  className="notification-item"
                  onClick={() => navigate('/my-orders')}
                >
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
