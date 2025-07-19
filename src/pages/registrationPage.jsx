import React, { useState, useEffect } from 'react';
import '../styles/registerPage.css';

import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useNavigate } from 'react-router-dom';
import { search } from 'swiss-zipcodes';

function RegistrationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cantonNames = {
    ZH: 'Zurich',
    BE: 'Bern',
    LU: 'Lucerne',
    UR: 'Uri',
    SZ: 'Schwyz',
    OW: 'Obwalden',
    NW: 'Nidwalden',
    GL: 'Glarus',
    ZG: 'Zug',
    FR: 'Fribourg',
    SO: 'Solothurn',
    BS: 'Basel-Stadt',
    BL: 'Basel-Landschaft',
    SH: 'Schaffhausen',
    AR: 'Appenzell Ausserrhoden',
    AI: 'Appenzell Innerrhoden',
    SG: 'St. Gallen',
    GR: 'Grisons',
    AG: 'Aargau',
    TG: 'Thurgau',
    TI: 'Ticino',
    VD: 'Vaud',
    VS: 'Valais',
    NE: 'Neuchâtel',
    GE: 'Geneva',
    JU: 'Jura',
  };
   

  // При завантаженні сторінки встановлюємо мову з localStorage (якщо є)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  // Стан для полів форми
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [postNumber, setPostNumber] = useState('');

  const [telephone, setTelephone] = useState('');
  const [mobile, setMobile] = useState('');

  const [formOfAddress, setFormOfAddress] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [clientType, setClientType] = useState('transporter');

  const [city, setCity] = useState('');


  // Обробник відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();

    const safeUsername = `${username.trim().toLowerCase()}.${surname.trim().toLowerCase()}`; // безопасный username
    const fullName = `${username.trim()} ${surname.trim()}`; // красивое имя

    // Формуємо об’єкт з усіма полями
    const payload = {
      username: safeUsername,
      password,
      email,
      profile: { 
          company: companyName,
          address: address,
          canton: district,
          zip_code: postNumber,
          city: city, 
          phone: telephone,
          mobile: mobile,
          viber_whatsapp_number: mobile, 
          preferred_language: preferredLanguage,
          client_type: clientType,
          full_name: fullName,
      }
    };
    console.log("Payload:", JSON.stringify(payload, null, 2));
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + 'api/user/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userCompanyName', companyName);
        if (data.token) {
          localStorage.setItem('authToken', data.token); // 💾 Сохраняем токен!
        }
        navigate('/verify-code'); 
      }
       else {
        console.error('❌ Error response:', data); // 👈 добавь это
        alert('⚠️ Помилка: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('❌ Помилка запиту:', error);
      alert('Сталася помилка при реєстрації.');
    }
  };

  useEffect(() => {
    if (postNumber.length >= 4) {
      const result = search({ zip: parseInt(postNumber) });
      if (result.length > 0) {
        const { commune, canton } = result[0];
        setCity(commune || '');
        setDistrict(cantonNames[canton] || canton || '');
      }
    }
  }, [postNumber]);
  

  return (
    
    <div className="container_reg">
      {/* Заголовок сторінки */}
      <div className="text-center">
        <h1 className="create_account">{t('create_account')}</h1>
        <p className="already_registered">
          {t('already_registered')}{' '}
          <a href="/login" style={{ color: 'var(--main-color)', textDecoration: 'none' }}>
            {t('login')}
          </a>
        </p>
      </div>

      {/* Форма реєстрації */}
      <form className="mx-auto" style={{ maxWidth: '700px' }} onSubmit={handleSubmit}>
        
        {/* Блок: Дані компанії */}
        <div className="section-divider" style={{ margin: '2rem 0' }}>
          <div className="section-title" style={{ color: 'var(--main-color)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {t('company_section')}
          </div>
          <div className="container_reg">
            <div className="line_reg">
              <label htmlFor="companyName" className="form-companyName_reg">{t('company')}</label>
              <input
                type="text"
                className="form-control_reg"
                id="companyName"
                placeholder={t('company_name')}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="line_reg">
              <label htmlFor="postNumber" className="postNumber_reg">{t('zip_postcode')}</label>
              <input
                type="text"
                className="form-control_reg"
                id="postNumber"
                placeholder={t('zip_postcode')}
                value={postNumber}
                onChange={(e) => setPostNumber(e.target.value)}
              />
            </div>
            <div className="line_reg">
                <label htmlFor="city" className="city_reg">{t('city')}</label>
                <input
                  type="text"
                  className="form-control_reg"
                  id="city"
                  placeholder={t('city')}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            <div className="line_reg">
              <label htmlFor="address" className="address_reg">{t('address')}</label>
              <input
                type="text"
                className="form-control_reg"
                id="address"
                placeholder={t('street_house_number')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="line_reg">
              <label htmlFor="district" className="district-reg">{t('canton')}</label>
              <input
                type="text"
                className="form-control_reg"
                id="district"
                placeholder={t('canton')}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
            
          </div>
        </div>

        {/* Блок: Персональні дані */}
        <div className="section-divider" style={{ margin: '2rem 0' }}>
          <div className="section-title" style={{ color: 'var(--main-color)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {t('personal_details')}
          </div>
          <div className="container_reg">
            <div className="line_reg">
              <label htmlFor="formOfAddress" className="form-formOfAddress_reg">{t('form_of_address')}</label>
              <select
                className="form-select_reg"
                id="formOfAddress"
                value={formOfAddress}
                onChange={(e) => setFormOfAddress(e.target.value)}
              >
                <option value="">{t('please_select')}</option>
                <option value="mr">{t('mr')}</option>
                <option value="ms">{t('ms')}</option>
              </select>
            </div>
            <div className="line_reg">
              <label htmlFor="firstName" className="form-firstName_reg">{t('first_name')}</label>
              <input
                type="text"
                className="form-control_reg"
                id="firstName"
                placeholder={t('first_name')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="surname" className="surname_reg">{t('surname')}</label>
              <input
                type="text"
                className="form-control_reg"
                id="surname"
                placeholder={t('surname')}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            
            <div className="line_reg">
              <label htmlFor="password" className="password_reg">{t('password')}</label>
              <input
                type="password"
                className="form-control_reg"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="line_reg">
              <label htmlFor="email" className="email_reg">{t('email')}</label>
              <input
                type="email"
                className="form-control_reg"
                id="email"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="line_reg">
              <label htmlFor="telephone" className="telephone_reg">{t('telephone')}</label>
              <input
                type="tel"
                className="form-control_reg"
                id="telephone"
                placeholder={t('telephone_example')}
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>
            
            <div className="line_reg">
              <label htmlFor="mobile" className="mobile_reg">{t('viber_whatsapp')}</label>
              <input
                type="tel"
                className="form-control_reg"
                id="mobile"
                placeholder={t('mobile_example')}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            
            <div className="line_reg">
              <label htmlFor="language" className="language_reg">{t('preferred_language')}</label>
              <select
                className="form-select_reg"
                id="language"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
              >
                <option value="">{t('select_language')}</option>
                <option value="en">{t('english')}</option>
                <option value="de">{t('german')}</option>
                <option value="fr">{t('french')}</option>
              </select>
            </div>
            <div className="line_reg">
              <label htmlFor="clientType" className="clientType_reg">{t('client_type')}</label>
              <select
                className="form-select_reg"
                id="clientType"
                value={clientType}
                onChange={(e) => setClientType(e.target.value)}
              >
                <option value="">{t('please_select')}</option>
                <option value="carrier">{t("carriers")}</option>
                <option value="broker">{t("brokers")}</option>
                <option value="shipper">{t("shippers")}</option>
              </select>
            </div>

          </div>
        </div>

        {/* Блок: Згода, reCAPTCHA та кнопка */}
        <div className="section-divider" style={{ margin: '2rem 0' }}>
          <div className="form-check_reg">
            <input className="form-check-input" type="checkbox" id="termsCheck" required />
            <label className="form-check-label" htmlFor="termsCheck">
              {t('accept_privacy')}{' '}
              <a href="#" style={{ color: 'var(--main-color)' }}>{t('privacy_policy')}</a>.
            </label>
          </div>

          <div className="mb-3">
            {/* Placeholder reCAPTCHA */}
            <div style={{
              width: '304px',
              height: '78px',
              backgroundColor: '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              reCAPTCHA
            </div>
          </div>

          <button type="submit" className="btn-main_reg">
            {t('registration')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationPage;
