import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import '../styles/UsetProfile.css';
import i18n from '../i18n';
import axios from 'axios';
import { getToken } from '../components/getToken';
import CompanyPhotoCropper from '../components/ImageCropper';
import { search } from 'swiss-zipcodes';

import { useLocation } from 'react-router-dom';

import { getNotificationStatus, setNotificationStatus } from '../api';



const UserProfile = () => {

  const { t } = useTranslation();

  const [userData, setUserData] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [companyData, setCompanyData] = useState({});


  const [zipCode, setZipCode] = useState('');
  const [zipCity, setZipCity] = useState('');
  const [zipCanton, setZipCanton] = useState('');

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(null);


 



  


  const navigate = useNavigate();

  const location = useLocation();

  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    const token = getToken();

    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/user/profile/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Отримані дані з бекенду:", data);
        if (data.username && data.profile) {
          setUserData(data);

          setIs2FAEnabled(!!data.profile?.is_2fa_enabled);
          localStorage.setItem("userProfile", JSON.stringify(data));
          setZipCode(data.profile.zip_code || '');
          setZipCity(data.profile.city || '');
          setZipCanton(data.profile.canton || '');

          // Фото компании
          axios.get('http://127.0.0.1:8000/api/company/photo/', {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => {
            const photoUrl = res.data.photo_url;
            if (photoUrl && !photoUrl.includes('no-photo-placeholder.png')) {
              setPhotoPreview(photoUrl);
            } else {
              setPhotoPreview(null);
            }
          });

          // ⬅️⬅️⬅️ ВОТ ЭТО ДОБАВЛЯЕМ
          getNotificationStatus()
            .then(data => {
              setNotificationsEnabled(data.notifications_enabled);
            })
            .catch(err => {
              console.error('Не удалось получить статус уведомлений:', err);
            });

        } else {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      });
  }, [navigate, refreshTrigger]);


  useEffect(() => {
    const token = getToken();

    if (userData.id) {
      axios.get('http://127.0.0.1:8000/api/company/info/', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setCompanyData(res.data); // обновим состояние
        localStorage.setItem('companyData', JSON.stringify(res.data));
      }).catch(err => {
        console.error('Не удалось получить данные компании:', err);
      });
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.profile && typeof userData.profile.is_2fa_enabled === 'boolean') {
      setIs2FAEnabled(userData.profile.is_2fa_enabled);
    }
  }, [userData]);



  

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [showPrefsModal, setShowPrefsModal] = useState(false);

    const openPrefsModal = () => setShowPrefsModal(true);
    const closePrefsModal = () => setShowPrefsModal(false);


    // const companyData = JSON.parse(localStorage.getItem('companyData')) || {};

    const handleLogout = () => {
      localStorage.removeItem('authToken');
      navigate('/login', { replace: true });
      window.location.reload();
    };
    // Функция обновления профиля
    const updateProfile = async (updatedData) => {
      const token = getToken();

      try {
        const response = await axios.patch('http://127.0.0.1:8000/api/user/profile/', updatedData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setUserData(response.data);
        if (response.data.profile) {
          setZipCode(response.data.profile.zip_code || '');
          setZipCity(response.data.profile.city || '');
          setZipCanton(response.data.profile.canton || '');
        }

        // 🔁 Сюда ДОБАВЬ ЭТО:
        const companyRes = await axios.get('http://127.0.0.1:8000/api/company/info/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem('companyData', JSON.stringify(companyRes.data));
        setCompanyData(companyRes.data); // 👈 вот это добавили


        alert(t('Профіль оновлено!'));
        setShowModal(false);
      } catch (error) {
        console.error('Помилка оновлення:', error);
        alert(t('Помилка оновлення профілю.'));
      }
    };


    const [companyPhoto, setCompanyPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);



    const [showCropper, setShowCropper] = useState(false);



    useEffect(() => {
      const token = getToken();
      axios.get('http://127.0.0.1:8000/api/company/photo/', {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => {
  const photoUrl = res.data.photo_url;
  // ⚠️ проверка: если это не заглушка — отображаем
  if (photoUrl && !photoUrl.includes('no-photo-placeholder.png')) {
    setPhotoPreview(photoUrl);
  } else {
    setPhotoPreview(null);  // ⛔️ если заглушка — не показываем
  }
});

    }, [refreshTrigger]); 

    useEffect(() => {
      if (location.state?.triggerRefresh) {
        setRefreshTrigger(prev => !prev); // 🔁 Форсируем повторный fetch
      }
    }, [location.state]);


    useEffect(() => {
      console.log("🔐 2FA значение в стейте:", is2FAEnabled);
    }, [is2FAEnabled]);

    

    const handlePhotoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setCompanyPhoto(file);
        setShowCropper(true);
    
        // ✅ Сброс input, чтобы можно было повторно выбрать тот же файл
        e.target.value = null;
      }
    };
    

    

    const deletePhoto = async () => {
      try {
        const token = getToken();
        await axios.delete('http://127.0.0.1:8000/api/company/photo/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPhotoPreview(null);
        setCompanyPhoto(null);
        alert(t('Фото видалено.'));
      } catch (err) {
        alert('Помилка при видаленні фото.');
      }
    };

    const cantonNames = {
      ZH: 'Zurich', BE: 'Bern', LU: 'Lucerne', UR: 'Uri', SZ: 'Schwyz', OW: 'Obwalden', NW: 'Nidwalden',
      GL: 'Glarus', ZG: 'Zug', FR: 'Fribourg', SO: 'Solothurn', BS: 'Basel-Stadt', BL: 'Basel-Landschaft',
      SH: 'Schaffhausen', AR: 'Appenzell Ausserrhoden', AI: 'Appenzell Innerrhoden', SG: 'St. Gallen',
      GR: 'Grisons', AG: 'Aargau', TG: 'Thurgau', TI: 'Ticino', VD: 'Vaud', VS: 'Valais',
      NE: 'Neuchâtel', GE: 'Geneva', JU: 'Jura',
    };
    
    const handleZipChange = (e) => {
      const zip = e.target.value;
      setZipCode(zip);
    
      if (zip.length >= 4) {
        const results = search({ zip: parseInt(zip) });
        if (results.length > 0) {
          const { commune, canton } = results[0];
          setZipCity(commune || '');
          setZipCanton(cantonNames[canton] || canton || '');
        } else {
          setZipCity('');
          setZipCanton('');
        }
      }
    };

    const handleEnable2FA = () => {
      navigate('/enable-2fa');
    };

    const handleDisable2FA = async () => {
      const token = getToken();
      try {
        await axios.delete('http://127.0.0.1:8000/api/user/disable-2fa/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(t('2fa_disabled_successfully'));
        setIs2FAEnabled(false); // Обновляем состояние
      } catch (err) {
        console.error('Ошибка при отключении 2FA:', err);
        alert(t('error_disabling_2fa'));
      }
    };

    const toggleNotifications = async () => {
      try {
        const newValue = !notificationsEnabled;
        await setNotificationStatus(newValue);
        setNotificationsEnabled(newValue);
      } catch (err) {
        console.error('Ошибка при переключении уведомлений:', err);
        alert(t('error_updating_notifications'));
      }
    };


    


  return (
    <div>
      {/* Profile Section */}
      <div className="container my-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">{t('user_profile')}</h2>
          <p>{t('manage_profile_info')}</p>
          <div className="card_user shadow-sm">
            <div className="card-body_user">
              <div className="row align-items-start">
                {/* Avatar */}
                <div className="col-md-3 d-flex flex-column align-items-center">
                  <div className="company-photo-wrapper">
                    {photoPreview ? (
                      <>
                        <img src={photoPreview} alt="Company" className="company-photo" />
                        <div className="company-photo-buttons">
                          <button onClick={deletePhoto} className="btn btn-outline-danger btn-sm">
                            {t('delete_photo')}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="company-photo-placeholder">
                        <span className="company-photo-text">{t('no_photo_uploaded')}</span>
                      </div>
                    )}
                    <div className="company-photo-buttons">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="company-photo-input visually-hidden"
                        id="hiddenFileInput"
                      />
                      <label htmlFor="hiddenFileInput" className="custom-file-label">
                        {t('choose_photo')}
                      </label>
                    </div>
                    {showCropper && (
                      <CompanyPhotoCropper
                        src={companyPhoto}
                        onComplete={() => {
                          setShowCropper(false);
                          setCompanyPhoto(null);
                          setRefreshTrigger(prev => !prev);
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Personal Details */}
                <div className="col-md-4 border-end profile-info-column">
                  <h5 className="card-title text-primary mb-3">{t('personal_details')}</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">👤 <strong>{t('name')}:</strong> {userData.profile?.full_name || userData.username}</li>
                    <li className="list-group-item">✉️ <strong>{t('email')}:</strong> {userData.email}</li>
                    <li className="list-group-item">📞 <strong>{t('phone')}:</strong> {userData.profile?.phone || 'Not provided'}</li>
                    <li className="list-group-item">📱 <strong>{t('viber_whatsapp')}:</strong> {userData.profile?.viber_whatsapp_number || 'Not provided'}</li> {/* ← Вайбер */}
                    <li className="list-group-item">🗣️ <strong>{t('preferred_language')}:</strong> {userData.profile?.preferred_language || 'English'}</li>
                  </ul>
                  <div className="col-12 mt-0 text-center">
                  <button className="bbtn-main px-4" onClick={openModal}>
                    {t('edit_profile')}
                  </button>
                </div>
                </div>

                {/* Company Details */}
                <div className="col-md-5 profile-info-column">
                  <h5 className="card-title text-primary mb-3">{t('company_details')}</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">🏢 <strong>{t('company')}:</strong> {companyData.name || 'Not provided'}</li>
                    <li className="list-group-item">📌 <strong>{t('zip_code')}:</strong> {companyData.zip_code || 'Not provided'}</li>
                    <li className="list-group-item">🏙️ <strong>{t('city')}:</strong> {companyData.city || 'Not provided'}</li>
                    <li className="list-group-item">📍 <strong>{t('address')}:</strong> {companyData.address || 'Not provided'}</li>
                    <li className="list-group-item">🌍 <strong>{t('canton')}:</strong> {companyData.canton || 'Not provided'}</li>
                  </ul>
                </div>
                {/* <div className="col-12 mt-0 text-center">
                  <button className="bbtn-main px-4" onClick={openModal}>
                    {t('edit_profile')}
                  </button>
                </div> */}
              </div>

              {/* <div className="text-center">
                <button className="bbtn-main px-4" onClick={openModal}>
                  {t('edit_profile')}
                </button>
              </div> */}
            </div>
          </div>

      {/* Modal for Editing Profile */}
        {showModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <div className="custom-modal-header">
                <h5>{t('edit_profile')}</h5>
                <button className="custom-modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="custom-modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const updatedData = {
                    username: e.target.username.value,
                    email: e.target.email.value,
                    profile: {
                      company: e.target.company.value,
                      address: e.target.address.value,
                      zip_code: e.target.zip_code.value,
                      canton: e.target.canton.value,
                      phone: e.target.phone.value,
                      city: e.target.city.value,
                      viber_whatsapp_number: e.target.viber?.value || '',
                      preferred_language: e.target.language.value,
                    }
                  };
                  updateProfile(updatedData);
                }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">{t('name')}</label>
                      <input type="text" name="username" className="form-control" defaultValue={userData?.username || ''} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('email')}</label>
                      <input type="email" name="email" className="form-control" defaultValue={userData?.email || ''} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('phone')}</label>
                      <input type="text" name="phone" className="form-control" defaultValue={userData.profile?.phone || ''} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('preferred_language')}</label>
                      <select name="language" className="form-select" defaultValue={userData.profile?.preferred_language || ''}>
                        <option>{t('english')}</option>
                        <option>{t('german')}</option>
                        <option>{t('french')}</option>
                        <option>{t('italian')}</option>
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">{t('company')}</label>
                      <input type="text" name="company" className="form-control" defaultValue={userData.profile?.company || ''} />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">{t('address')}</label>
                      <input type="text" name="address" className="form-control" defaultValue={userData.profile?.address || ''} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('zip_code')}</label>
                      <input
                        type="text"
                        name="zip_code"
                        className="form-control"
                        value={zipCode}
                        onChange={handleZipChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('canton')}</label>
                      <input
                        type="text"
                        name="canton"
                        className="form-control"
                        value={zipCanton}
                        onChange={(e) => setZipCanton(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('city')}</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={zipCity}
                        onChange={(e) => setZipCity(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('viber_whatsapp')}</label>
                      <input type="text" name="viber" className="form-control" defaultValue={userData.profile?.viber_whatsapp_number || ''} />
                    </div>
                  </div>
                  <div className="text-end mt-4">
                    <button type="button" className="btn btn-secondary me-2" onClick={closeModal}>
                      {t('close')}
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {t('save_changes')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}


        </div>

        {showPrefsModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal" style={{ maxWidth: '600px' }}>
              <div className="custom-modal-header">
                <h5>{t('manage_preferences')}</h5>
              </div>
              <div className="custom-modal-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🔔 {t('notifications')}:</span>
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        {notificationsEnabled ? t('enabled') : t('disabled')}
                      </span>
                      <button
                        className={`btn btn-sm ${notificationsEnabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={toggleNotifications}
                      >
                        {notificationsEnabled ? t('disable') : t('enable')}
                      </button>
                    </div>
                  </li>


                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🔒 {t('password')}:</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        closePrefsModal();
                        navigate('/change-password');
                      }}
                    >
                      {t('change')}
                    </button>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🔑 Two-factor authentication (2FA):</span>
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        {is2FAEnabled ? t('enabled') : t('disabled')}
                      </span>
                      {is2FAEnabled ? (
                        <button className="btn btn-outline-danger btn-sm" onClick={handleDisable2FA}>
                          {t('remove')}
                        </button>
                      ) : (
                        <button className="btn btn-outline-success btn-sm" onClick={handleEnable2FA}>
                          {t('enable')}
                        </button>
                      )}
                    </div>
                  </li>
                </ul>
                <div className="text-end mt-4">
                  <button type="button" className="btn btn-secondary" onClick={closePrefsModal}>
                    {t('close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Preferences */}
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title text-primary mb-3">{t('preferences_settings')}</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                🔔 <strong>{t('notifications')}:</strong> {notificationsEnabled === null ? '...' : (notificationsEnabled ? t('enabled') : t('disabled'))}
              </li>

              <li className="list-group-item">🔒 <strong>{t('password')}:</strong> ************</li>
              <li className="list-group-item">🔑 <strong>{t('two_factor_authentication')}:</strong> {is2FAEnabled ? t('enabled') : t('disabled')}</li>
              <li className="list-group-item">🕒 <strong>{t('timezone')}:</strong> CET (Central European Time)</li>
              
            </ul>
            <div className="text-center mt-4">
              <button className="btn btn-secondary px-4" onClick={openPrefsModal}>
                {t('manage_preferences')}
              </button>
            </div>
          </div>
        </div>


        
          {/* Logout Button */}
          <div className="text-center mt-4">
            <button className="btn logout-btn px-4" onClick={handleLogout}>{t('log_out')}</button>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-5">
        <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center">
          <p className="mb-0 text-muted">
            {t('footer_text')}
          </p>
          <div className="footer-links">
            <Link to="/services">{t('services')}</Link>
            
            <Link to="/contacts">{t('contacts')}</Link>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
