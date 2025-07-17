import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function FindTransCargo() {

const navigate = useNavigate();

const { t } = useTranslation();

const [searchType, setSearchType] = useState('cargo');
  const [fromCountry, setFromCountry] = useState('AG');
  const [toCountry, setToCountry] = useState('ZH');
  const [fromZip, setFromZip] = useState('');
  //const [toloading_city, setunloading_city] = useState('');
  const [toZip, setToZip] = useState('');
  const [fromDate, setFromDate] = useState('2025-03-30');
  const [toDate, setToDate] = useState('2025-05-30');
  const [massFrom, setMassFrom] = useState('');
  const [massTo, setMassTo] = useState('');
  const [volumeFrom, setVolumeFrom] = useState('');
  const [volumeTo, setVolumeTo] = useState('');
  const [transportType, setTransportType] = useState('any');

  const handleSearch = () => {
    console.log("Search clicked", {
        searchType,
        fromCountry,
        fromZip,
        toCountry,
        toZip,
        fromDate,
        toDate,
        massFrom,
        massTo,
        volumeFrom,
        volumeTo,
        transportType
    });

    // Создаем объект с параметрами, исключая пустые значения
    const params = new URLSearchParams();

    if (fromCountry) params.append("fromCountry", fromCountry);
    if (fromZip) params.append("fromZip", fromZip);
    if (toCountry) params.append("toCountry", toCountry);
    if (toZip) params.append("toZip", toZip);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (massFrom) params.append("massFrom", massFrom);
    if (massTo) params.append("massTo", massTo);
    if (volumeFrom) params.append("volumeFrom", volumeFrom);
    if (volumeTo) params.append("volumeTo", volumeTo);
    if (transportType && transportType !== "any") params.append("transportType", transportType);

    const searchUrl = searchType === 'cargo' ? '/search-cargo' : '/search-transport';
    navigate(`${searchUrl}?${params.toString()}`);
};




  /*const cantonZipMapping = {
    Zürich: '8000',
    Bern: '3000',
    Luzern: '6000',
    Uri: '6460',
    Schwyz: '6430',
    Obwalden: '6060',
    Nidwalden: '6370',
    Glarus: '8750',
    Zug: '6300',
    Fribourg: '1700',
    Solothurn: '4500',
    'Basel-Stadt': '4000',
    'Basel-Landschaft': '4410',
    Schaffhausen: '8200',
    'Appenzell Ausserrhoden': '9100',
    'Appenzell Innerrhoden': '9050',
    'St. Gallen': '9000',
    Graubünden: '7000',
    Aargau: '5000',
    Thurgau: '8500',
    Ticino: '6500',
    Vaud: '1000',
    Valais: '1950',
    Neuchâtel: '2000',
    Genève: '1200',
    Jura: '2800',
  };*/

  // Коли користувач змінює кантон "звідки"
  /*useEffect(() => {
    setFromZip(cantonZipMapping[fromCountry] || '');
  }, [fromCountry]);

  // Коли користувач змінює кантон "куди"
  useEffect(() => {
    setToZip(cantonZipMapping[toCountry] || '');
  }, [toCountry]);

  // Зворотна логіка: Коли користувач вводить ZIP "звідки"
  useEffect(() => {
    const cantonEntry = Object.entries(cantonZipMapping).find(
      ([, zip]) => zip === fromZip
    );
    if (cantonEntry) setFromCountry(cantonEntry[0]);
  }, [fromZip]);

  // Зворотна логіка: Коли користувач вводить ZIP "куди"
  useEffect(() => {
    const cantonEntry = Object.entries(cantonZipMapping).find(
      ([, zip]) => zip === toZip
    );
    if (cantonEntry) setToCountry(cantonEntry[0]);
  }, [toZip]);*/

  return (
    <div className="container mt-4">
      <h2>{t('search_transport_or_cargo')}</h2>
      <p>{t('description')}</p>
      <div className="card p-4">
        <h4>{t('search_title')}</h4>
        
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id="searchCargo"
            value="cargo"
            checked={searchType === 'cargo'}
            onChange={() => setSearchType('cargo')}
          />
          <label className="form-check-label" htmlFor="searchCargo">{t('cargo')}</label>
        </div>

        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id="searchTransport"
            value="transport"
            checked={searchType === 'transport'}
            onChange={() => setSearchType('transport')}
          />
          <label className="form-check-label" htmlFor="searchTransport">{t('transport')}</label>
        </div>
        

        <div className="row mb-3">
          <div className="col-md-6">
            <label>{t('loading_canton')}</label>
            <select value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} className="form-select">

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
          <div className="col-md-6">
            <label>{t('unloading_canton')}</label>
            <select value={toCountry} onChange={(e) => setToCountry(e.target.value)} className="form-select">
            
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

       
        
        

        <div className="row mb-3">
          <div className="col-md-6">
            <label>{t('loading_zip_code')}</label>
            <input
              type="text"
              value={fromZip}
              onChange={(e) => setFromZip(e.target.value)}
              className="form-control"
              placeholder="Enter zip code"
            />
          </div>
          <div className="col-md-6">
            <label>{t('unloading_zip_code')}</label>
            <input
              type="text"
              value={toZip}
              onChange={(e) => setToZip(e.target.value)}
              className="form-control"
              placeholder="Enter zip code"
            />
          </div>
        </div>




        <div className="mb-3">
          <label>{t('date')}</label>
          <div className="d-flex gap-2">
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="form-control" />
            <span>{t('to_placeholder')}</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="form-control" />
          </div>
        </div>

        <div className="mb-3">
          <label>{t('weight')}</label>
          <div className="d-flex gap-2">
            <input type="number" placeholder={t('minimum_weight')} value={massFrom} onChange={(e) => setMassFrom(e.target.value)} className="form-control" />
            <span>{t('to_placeholder')}</span>
            <input type="number" placeholder={t('maximum_weight')} value={massTo} onChange={(e) => setMassTo(e.target.value)} className="form-control" />
          </div>
        </div>

        <div className="mb-3">
          <label>{t('volume')}</label>
          <div className="d-flex gap-2">
            <input type="number" placeholder={t('minimum_volume')} value={volumeFrom} onChange={(e) => setVolumeFrom(e.target.value)} className="form-control" />
            <span>{t('to_placeholder')}</span>
            <input type="number" placeholder={t('maximum_volume')} value={volumeTo} onChange={(e) => setVolumeTo(e.target.value)} className="form-control" />
          </div>
        </div>

        <div className="mb-3">
          <label>{t('transport_type')}:</label>
          <select value={transportType} onChange={(e) => setTransportType(e.target.value)} className="form-select">
          
            <option value="0">{t('any_vehicle')}</option>
            <option value="0" disabled="disabled">--------------------</option>
            <option value="11">{t('tent')}</option>
            <option value="21">{t('closed')}</option>
            <option value="4">{t('isothermal')}</option>
            <option value="19">{t('all_metal')}</option>
            <option value="10">{t('refrigerator')}</option>
            <option value="0" disabled="disabled">--------------------</option>
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
            <option value="10">{t('refrigerator')}</option>
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

        <button className="btn btn-primary w-100" onClick={handleSearch}>{t('find')}</button>

      </div>
    </div>
  );
}

export default FindTransCargo;