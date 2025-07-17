import React, { useEffect } from 'react';
import '../styles/Contacts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function Contacts() {
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

            {/* Контактная информация */}
            <div className="contact-container">
                <div className="contact-card">
                    <div className="contact-logo">
                        <img
                            src="https://img.goodfon.com/original/1920x1200/9/dc/siniy-fon-logotip-dell-fon.jpg"
                            alt="Company Logo"
                            className="img-fluid"
                        />
                    </div>
                    <div className="contact-info">
                        <h2>{t("contacts")}</h2>
                        <p>{t("contact_us")}</p>
                        <ul>
                            <li>{t("email")}: info@company.com</li>
                            <li>{t("email")}: info@company.com</li>
                            <li>{t("phone1")}: +41 22 123 45 67</li>
                            <li>{t("phone2")}: +41 22 765 43 21</li>                            
                        </ul>
                        <p>{t("languages_available")}</p>
                        <p>{t("questions_suggestions")}</p>
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
