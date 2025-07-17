  import React, { useState } from 'react';
  // import 'bootstrap/dist/css/bootstrap.min.css';
  import '../styles/loginPage.css';
  import { useTranslation } from 'react-i18next';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';

  function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
    
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/', {
          email,
          password,
        });

        // 🛡️ Проверка на включённую 2FA
        if (response.data?.["2fa_required"]) {
          navigate('/verify-2fa', { state: { email } });
          return;
        }


    
        const { access, refresh } = response.data;

        localStorage.setItem('authToken', access);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        // 🧠 Загружаем профиль
        const profileRes = await axios.get('http://127.0.0.1:8000/api/user/profile/', {
          headers: { Authorization: `Bearer ${access}` }
        });

        const profile = profileRes.data;

        console.log("🔍 PROFILE RESPONSE", profile); // <-- важн

        localStorage.setItem('userId', profile.id);

        // ❗ Тут исправляем:
        localStorage.setItem('userFullName', profile.username || '');
        localStorage.setItem('userCompanyName', profile.profile?.company || '');
        localStorage.setItem('userEmail', profile.email || ''); // <-- правильный email

        // 🔍 Проверяем статус документов + company_data
        const statusRes = await axios.get("http://127.0.0.1:8000/api/company/check-approval/", {
          headers: { Authorization: `Bearer ${access}` }
        });

        const statusData = statusRes.data;

        // ⬇️ заменяем на это:
        if (statusData.approved) {
          localStorage.setItem("documentStatus", "approved");
          console.log("✅ Документы одобрены — documentStatus = approved");
        } else {
          localStorage.setItem("documentStatus", "pending");
          console.log("🕓 Документы не одобрены — documentStatus = pending");
        }


        if (statusData.company_data) {
          localStorage.setItem("companyData", JSON.stringify(statusData.company_data));
        }

        alert(t('login_successful'));
        navigate('/user-profile');

    
      } catch (error) {
          console.error('Login failed:', error);

          const errData = error.response?.data;

          if (errData?.["2fa_required"]) {
            navigate('/verify-2fa', { state: { email } });
            return;
          }

          if (errData?.non_field_errors) {
            alert(errData.non_field_errors[0]);
          } else {
            alert(t('login_failed'));
          }
        }

    };
    
    

    return (
      <div className="container_login">
        <div className="text-center_login">
          <h1 className="login_title_login">{t('login_title')}</h1>
          <p className="no_account_login">
            {t('no_account')}{' '}
            <a href="/registration" >
              {t('register')}
            </a>
          </p>
          <div className="heading-line"></div>
        </div>

        <form className="ctn_login"  onSubmit={handleLogin}>
          <div className="ctn_2_login">
            <label htmlFor="username" className="username_login">{t('username_or_email')}</label>
            <input
              type="email"
              className="form-control_login"
              id="email"
              placeholder={t('email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="ctn_2_login">
            <label htmlFor="password" className="form-label">{t('password')}</label>
            <input
              type="password"
              className="form-control_login"
              id="password"
              placeholder={t('password_placeholder1')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="ctn_2_login">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">{t('remember_me')}</label>
          </div>
          <button type="submit" className="btn_login ">{t('login')}</button>
        </form>
      </div>
    );
  }

  export default LoginPage;
