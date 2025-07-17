import React, { useEffect, useState } from 'react';
import '../styles/Home.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import axios from 'axios';
import CargoCard from '../components/CargoCard';
import VehicleCard from '../components/vehicleCard';
import DetailsPanel from '../components/DetailsPanel';
import { getToken } from '../components/getToken';

import getDocumentStatus from '../components/utils/getDocumentStatus';


function HomePage() {
  const { t } = useTranslation();
  const [mainCargos, setMainCargos] = useState([]);
  const [availableCargos, setAvailableCargos] = useState([]);
  const [mainVehicles, setMainVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const documentStatus = getDocumentStatus();
  const isBlocked = documentStatus !== "approved";

  const handleBlockedClick = () => {
    alert("Please complete your company profile to access this feature");
  };

  const [filter, setFilter] = useState("all");

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [openedDetailsCardId, setOpenedDetailsCardId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    axios.get('http://127.0.0.1:8000/api/main-cargo/')
      .then(res => setMainCargos(res.data.filter(c => !c.hidden)));

    axios.get('http://127.0.0.1:8000/api/available-cargo/')
      .then(res => setAvailableCargos(res.data.filter(c => !c.hidden)));

    axios.get('http://127.0.0.1:8000/api/main-truck/')
      .then(res => setMainVehicles(res.data));

    axios.get('http://127.0.0.1:8000/api/available-truck/')
      .then(res => setAvailableVehicles(res.data));

  }, []);

  useEffect(() => {
    setIsDetailsOpen(false);
    setOpenedDetailsCardId(null);
  }, [filter]);

  return (
    <div>
      {/* Верхнее меню */}
      <div className="bg-light border-bottom">
        <div className="container">
          <ul className="nav nav-pills py-2">
            <li className="nav-item me-3">
              {isLoggedIn ? (
                <>
                  <button
                    className="btn btn-primary me-3"
                    onClick={() => {
                      if (isBlocked) {
                        handleBlockedClick();
                      } else {
                        window.location.href = "/add-vehicle";
                      }
                    }}
                  >
                    {t("add_vehicle")}
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (isBlocked) {
                        handleBlockedClick();
                      } else {
                        window.location.href = "/add-cargo";
                      }
                    }}
                  >
                    {t("add_cargo")}
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary me-2" onClick={() => alert("Пожалуйста, войдите или зарегистрируйтесь.")}>
                    {t("add_vehicle")}
                  </button>
                  <button className="btn btn-primary" onClick={() => alert("Пожалуйста, войдите или зарегистрируйтесь.")}>
                    {t("add_cargo")}
                  </button>
                </>
              )}


            </li>
          </ul>
        </div>
      </div>

      {/* Реклама */}
      <div className="container my-4">
        <div className='podcontainer'>
          <h4><strong>🔈 {t("advertisement")}</strong></h4>
          <p>🚛 Потрібен надійний перевізник? Додайте вантаж та отримайте пропозиції вже сьогодні!</p>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="btn btn-warning">👉 Детальніше</a>
        </div>
      </div>

      {/* Кнопки фильтра */}
      <div className="container my-4">
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-outline-secondary" onClick={() => setFilter("cargo")}>{t("available_cargo")}</button>
          {isLoggedIn ? (
            <Link to="/search-cargo" className="btn btn-primary">
              {t("find_trans_cargo")}
            </Link>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => window.alert(t("Пожалуйста, войдите или зарегистрируйтесь") || "Пожалуйста, войдите или зарегистрируйтесь.")}
            >
              {t("find_trans_cargo")}
            </button>
          )}


          <button className="btn btn-outline-secondary" onClick={() => setFilter("vehicle")}>{t("available_vehicle")}</button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container my-5 position-relative">
        <div className="row">
          <div className="col-12">
            <div className="row">

              {/* Правая часть – карточки */}
              <div className="col-12">
                {filter === "cargo" && (
                  <div className="cargo-list">
                    <h4 className="mt-0">{t("available_cargo")}</h4>
                    {availableCargos.length > 0 ? availableCargos.map(cargo => (
                      <CargoCard
                        key={cargo.id}
                        cargo={cargo}
                        setIsDetailsOpen={setIsDetailsOpen}
                        openedDetailsCardId={openedDetailsCardId}
                        setOpenedDetailsCardId={setOpenedDetailsCardId}
                      />
                    )) : (
                      <div className="text-muted">{t("no_cargos_found")}</div>
                    )}
                  </div>
                )}

                {filter === "vehicle" && (
                  <div className="cargo-list">
                    <h4 className="mt-0">{t("available_vehicle")}</h4>
                    {availableVehicles.length > 0 ? availableVehicles.map(vehicle => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        setIsDetailsOpen={setIsDetailsOpen}
                        openedDetailsCardId={openedDetailsCardId}
                        setOpenedDetailsCardId={setOpenedDetailsCardId}
                        setIsEditing={setIsEditing}
                      />
                    )) : (
                      <div className="text-muted">{t("no_vehicles_found")}</div>
                    )}
                  </div>
                )}

                {filter === "all" && (
                  <>
                    <div className="cargo-list">
                      {mainCargos.length > 0 ? mainCargos.map(cargo => (
                        <CargoCard
                          key={cargo.id}
                          cargo={cargo}
                          setIsDetailsOpen={setIsDetailsOpen}
                          openedDetailsCardId={openedDetailsCardId}
                          setOpenedDetailsCardId={setOpenedDetailsCardId}
                        />
                      )) : (
                        <div className="text-muted">{t("no_cargos_found")}</div>
                      )}
                    </div>

                    <div className="cargo-list">
                      {mainVehicles.length > 0 ? mainVehicles.map(vehicle => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          setIsDetailsOpen={setIsDetailsOpen}
                          openedDetailsCardId={openedDetailsCardId}
                          setOpenedDetailsCardId={setOpenedDetailsCardId}
                        />
                      )) : (
                        <div className="text-muted">{t("no_vehicles_found")}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
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

export default HomePage;
