// VerifyCode.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

function VerifyCode() {

  const { t } = useTranslation();

    // Устанавливаем сохраненный язык при загрузке
    useEffect(() => {
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { updateAuthStatus } = useOutletContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('userEmail');
    if (!email) {
      setMessage('❌ Не удалось получить email. Попробуйте снова.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохранение токена после успешного подтверждения
        localStorage.setItem('authToken', data.token);
        setMessage('✅ Код подтвержден. Перенаправление...');
        
        // Вызываем обновление аутентификации
        updateAuthStatus();

        setTimeout(() => {
          navigate('/'); // Перенаправляем на главную (будет логгированная страница)
        }, 1000);
      } else {
        setMessage('❌ Неверный код. Попробуйте снова.');
      }
    } catch (error) {
      setMessage('Произошла ошибка.');
      console.error(error);
    }
  };

  return (
    <div className="container py-5">
      <h2>{t("verify_email")}</h2>
      <form onSubmit={handleSubmit}>
        <label>{t("enter_the_code_from_the_email")}:</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="form-control my-2"
        />
        <button type="submit" className="btn btn-primary">{t("confirm")}</button>
      </form>
      {message && <div className="mt-3">{message}</div>}
    </div>
  );
}

export default VerifyCode;
