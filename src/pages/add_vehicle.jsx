import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { search } from 'swiss-zipcodes';
import '../styles/TruckForm.css';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { getToken } from '../components/getToken';

function TruckPostingForm() {
  const { t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  
    const savedEmail = localStorage.getItem('userEmail');
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedEmail || savedProfile) {
      const parsedProfile = savedProfile ? JSON.parse(savedProfile) : {};
  
      setFormData(prev => ({
        ...prev,
        email: savedEmail || '',
        phone: parsedProfile?.profile?.phone || '',
        whatsapp: parsedProfile?.profile?.viber_whatsapp_number || '',
      }));
    }
  }, []);
  
  

  const [formData, setFormData] = useState({
    loadingDateFrom: '',
    loadingCity: '',
    loadingCanton: '',   // Новое поле
    loadingZipCode: '',
    unloadingCanton: '', // Новое поле
    unloadingCity: '',   // Новое поле
    unloadingZipCode: '',// Новое поле
    vehicleType: '',
    numberOfVehicles: '',
    carryingCapacity: '',
    usefulVolume: '',
    length: '',
    width: '',
    height: '',
    email: '',
    phone: '',
    price: '',
    whatsapp: '',
    hasGPS: false,
    additionalInfo: '',
    truck_loading_street: '',
    truck_unloading_street: '',
  });

  const vehicleTypes = [
    { value: 'not_specified', label: t('not_specified') },
    { value: 'tent', label: t('tent') },
    { value: 'isotherm', label: t('isothermal') },
    { value: 'all_metal', label: t('all_metal') },
    { value: 'refrigerator', label: t('refrigerator') },
    { value: 'cargo_bus', label: t('passenger_bus') },
    { value: 'luxury_bus', label: t('luxury_bus') },
    { value: 'car_carrier', label: t('car_carrier') },
    { value: 'crane_truck', label: t('crane_truck') },
    { value: 'fuel_truck', label: t('fuel_tanker') },
    { value: 'concrete_mixer', label: t('concrete_mixer') },
    { value: 'bitumen_truck', label: t('bitumen_tanker') },
    { value: 'flour_truck', label: t('flour_tanker') },
    { value: 'flatbed', label: t('flatbed') },
    { value: 'open_platform', label: t('open_truck') },
    { value: 'tow_truck', label: t('tow_truck') },
    { value: 'excavator', label: t('excavator') },
    { value: 'grain_truck', label: t('grain_truck') },
    { value: 'grain_dump_truck', label: t('grain_dump') },
    { value: 'empty_container', label: t('empty_container') },
    { value: 'container_carrier', label: t('container_carrier') },
    { value: 'feed_carrier', label: t('feed_truck') },
    { value: 'timber_truck', label: t('forest_truck') },
    { value: 'manipulator', label: t('manipulator') },
    { value: 'oil_truck', label: t('oil_tanker') },
    { value: 'furniture_truck', label: t('furniture_truck') },
    { value: 'metal_scrap_truck', label: t('metal_scrap_truck') },
    { value: 'minibus', label: t('minibus') },
    { value: 'oversized', label: t('oversized') },
    { value: 'panel_carrier', label: t('panel_truck') },
    { value: 'platform', label: t('platform') },
    { value: 'poultry_truck', label: t('poultry_truck') },
    { value: 'roll_carrier', label: t('roll_carrier') },
    { value: 'dump_truck', label: t('dump_truck') },
    { value: 'glass_carrier', label: t('glass_truck') },
    { value: 'cattle_truck', label: t('cattle_truck') },
    { value: 'special_vehicle', label: t('special_vehicle') },
    { value: 'lowboy_trailer', label: t('trawl') },
    { value: 'pipe_carrier', label: t('pipe_carrier') },
    { value: 'tractor', label: t('tractor') },
    { value: 'cement_truck', label: t('cement_truck') },
    { value: 'gas_tanker', label: t('gas_tanker') },
    { value: 'food_tanker', label: t('food_tanker') },
    { value: 'chemical_tanker', label: t('chemical_tanker') },
    { value: 'all_plastic', label: t('plastic_tank') },
    { value: 'wood_chip_truck', label: t('chip_truck') }
  ];

  const navigate = useNavigate();
