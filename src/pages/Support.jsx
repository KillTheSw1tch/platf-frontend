import React, { useEffect } from 'react';
import '../styles/Support.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function Support() {
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
            {/* Навигационная панель */}
            

            {/* Информация поддержки */}
            <div className="contact-container">
                <div className="contact-card">
                    <div className="contact-logo">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Karte_Schweizer_Sprachgebiete_2021.png/330px-Karte_Schweizer_Sprachgebiete_2021.png"
                            alt="Support Image"
                            className="img-fluid"
                        />
                    </div>
                    <div className="contact-info">
                        <h2>{t("support")}</h2>
                        <p>{t("We are here to help you with any questions or issues you may have. Our support team is ready to assist you.")}</p>
                        <h3>{t("General Questions")}</h3>
                        <p>{t("Find answers to frequently asked questions about our services and platform.")}</p>
                        <h3>{t("Technical Support")}</h3>
                        <p>{t("Having trouble using the platform? Our technical team is ready to assist you.")}</p>
                        <h3>{t("Feedback")}</h3>
                        <p>{t("Your feedback is important to us. Share your experience to help us improve.")}</p>
                        <button className="btn btn-primary mt-3">{t('Contact Support')}</button>
                    </div>
                </div>
            </div>

            {/* Футер */}
            <footer className="bg-white border-top py-4 mt-5">
                <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <p className="mb-0 text-muted">{t("footer_text")}</p>
                    <div className="footer-links">
                        <Link to="/services">{t("services")}</Link>
                        <Link to="/support">{t("support")}</Link>
                        <Link to="/contacts">{t("contacts")}</Link>
                        <Link to="/faq">{t("faq")}</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
