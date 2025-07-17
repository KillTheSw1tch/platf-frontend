import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/add_cargo.css';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { search } from 'swiss-zipcodes';


function AddCargoRequest() {

  const { t } = useTranslation();

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
  
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFormData(prev => ({
        ...prev,
        email: parsed.email || prev.email,
        phone_number: parsed.profile?.phone || '',
        viber_whatsapp_number: parsed.profile?.viber_whatsapp_number || '',
      }));
    }
  }, []);
  

  

  const [formData, setFormData] = useState({
    loading_city_primary: '',
    loading_postal_primary: '',
    unloading_city_primary: '',
    unloading_postal_primary: '',
    cargo_type: '',
    weight: '',
    volume: '',
    date_from: '',
    date_to: '',
    transport_type: '',
    truck_count: '',
    price: '',
    extra_info: '',
    loading_canton: '',
    unloading_canton: '',
    phone_number: '',
    viber_whatsapp_number: '',
    email: localStorage.getItem('userEmail') || '',
    cargo_loading_street: '',
    cargo_unloading_street: '',
    zipErrors: {
      loading: '',
      unloading: ''
    }
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!formData.transport_type) {
        setFormData((prevFormData) => ({ ...prevFormData, transport_type: '0' }));
    }
  }, [formData]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken'); // Забираем токен из localStorage
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Добавляем токен
        }
      };
  
      const response = await axios.post('http://127.0.0.1:8000/api/cargo/', formattedData, config);
  
      if (response.status === 201 || response.status === 200) {
        navigate('/'); // Перенаправляем на главную после успешной отправки
      }
    } catch (error) {
      console.error(t('error'), error);
      alert(t('data_save_error'));
    }
  };
  

  const formattedData = {
    loading_city_primary: formData.loading_city_primary || '',
    loading_postal_primary: formData.loading_postal_primary || '',
    unloading_city_primary: formData.unloading_city_primary || '',
    unloading_postal_primary: formData.unloading_postal_primary || '',
    date_from: formData.date_from || '',
    date_to: formData.date_to || '',
    cargo_type: formData.cargo_type || '',
    weight: parseFloat(formData.weight) || 0,
    volume: parseFloat(formData.volume) || 0,
    transport_type: formData.transport_type || '',
    truck_count: parseInt(formData.truck_count) || 0,
    price: parseFloat(formData.price) || 0,
    loading_canton: formData.loading_canton || '',  // Добавлено
    unloading_canton: formData.unloading_canton || '',  // Добавлено
    phone_number: formData.phone_number || '',
    viber_whatsapp_number: formData.viber_whatsapp_number || '',
    extra_info: formData.extra_info || '',
    email: formData.email || '',
    cargo_loading_street: formData.cargo_loading_street || '',
    cargo_unloading_street: formData.cargo_unloading_street || '',
    unloadingZipCode: formData.unloadingZipCode || '',
    loadingZipCode: formData.loadingZipCode || '',
};

