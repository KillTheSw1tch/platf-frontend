import React, { useEffect } from 'react';
import '../styles/Services.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function Services() {
    const { t } = useTranslation();


    // Устанавливаем сохраненный язык при загрузке
    useEffect(() => {
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

    return (
        <div>
            {/* Информация о сервисах */}
            <div className="contact-container">
                <div className="contact-card">
                    <div className="contact-logo">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Karte_Schweizer_Sprachgebiete_2021.png/330px-Karte_Schweizer_Sprachgebiete_2021.png"
                            alt="Services Image"
                            className="img-fluid"
                        />
                    </div>
                    <div className="contact-info">
                        <h2>{t("Our Services")}</h2>
                        <p>{t("welcome_message")}</p>
                        <h3>{t("why_us_title")}</h3>
                        <ul>
                            <li><strong>{t("time_saving1")}</strong>{t("time_saving")}</li>
                            <li><strong>{t("ease_of_use1")}</strong>{t("ease_of_use")}</li>
                            <li><strong>{t("availability1")}</strong>{t("availability")}</li>
                            <li><strong>{t("reliability1")}</strong>{t("reliability")}</li>
                        </ul>
                        <h3>{t("platform_for_all")}</h3>
                        <p>{t("platform_purpose")}</p>
                        <ul>
                            <li><strong>{t("carrier1")}</strong>: {t("carrier")}</li>
                            <li><strong>{t("shipper1")}</strong>: {t("shipper")}</li>
                            <li><strong>{t("forwarder1")}</strong>: {t("forwarder")}</li>
                        </ul>
                        <span>
                            <div><strong>{t("attention")}</strong></div>
                            <p>{t("registration_info")}</p>
                        </span>
                    </div>
                </div>
            </div>

            {/* Футер */}
            <footer className="bg-white border-top py-4 mt-5">
                <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <p className="mb-0 text-muted">{t("footer_text")}</p>
                    <div className="footer-links">
                        <Link to="/services">{t("services")}</Link>
                        
                        <Link to="/contacts">{t("contacts")}</Link>
                        
                    </div>
                </div>
            </footer>
        </div>
    );
}