//
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; 

  const formattedData = {
    loading_date_from: formData.loadingDateFrom,
    loading_date_to: formData.loadingDateTo,
    vehicle_type: formData.vehicleType,
    number_of_vehicles: parseInt(formData.numberOfVehicles) || 1,
    carrying_capacity: parseFloat(formData.carryingCapacity) || null,
    useful_volume: parseFloat(formData.usefulVolume) || null,
    length: parseFloat(formData.length) || null,
    width: parseFloat(formData.width) || null,
    height: parseFloat(formData.height) || null,
    email: formData.email,
    phone: formData.phone,
    whatsapp: formData.whatsapp,
    has_gps: formData.hasGPS,
    additional_info: formData.additionalInfo,
    loading_canton: formData.loadingCanton || '',  // Исправлено
    unloading_canton: formData.unloadingCanton || '',  // Исправлено
    loading_city: String(formData.loadingCity) || '',
    loading_postal: String(formData.loadingZipCode) || '',
    unloading_city: String(formData.unloadingCity) || '',
    unloading_postal: String(formData.unloadingZipCode) || '',
    price: formData.price ? parseFloat(formData.price) : null,
    loading_location: `${formData.loadingCity}, ${formData.loadingCanton}, ${formData.loadingZipCode}`,
    unloading_location: `${formData.unloadingCity}, ${formData.unloadingCanton}, ${formData.unloadingZipCode}`,
    truck_loading_street: formData.truck_loading_street || '',
    truck_unloading_street: formData.truck_unloading_street || '',
};

