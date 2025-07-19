// frontend/src/pages/Verify2FA.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

const Verify2FA = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post('/verify-2fa-login/', {
        email,
        code
        });

        const access = response.data.access;
        const refresh = response.data.refresh;

        localStorage.setItem('authToken', access);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        // 🧠 Загружаем профиль
        const profileRes = await api.get('/user/profile/', {
        headers: { Authorization: `Bearer ${access}` }
        });

        const profile = profileRes.data;

        localStorage.setItem('userFullName', profile.username || '');
        localStorage.setItem('userCompanyName', profile.profile?.company || '');
        localStorage.setItem('userEmail', profile.email || '');

        // 🔍 Проверяем статус документов + company_data
        const statusRes = await api.get('/company/check-approval/', {
        headers: { Authorization: `Bearer ${access}` }
        });

        const statusData = statusRes.data;

        if (statusData.approved) {
        localStorage.setItem("documentsStatus", "approved");
        } else {
        localStorage.setItem("documentsStatus", "pending");
        }

        if (statusData.company_data) {
        localStorage.setItem("companyData", JSON.stringify(statusData.company_data));
        }

        // ✅ Всё ок — переходим в профиль
        navigate('/profile');

    } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Ошибка');
    }
    };


  if (!email) {
    return <p>Нет данных для входа. Пожалуйста, залогиньтесь заново.</p>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Двухфакторная проверка</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введите код из приложения"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Подтвердить
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Verify2FA;
