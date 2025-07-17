import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ⬅️ добавили

const Enable2FA = () => {
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ⬅️ добавили

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // ✅ правильно


        const response = await axios.get("http://localhost:8000/api/user/generate-2fa/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setQrCode(response.data.qr_code_base64);
        setSecret(response.data.secret);

      } catch (err) {
        if (err.response && err.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");

            const refreshResponse = await axios.post("http://localhost:8000/api/token/refresh/", {
              refresh: refreshToken,
            });

            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem("accessToken", newAccessToken); // ✅ правильно


            const retryResponse = await axios.get("http://localhost:8000/api/user/generate-2fa/", {
              headers: { Authorization: `Bearer ${newAccessToken}` },
            });

            setQrCode(retryResponse.data.qr_code_base64);
            setSecret(retryResponse.data.secret);
          } catch (refreshError) {
            console.error("Ошибка обновления токена", refreshError);
            setMessage("Ошибка авторизации. Перезайдите в аккаунт.");
          }
        } else {
          console.error(err);
          setMessage("Ошибка загрузки QR-кода");
        }
      }
    };

    fetchQrCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken"); // ✅


      // ✅ Отправляем код 2FA на верификацию
      await axios.post(
        "http://localhost:8000/api/user/verify-2fa/",
        { code },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // ✅ Обновляем данные профиля после успешной верификации
      const profileResponse = await axios.get("http://localhost:8000/api/user/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      localStorage.setItem("userProfile", JSON.stringify(profileResponse.data));

      // 💡 тут можешь еще обновить is2FAEnabled, если используешь его как стейт
      // setIs2FAEnabled(profileResponse.data.is_2fa_enabled);

      setMessage("✅ 2FA успешно включена!");

      window.location.href = "/profile";


    } catch (err) {
      if (err.response && err.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");

          const refreshResponse = await axios.post("http://localhost:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem("accessToken", newAccessToken); // ✅ правильно


          await axios.post(
            "http://localhost:8000/api/user/verify-2fa/",
            { code },
            { headers: { Authorization: `Bearer ${newAccessToken}` } }
          );

          const profileResponse = await axios.get("http://localhost:8000/api/user/profile/", {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          });

          localStorage.setItem("userProfile", JSON.stringify(profileResponse.data));

          // setIs2FAEnabled(profileResponse.data.is_2fa_enabled);

          setMessage("✅ 2FA успешно включена!");
          setTimeout(() => navigate("/profile"), 1000);

        } catch (refreshError) {
          console.error("Ошибка обновления токена при подтверждении", refreshError);
          setMessage("Ошибка авторизации. Перезайдите в аккаунт.");
        }
      } else {
        console.error(err);
        setMessage("❌ Неверный код");
      }
    }
  };


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Включить двухфакторную аутентификацию</h2>

      {qrCode && (
        <div>
          <p>Отсканируй этот QR-код в Google Authenticator:</p>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <label>
          Введите код из приложения:
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength="6"
            required
          />
        </label>
        <button type="submit">Подтвердить</button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default Enable2FA;