const handleZipChange = (e, fieldPrefix) => {
  const zip = e.target.value;
  const results = search({ zip: parseInt(zip) });

  if (results.length > 0) {
    const location = results[0];

    setFormData(prev => ({
      ...prev,
      [`${fieldPrefix}ZipCode`]: zip,
      [`${fieldPrefix}City`]: location.commune || '',
      [`${fieldPrefix}Canton`]: location.canton || '',
      zipErrors: {
        ...prev.zipErrors,
        [fieldPrefix]: '' // очищаємо помилку
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [`${fieldPrefix}ZipCode`]: zip,
      [`${fieldPrefix}City`]: '',
      [`${fieldPrefix}Canton`]: '',
      zipErrors: {
        ...prev.zipErrors,
        [fieldPrefix]: t('zip_not_found') || 'ZIP не знайдено'
      }
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //     const response = await axios.post('http://127.0.0.1:8000/api/trucks/', formattedData);
    //     if (response.status === 201) {
    //         navigate('/'); // Виклик перенаправлення після успішного збереження
    //     }
    // } catch (error) {
    //     console.error(t('error'), error);
    //     alert(t('data_save_error'));
    // }
    console.log("📦 Данні перед відправкою:", JSON.stringify(formattedData, null, 2));

    
    const token = getToken();

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/trucks/', formattedData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''  // Додати токен якщо він існує
            }
        });

        if (response.status === 201) {  // Якщо сервер повернув "Створено"
            alert(t('data_saved_successfully'));
            console.log("✅ Відповідь сервера:", response.data);
            navigate('/');  // Переходимо на головну сторінку після успішного додавання
        } else {
            alert(t('unexpected_error'));
            console.log("⚠️ Несподівана відповідь сервера:", response);
        }

    } catch (error) {
      if (error.response) {
        console.log("❌ Відповідь з помилкою:", error.response.data);  // 👈 покажет поля
        alert("❌ Помилка: " + JSON.stringify(error.response.data, null, 2));  // 👈 покажет точную причину
      } else if (error.request) {
        console.log("📡 Сервер не відповів:", error.request);
        alert('❌ Сервер не відповідає.');
      } else {
        console.log("❗️ Інша помилка:", error.message);
        alert(`❌ Виникла помилка: ${error.message}`);
      }
    }
    
  };

  return (
    <div className=" horizontal-form-container_1">
      <h1>{t('add_vihicle_request')}</h1>
      {/* <p className="form-subtitle">{t('loading_points')}</p> */}

      <form onSubmit={handleSubmit} className="horizontal-form_1">
        {/* Первая строка: Даты и места загрузки */}
        <div className="form-row_1">
          <div className="form-group_1">
            <label>{t('date_from')}</label>
            <input
              type="date"
              name="loadingDateFrom"
              value={formData.loadingDateFrom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group_1">
            <label>{t('date_to')}</label>
            <input
              type="date"
              name="loadingDateTo"
              value={formData.loadingDateTo}
              onChange={handleChange}
              required
            />
          </div>
          
        </div>

        
        {/* 2 строка: Тип транспорта и места разгрузки */}
        <div className="form-row_1">

          <div className="form-group_1">
            <label>{t('loading_zip_code')}</label>
            <input
              type="text"
              name="loadingZipCode"
              value={formData.loadingZipCode}
              onChange={(e) => handleZipChange(e, 'loading')}
              placeholder={t('enter_zip_code')}
              required
            />
          </div>

          <div className="form-group_1">
              <label>{t('loading_city')}</label>
              <input
                  type="text"
                  name="loadingCity"
                  value={formData.loadingCity}
                  onChange={handleChange}
                  placeholder={t('enter_city')}
                  required
              />
          </div>

          <div className="loading_street_vehicle">
            <label className="form-label_vehicle">{t('loading_street')}</label>
            <input className="form-control_vehicle" value={formData.truck_loading_street} name="truck_loading_street" onChange={handleChange}/>
          </div>
          <div className="form-group_new_select">
            <label>{t('loading_canton')}</label>
            <select className="form-select_new_select"
                name="loadingCanton"
                value={formData.loadingCanton}
                onChange={handleChange}
                required
            >
                <option value="">{t('select_canton')}</option>
                <option value="ZH">{t('zurich')}</option>
                <option value="BE">{t('bern')}</option>
                <option value="LU">{t('lucerne')}</option>
                <option value="UR">{t('uri')}</option>
                <option value="SZ">{t('schwyz')}</option>
                <option value="OW">{t('obwalden')}</option>
                <option value="NW">{t('nidwalden')}</option>
                <option value="GL">{t('glarus')}</option>
                <option value="ZG">{t('zug')}</option>
                <option value="FR">{t('fribourg')}</option>
                <option value="SO">{t('solothurn')}</option>
                <option value="BS">{t('basel_stadt')}</option>
                <option value="BL">{t('basel_landschaft')}</option>
                <option value="SH">{t('schaffhausen')}</option>
                <option value="AR">{t('appenzell_ausserrhoden')}</option>
                <option value="AI">{t('appenzell_innerrhoden')}</option>
                <option value="SG">{t('st_gallen')}</option>
                <option value="GR">{t('grisons')}</option>
                <option value="AG">{t('aargau')}</option>
                <option value="TG">{t('thurgau')}</option>
                <option value="TI">{t('ticino')}</option>
                <option value="VD">{t('vaud')}</option>
                <option value="VS">{t('valais')}</option>
                <option value="NE">{t('neuchatel')}</option>
                <option value="GE">{t('geneva')}</option>
                <option value="JU">{t('jura')}</option>


            </select>
        </div>

        
      </div>

      {/* 3 строка: Тип транспорта и места разгрузки */}

      <div className="form-row_1">

          <div className="form-group_1">
            <label>{t('unloading_zip_code')}</label>
            <input
              type="text"
              name="unloadingZipCode"
              value={formData.unloadingZipCode}
              onChange={(e) => handleZipChange(e, 'unloading')}
              placeholder={t('enter_zip_code')}
              required
            />
        </div>

        <div className="form-group_1">
            <label>{t('unloading_city')}</label>
            <input
                type="text"
                name="unloadingCity"
                value={formData.unloadingCity}
                onChange={handleChange}
                placeholder={t('enter_city')}
                required
            />
        </div>
        <div className="unloading_street_vehicle">
            <label className="form-label_vehicle">{t('unloading_street')}</label>
            <input className="form-control_vehicle" value={formData.truck_unloading_street} name="truck_unloading_street" onChange={handleChange}/>
          </div>
        <div className="form-group_new_select">
            <label>{t('unloading_canton')}</label>
            <select className="form-select_new_select"
                name="unloadingCanton"
                value={formData.unloadingCanton}
                onChange={handleChange}
                placeholder={t('enter_canton')}
                required
            >
              <option value="">{t('select_canton')}</option>
              <option value="ZH">{t('zurich')}</option>
              <option value="BE">{t('bern')}</option>
              <option value="LU">{t('lucerne')}</option>
              <option value="UR">{t('uri')}</option>
              <option value="SZ">{t('schwyz')}</option>
              <option value="OW">{t('obwalden')}</option>
              <option value="NW">{t('nidwalden')}</option>
              <option value="GL">{t('glarus')}</option>
              <option value="ZG">{t('zug')}</option>
              <option value="FR">{t('fribourg')}</option>
              <option value="SO">{t('solothurn')}</option>
              <option value="BS">{t('basel_stadt')}</option>
              <option value="BL">{t('basel_landschaft')}</option>
              <option value="SH">{t('schaffhausen')}</option>
              <option value="AR">{t('appenzell_ausserrhoden')}</option>
              <option value="AI">{t('appenzell_innerrhoden')}</option>
              <option value="SG">{t('st_gallen')}</option>
              <option value="GR">{t('grisons')}</option>
              <option value="AG">{t('aargau')}</option>
              <option value="TG">{t('thurgau')}</option>
              <option value="TI">{t('ticino')}</option>
              <option value="VD">{t('vaud')}</option>
              <option value="VS">{t('valais')}</option>
              <option value="NE">{t('neuchatel')}</option>
              <option value="GE">{t('geneva')}</option>
              <option value="JU">{t('jura')}</option>

            </select>
        </div>
    </div>

        {/* 4 строка: Тип транспорта и места разгрузки */}
        <div className="form-row_1">
          <div className="form-group_new_select">
            <label>{t('vehicle_type')}</label>
            <Select
              options={vehicleTypes}
              name="vehicleType"
              value={vehicleTypes.find(option => option.value === formData.vehicleType)}
              onChange={(selectedOption) => setFormData({
                ...formData,
                vehicleType: selectedOption ? selectedOption.value : ''
              })}
              placeholder={t('select_vehicle_type')}
              className="vehicle-type-select"
            />
          </div>
          
          <div className="form-group_1">
            <label>{t('weight_tons')}</label>
            <input
              type="number"
              name="carryingCapacity"
              value={formData.carryingCapacity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group_1">
            <label>{t('volume_m3')}</label>
            <input
              type="number"
              name="usefulVolume"
              value={formData.usefulVolume}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          {/* <div className="form-group">
            <label>{t('length')} (m)</label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div> */}
          {/* <div className="form-group">
            <label>{t('width')} (m)</label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>{t('height')} (m)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div> */}
        </div>

        <div className="form-row_1">
        <div className="form-group_1">
            <label>{t('price')}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="100"
              required
            />
          </div>
          <div className="form-group_1">
            <label>{t('truck_count')}</label>
            <input
              type="number"
              name="numberOfVehicles"
              value={formData.numberOfVehicles}
              onChange={handleChange}
              placeholder="3"
              required
            />
          </div>
        </div>

        {/* Четвертая строка: Дополнительные характеристики */}
        <div className="form-row_1">
          
          <div className="form-group_1">
            <label>{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              required
            />
          </div>
          <div className="form-group_1">
            <label>{t('telephone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+410123456789"
              required
            />
          </div>
          <div className="form-group_1">
            <label>{t('whatsapp')}/Viber</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </div>
          <div className="form-group_1">
            <input
              type="checkbox"
              id="hasGPS"
              name="hasGPS"
              checked={formData.hasGPS}
              onChange={handleChange}
            />
            <label htmlFor="hasGPS">{t('gps_installed')}</label>
          </div>
        </div> 
          

        {/* Пятая строка: Контактная информация */}
        <div className="form-row_1">
        <div className="form-group_1">
            <label>{t('additional_information')}</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder={t('specify')}
              rows="3"
            ></textarea>
          </div>
        </div>


        {/* Кнопки отправки */}
        <div className="form-actions_1">
          <button type="submit" className="submit-button_1">
            {t('post')}
          </button>
          <button type="button" className="home-button_1" onClick={() => navigate('/')}>
            {t('home')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TruckPostingForm;