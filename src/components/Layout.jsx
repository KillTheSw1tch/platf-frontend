import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getToken } from '../components/getToken';
import Notifications from './Notifications';

function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const updateAuthStatus = () => {
    const token = getToken();
    if (token) {
      fetch('http://127.0.0.1:8000/api/user/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.username) {
            setUsername(data.username);
            setUserId(data.id); // добавляем userId
            setIsAuthenticated(true);
          } else {
            throw new Error("User data not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  };
  

  useEffect(() => {
    updateAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUsername('');
    updateAuthStatus(); // Вызовем обновление состояния
    navigate('/login', { replace: true });
  };

  return (
    <div>
      {isAuthenticated && userId && <Notifications userId={userId} />} {/* WebSocket подключение */}
      <Navbar isAuthenticated={isAuthenticated} username={username} handleLogout={handleLogout} />
      <div className="content">
        <Outlet context={{ updateAuthStatus }} />
      </div>
    </div>
  );

}

export default Layout;