const handleZipChange = (e, fieldPrefix) => {
  const zip = e.target.value;
  const results = search({ zip: parseInt(zip) });

  if (results.length > 0) {
    const location = results[0];      

    setFormData(prev => ({
      ...prev,
      [`${fieldPrefix}_postal_primary`]: zip,
      [`${fieldPrefix}_city_primary`]: location.commune || '',
      [`${fieldPrefix}_canton`]: location.canton || '',
      zipErrors: {
        ...prev.zipErrors,
        [fieldPrefix]: ''
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [`${fieldPrefix}_postal_primary`]: zip,
      [`${fieldPrefix}_city_primary`]: '',
      [`${fieldPrefix}_canton`]: '',
      zipErrors: {
        ...prev.zipErrors,
        [fieldPrefix]: t('zip_not_found') || 'ZIP не знайдено'
      }
    }));
  }
};

  return (
    <div className="container_addC">
      <h1 className="fw-bold">{t('add_cargo_request')}</h1>
      <form onSubmit={handleSubmit} className="row">

      <div className="row">
          <div className="date_from">
            <label className="form-label">{t('date_from')}</label>
            <input className="form-control" value={formData.date_from} name="date_from" type="date" onChange={handleChange} required/>
          </div>

          <div className="date_to">
            <label className="form-label">{t('date_to')}</label>
            <input className="form-control" value={formData.date_to} name="date_to" type="date" onChange={handleChange} required/>
          </div>
        </div>

        

        <div className="form-row">
        <div className="form-group">
        <label className="form-label">{t('loading_zip_code')}</label>
        <input
            className="form-control"
            value={formData.loading_postal_primary}
            name="loading_postal_primary"
            onChange={(e) => handleZipChange(e, 'loading')}
            required
          />
          </div>
          <div className="form-group">
            <label className="form-label">{t('loading_city')}</label>
            <input className="form-control" value={formData.loading_city_primary} name="loading_city_primary" onChange={handleChange} required/>
          </div>
          <div className="form-group">
            <label className="form-label">{t('loading_street')}</label>
            <input className="form-control" value={formData.cargo_loading_street} name="cargo_loading_street" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="form-label">{t('loading_canton')}</label>
            
            <select className="form-select" value={formData.loading_canton} name="loading_canton" onChange={handleChange} required>
              
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


        <div className="form-row">

          <div className="form-group">
            <label className="form-label">{t('unloading_zip_code')}</label>
              <input
                className="form-control"
                value={formData.unloading_postal_primary}
                name="unloading_postal_primary"
                onChange={(e) => handleZipChange(e, 'unloading')}
                required
              />    
            </div>

          <div className="form-group">
            <label className="form-label">{t('unloading_city')}</label>
            <input className="form-control" value={formData.unloading_city_primary} name="unloading_city_primary" onChange={handleChange} required/>
          </div>
          <div className="form-group">
            <label className="form-label">{t('unloading_street')}</label>
            <input className="form-control" value={formData.cargo_unloading_street} name="cargo_unloading_street" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="form-label">{t('unloading_canton')}</label>
            
            <select className="form-select" value={formData.unloading_canton} name="unloading_canton" onChange={handleChange} required>

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

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('transport_type')}</label>
            <select name="transport_type" value={formData.transport_type} onChange={handleChange} className="form-select">

            
              <option value="0">{t('any_vehicle')}</option>
              <option value="1">{t('bus')}</option>
              <option value="29">{t('passenger_bus')}</option>
              <option value="30">{t('luxury_bus')}</option>
              <option value="17">{t('car_carrier')}</option>
              <option value="23">{t('crane_truck')}</option>
              <option value="39">{t('fuel_tanker')}</option>
              <option value="50">{t('concrete_mixer')}</option>
              <option value="42">{t('bitumen_tanker')}</option>
              <option value="44">{t('flour_tanker')}</option>
              <option value="7">{t('flatbed')}</option>
              <option value="8">{t('open_truck')}</option>
              <option value="41">{t('tow_truck')}</option>
              <option value="43">{t('excavator')}</option>
              <option value="3">{t('grain_truck')}</option>
              <option value="58">{t('grain_dump')}</option>
              <option value="4">{t('isothermal')}</option>
              <option value="54">{t('empty_container')}</option>
              <option value="24">{t('container_truck')}</option>
              <option value="53">{t('feed_truck')}</option>
              <option value="21">{t('closed')}</option>
              <option value="5">{t('forest_truck')}</option>
              <option value="57">{t('manipulator')}</option>
              <option value="40">{t('oil_tanker')}</option>
              <option value="36">{t('furniture_truck')}</option>
              <option value="56">{t('metal_scrap_truck')}</option>
              <option value="34">{t('minibus')}</option>
              <option value="33">{t('oversized')}</option>
              <option value="47">{t('panel_truck')}</option>
              <option value="9">{t('platform')}</option>
              <option value="52">{t('poultry_truck')}</option>
              <option value="101">{t('refrigerator')}</option>
              <option value="59">{t('roll_carrier')}</option>
              <option value="22">{t('dump_truck')}</option>
              <option value="48">{t('glass_truck')}</option>
              <option value="38">{t('cattle_truck')}</option>
              <option value="37">{t('special_vehicle')}</option>
              <option value="11">{t('tent')}</option>
              <option value="31">{t('trawl')}</option>
              <option value="35">{t('pipe_carrier')}</option>
              <option value="28">{t('tractor')}</option>
              <option value="32">{t('cement_truck')}</option>
              <option value="49">{t('gas_tanker')}</option>
              <option value="51">{t('isothermal_tanker')}</option>
              <option value="2">{t('food_tanker')}</option>
              <option value="14">{t('chemical_tanker')}</option>
              <option value="19">{t('all_metal')}.</option>
              <option value="20">{t('plastic_tank')}</option>
              <option value="55">{t('chip_truck')}</option>
              </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('weight_tons')}</label>
            <input className="form-control" value={formData.weight} name="weight" type="number" onChange={handleChange} required/>
          </div>

          <div className="form-group">
            <label className="form-label">{t('volume_m3')}</label>
            <input className="form-control" value={formData.volume} name="volume" type="number" onChange={handleChange}/>
          </div>
        </div>

        <div className="row">
          <div className="cargo_type">
            <label className="form-label">{t('cargo_type')}</label>
            <input className="form-control" value={formData.cargo_type} name="cargo_type" onChange={handleChange} required/>
          </div>

          <div className="truck_count">
            <label className="form-label">{t('truck_count')}</label>
            <input className="form-control" value={formData.truck_count} name="truck_count" type="number" onChange={handleChange}/>
          </div>

          <div className="price">
            <label className="form-label">{t('price')}</label>
            <input className="form-control" value={formData.price} name="price" type="number" onChange={handleChange}/>
          </div>
        </div>

        <div className="row">
          <div className="telephone">
            <label className="form-label">{t('telephone')}</label>
            <input className="form-control" value={formData.phone_number} name="phone_number" onChange={handleChange} required />
          </div>

          <div className="email">
            <label className="form-label">{t('email')}</label>
            <input className="form-control" value={formData.email} name="email" onChange={handleChange} required/>
          </div>

          <div className="whatsapp">
            <label className="form-label">{t('whatsapp')}/Viber</label>
            <input className="form-control" value={formData.viber_whatsapp_number} name="viber_whatsapp_number" onChange={handleChange} required/>
          </div>
        </div>
    

        <div className="extra_information">
          <label className="form-label">{t('extra_information')}</label>
          <textarea className="form-control" value={formData.extra_info} name="extra_info" rows="3" onChange={handleChange}></textarea>
        </div>

        <div className="submit">
          <button className="btn btn-primary" type="submit">{t('submit')}</button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>{t('home')}</button>
        </div>
      </form>
    </div>
  );
}

export default AddCargoRequest;
