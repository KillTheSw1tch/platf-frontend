import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import { getToken } from '../components/getToken';
import NotificationBell from './NotificationBell';

import axios from 'axios';


function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [role, setRole] = useState(null);


  // Язык
  const changeLanguage = (lng) => {
    if (['en', 'fr', 'de', 'it'].includes(lng)) {
      i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    }
  };

  // Проверка токена на каждой перезагрузке и при изменении localStorage
  useEffect(() => {
    const checkLogin = async () => {
      const token = getToken();
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const res = await axios.get("http://127.0.0.1:8000/api/company/check-approval/", {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log("[DEBUG Navbar] ROLE:", res.data.role); // <--- ДОБАВЬ

          setRole(res.data.role);
        } catch (err) {
          console.error("Ошибка при получении роли:", err);
        }
      }
    };


    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);


  const handleLogout = () => {
    // Полная очистка
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('companyData');
    localStorage.removeItem('documentsStatus');

    setIsLoggedIn(false);
    navigate('/');
    window.location.reload(); // Гарантированная перезагрузка с новым стейтом
  };

  const formatFullName = (rawName) => {
    if (!rawName) return "";
    return rawName
      .replace(/[_\.]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand" to="/">{t("platform_name") || "Platforma Transportation"}</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {/* Language */}

            <li className="nav-item d-flex align-items-center">
              <NotificationBell token={getToken()} />
            </li>
            
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {t("language")}
              </a>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => changeLanguage('en')}>{t("english")}</button></li>
                <li><button className="dropdown-item" onClick={() => changeLanguage('fr')}>{t("french")}</button></li>
                <li><button className="dropdown-item" onClick={() => changeLanguage('de')}>{t("german")}</button></li>
                <li><button className="dropdown-item" onClick={() => changeLanguage('it')}>{t("italian")}</button></li>
              </ul>
            </li>

            {/* Logged In */}
            {isLoggedIn ? (
              <>
                {/* <li className="nav-item d-flex align-items-center">
                  <NotificationBell token={getToken()} />
                </li> */}

                <li className="nav-item dropdown">
                  <button
                    className="btn btn-outline-dark dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    👤 {formatFullName(localStorage.getItem('userFullName')) || t("profile")}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li><Link className="dropdown-item" to="/my-orders">{t("my_orders")}</Link></li>
                    <li><Link className="dropdown-item" to="/my-company">{t("my_company")}</Link></li>

                    {role && (role === "owner" || role === "manager") && (
                      <li><Link className="dropdown-item" to="/my-team">{t("my_team")}</Link></li>
                    )}



                    <li><Link className="dropdown-item" to="/profile">{t("profile")}</Link></li>
                  </ul>

                </li>

                <li className="nav-item">
                  <button className="btn btn-secondary ms-2" onClick={handleLogout}>
                    {t("logout")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">{t("login")}</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/registration">
                    {t("registration")}
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
