import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CargoModal.css';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
// import '../styles/EditCargoModal.css';
import axios from 'axios';

import EditVehicleModal from './EditVehicleModal';

import getDocumentStatus from "../components/utils/getDocumentStatus";

import ReviewModal from "./ReviewModal";




function VehicleCard({ vehicle, onDelete, setIsEditing, setIsDetailsOpen, openedDetailsCardId, setOpenedDetailsCardId, bookingView, onStatusChange, onCancel }) {


  const handleBooking = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("⚠️ Вы должны войти в аккаунт, чтобы забронировать транспорт.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/booking-requests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          truck: vehicle.id,
          message: "Здравствуйте, я хочу забронировать ваш транспорт.",
        }),
      });
  
      const data = await response.json();
      console.log("Ответ сервера:", data);

  
      if (response.ok) {
        alert("✅ Заявка успешно отправлена.");
      } else {
        alert(`❌ Ошибка: ${data.detail || "Что-то пошло не так."}`);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      alert("❌ Не удалось отправить заявку.");
    }
  };
  

  const { t } = useTranslation();

  const documentStatus = getDocumentStatus();
  const isBlocked = documentStatus !== "approved";

  const handleBlockedClick = () => {
    alert("Please complete your company profile to access this feature");
  };


  const formatName = (name) => {
    if (!name) return 'N/A';
    return name
      .replace(/\./g, ' ')               // заменить точки на пробелы
      .split(' ')                        // разбить по пробелам
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())  // капитализация
      .join(' ');
  };

    // Устанавливаем сохраненный язык при загрузке
    useEffect(() => {
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      const userId = parseInt(localStorage.getItem("userId"));

      const fetchBooking = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/booking-requests/${vehicle.request_id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          const booking = response.data;
          const targetId = booking.sender === userId ? booking.receiver : booking.sender;
          setTargetUserId(targetId);

          const reviewRes = await axios.get("http://localhost:8000/api/reviews/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          const existingReview = reviewRes.data.find(
            r => r.author === userId && r.booking === vehicle.request_id
          );

          if (existingReview) {
            setAlreadyReviewed(true);
          }
        } catch (err) {
          console.error("Ошибка загрузки отзыва:", err);
        }
      };

      if (bookingView === 'archived') {
        fetchBooking();
      }
    }, [vehicle.request_id, bookingView]);


    const cantons = [
  { value: '', label: 'select_canton' },
  { value: 'ZH', label: 'zurich' },
  { value: 'BE', label: 'bern' },
  { value: 'LU', label: 'lucerne' },
  { value: 'UR', label: 'uri' },
  { value: 'SZ', label: 'schwyz' },
  { value: 'OW', label: 'obwalden' },
  { value: 'NW', label: 'nidwalden' },
  { value: 'GL', label: 'glarus' },
  { value: 'ZG', label: 'zug' },
  { value: 'FR', label: 'fribourg' },
  { value: 'SO', label: 'solothurn' },
  { value: 'BS', label: 'basel_stadt' },
  { value: 'BL', label: 'basel_landschaft' },
  { value: 'SH', label: 'schaffhausen' },
  { value: 'AR', label: 'appenzell_ausserrhoden' },
  { value: 'AI', label: 'appenzell_innerrhoden' },
  { value: 'SG', label: 'st_gallen' },
  { value: 'GR', label: 'grisons' },
  { value: 'AG', label: 'aargau' },
  { value: 'TG', label: 'thurgau' },
  { value: 'TI', label: 'ticino' },
  { value: 'VD', label: 'vaud' },
  { value: 'VS', label: 'valais' },
  { value: 'NE', label: 'neuchatel' },
  { value: 'GE', label: 'geneva' },
  { value: 'JU', label: 'jura' },
];

const transportTypesList = [
  { value: '0', label: 'any_vehicle' },
  { value: '1', label: 'bus' },
  { value: '29', label: 'passenger_bus' },
  { value: '30', label: 'luxury_bus' },
  { value: '17', label: 'car_carrier' },
  { value: '23', label: 'crane_truck' },
  { value: '39', label: 'fuel_tanker' },
  { value: '50', label: 'concrete_mixer' },
  { value: '42', label: 'bitumen_tanker' },
  { value: '44', label: 'flour_tanker' },
  { value: '7', label: 'flatbed' },
  { value: '8', label: 'open_truck' },
  { value: '41', label: 'tow_truck' },
  { value: '43', label: 'excavator' },
  { value: '3', label: 'grain_truck' },
  { value: '58', label: 'grain_dump' },
  { value: '4', label: 'isothermal' },
  { value: '54', label: 'empty_container' },
  { value: '24', label: 'container_truck' },
  { value: '53', label: 'feed_truck' },
  { value: '21', label: 'closed' },
  { value: '5', label: 'forest_truck' },
  { value: '57', label: 'manipulator' },
  { value: '40', label: 'oil_tanker' },
  { value: '36', label: 'furniture_truck' },
  { value: '56', label: 'metal_scrap_truck' },
  { value: '34', label: 'minibus' },
  { value: '33', label: 'oversized' },
  { value: '47', label: 'panel_truck' },
  { value: '9', label: 'platform' },
  { value: '52', label: 'poultry_truck' },
  { value: '101', label: 'refrigerator' },
  { value: '59', label: 'roll_carrier' },
  { value: '22', label: 'dump_truck' },
  { value: '48', label: 'glass_truck' },
  { value: '38', label: 'cattle_truck' },
  { value: '37', label: 'special_vehicle' },
  { value: '11', label: 'tent' },
  { value: '31', label: 'trawl' },
  { value: '35', label: 'pipe_carrier' },
  { value: '28', label: 'tractor' },
  { value: '32', label: 'cement_truck' },
  { value: '49', label: 'gas_tanker' },
  { value: '51', label: 'isothermal_tanker' },
  { value: '2', label: 'food_tanker' },
  { value: '14', label: 'chemical_tanker' },
  { value: '19', label: 'all_metal' },
  { value: '20', label: 'plastic_tank' },
  { value: '55', label: 'chip_truck' },
];

  const showDetails = openedDetailsCardId === vehicle.id; 
  
  const orderNumber = vehicle?.order_number || 'N/A';

  const [showConfirm, setShowConfirm] = useState(false);

  const [alreadyReviewed, setAlreadyReviewed] = useState(false); // уже оценивал?
  const [showReviewModal, setShowReviewModal] = useState(false); // модалка открыта?
  const [targetUserId, setTargetUserId] = useState(null); // кого мы оцениваем


  const [showEdit, setShowEdit] = useState(false);
  const [editConfirm, setEditConfirm] = useState(false);

  const [editFormData, setEditFormData] = useState({ ...vehicle });
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [confirmMode, setConfirmMode] = useState(null); // 'cancel' | 'delete' | 'complete'

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openDetails = () => {
    setShowConfirm(false);
    setShowEdit(false);
    setEditConfirm(false);
    setShowCompleteConfirm(false);
    setIsEditing?.(false);
    setOpenedDetailsCardId(vehicle.id);
    setIsDetailsOpen?.(true);
  
    // 🆕 Сохраняем в LocalStorage
    localStorage.setItem('interestedVehicle', JSON.stringify(vehicle));
    localStorage.removeItem('interestedCargo'); // ❗ Чтобы не путать груз и транспорт
  };
  
  
  
  const closeDetails = () => {
    setOpenedDetailsCardId(null);
    setIsDetailsOpen?.(false);
  };
  
  const transportTypes = {
    "": t("any_vehicle"),
    "not_specified": t("not_specified"),
    "tent": t("tent"),
    "isotherm": t("isothermal"),
    "all_metal": t("all_metal"),
    "refrigerator": t("refrigerator"),
    "cargo_bus": t("passenger_bus"),
    "luxury_bus": t("luxury_bus"),
    "car_carrier": t("car_carrier"),
    "crane_truck": t("crane_truck"),
    "fuel_truck": t("fuel_tanker"),
    "concrete_mixer": t("concrete_mixer"),
    "bitumen_truck": t("bitumen_tanker"),
    "flour_truck": t("flour_tanker"),
    "flatbed": t("flatbed"),
    "open_platform": t("open_truck"),
    "tow_truck": t("tow_truck"),
    "excavator": t("excavator"),
    "grain_truck": t("grain_truck"),
    "grain_dump_truck": t("grain_dump"),
    "empty_container": t("empty_container"),
    "container_carrier": t("container_carrier"),
    "feed_carrier": t("feed_truck"),
    "timber_truck": t("forest_truck"),
    "manipulator": t("manipulator"),
    "oil_truck": t("oil_tanker"),
    "furniture_truck": t("furniture_truck"),
    "metal_scrap_truck": t("metal_scrap_truck"),
    "minibus": t("minibus"),
    "oversized": t("oversized"),
    "panel_carrier": t("panel_truck"),
    "platform": t("platform"),
    "poultry_truck": t("poultry_truck"),
    "roll_carrier": t("roll_carrier"),
    "dump_truck": t("dump_truck"),
    "glass_carrier": t("glass_truck"),
    "cattle_truck": t("cattle_truck"),
    "special_vehicle": t("special_vehicle"),
    "lowboy_trailer": t("trawl"),
    "pipe_carrier": t("pipe_carrier"),
    "tractor": t("tractor"),
    "cement_truck": t("cement_truck"),
    "gas_tanker": t("gas_tanker"),
    "food_tanker": t("food_tanker"),
    "chemical_tanker": t("chemical_tanker"),
    "all_plastic": t("plastic_tank"),
    "wood_chip_truck": t("chip_truck"),
};

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} style={{ color: i <= rating ? '#ffd700' : '#ccc', fontSize: '24px' }}>
                ★
            </span>
        );
    }
    return stars;
};

  

return (
  <div className="col-12 mb-3">
    <div className={`card ${vehicle.hidden ? 'card-hidden' : ''}`}>
      <div className="card-body">
        {vehicle.hidden && (
          <div className="cargo-hidden-badge">
            {t("hidden")}
          </div>
        )}
       <div className="d-flex justify-content-between align-items-center mb-2">
  <div className="d-flex align-items-center gap-2">
    {vehicle.status && (
      <div className={`status-label ${vehicle.status.toLowerCase().replace(" ", "-")}`}>
        {t(vehicle.status.toLowerCase()) || vehicle.status}
      </div>
    )}
    <h5 className="card-title mb-0">
      {vehicle.loading_canton}, {vehicle.loading_city} {vehicle.loading_postal} → {vehicle.unloading_canton}, {vehicle.unloading_city} {vehicle.unloading_postal}
    </h5>
  </div>

  <div className="d-flex align-items-center gap-2 justify-content-end">
    {(vehicle.company_name || vehicle.company_logo_url) && (
      localStorage.getItem("authToken") ? (
        <Link
          to={`/company-profile/${encodeURIComponent(vehicle.company_name)}`}
          onClick={() => {
            localStorage.setItem('interestedVehicle', JSON.stringify(vehicle));
            localStorage.setItem('interestedVehicleTime', Date.now());
            localStorage.removeItem('interestedCargo');
            localStorage.removeItem('interestedCargoTime');
          }}
          className="d-flex align-items-center gap-2 text-decoration-none text-dark"
        >
          {vehicle.company_logo_url && (
            <img
              src={vehicle.company_logo_url}
              alt="Company Logo"
              className="company-logo-small"
            />
          )}
          <strong>{vehicle.company_name}</strong>
        </Link>
      ) : (
        <span
          onClick={() => alert("Пожалуйста, войдите или зарегистрируйтесь.")}
          style={{ cursor: 'pointer', color: '#888' }}
          className="d-flex align-items-center gap-2"
        >
          {vehicle.company_logo_url && (
            <img
              src={vehicle.company_logo_url}
              alt="Company Logo"
              className="company-logo-small"
            />
          )}
          <strong>{vehicle.company_name}</strong>
        </span>
      )
    )}
  </div>
</div>



        <p className="card-text cargo-inline-row">
        <span className="cargo-info-block">
          <strong>{t("date")}</strong> {new Date(vehicle.loading_date_from).toLocaleDateString()} – {new Date(vehicle.loading_date_to).toLocaleDateString()}
        </span>
          <span className="cargo-info-block"><strong>{t("transport")}:</strong> {transportTypes[vehicle.vehicle_type] || t("unknown")}</span>
          <span className="cargo-info-block"><strong>{t("weight")}:</strong> {vehicle.carrying_capacity} t</span>
          <span className="cargo-info-block"><strong>{t("volume")}</strong> {vehicle.useful_volume ? vehicle.useful_volume + ' m³' : 'N/A'}</span>
          <span className="cargo-info-block"> <strong>{t("price")}:</strong> {vehicle.price} </span>
          <span className="cargo-info-block"> <strong>ㅤ</strong> <button
                onClick={() => {
                  if (isBlocked) {
                    handleBlockedClick();
                  } else {
                    openDetails();
                  }
                }}
                className="btn_view_details"
              >
                {t("view_details")}
              </button>
          </span>
        </p>

        <div className="cargo-bottom-row">
            {bookingView === 'received' && (
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn_accept_custom"
                    onClick={() => {
                      setShowAcceptConfirm(true);
                      setShowRejectConfirm(false);
                    }}
                    disabled={vehicle.status === 'Accepted'}
                  >
                    ✅ {t("accept")}
                  </button>

                  <button
                    className="btn_reject_custom"
                    onClick={() => {
                      setShowRejectConfirm(true);
                      setShowAcceptConfirm(false);
                    }}
                    disabled={vehicle.status === 'Rejected'}
                  >
                    ❌ {t("reject")}
                  </button>
                </div>
            )}

            {bookingView === 'active' ? (
                <div className="card-button-container">
                  {vehicle.is_completed !== true && (
                    <button className="btn-card-action-comp" onClick={() => {
                      setShowCompleteConfirm(true);
                      closeDetails();
                    }}>
                      {t("complete_order")}
                    </button>
                  )}
                </div>
              ) : bookingView === 'archived' ? (
                  <div className="card-button-container">
                    {!alreadyReviewed && (
                      <button
                        className="btn-card-action-review"
                        onClick={() => {
                          if (!targetUserId) {
                            alert("⏳ Пожалуйста, подождите — данные ещё загружаются...");
                            return;
                          }
                          setShowReviewModal(true);
                        }}
                      >
                        ⭐ {t("leave_review") || "Оценить"}
                      </button>
                    )}

                    <button className="btn-card-action-delete" onClick={() => {
                      setShowConfirm(true);
                      setConfirmMode("delete");
                      closeDetails();
                    }}>
                      {t("delete_order")}
                    </button>
                  </div>
                ) : (
                onDelete && bookingView !== 'received' && (
                  <div className="card-button-container">
                    <button className="btn-card-action-edit" onClick={() => {
                      setShowEdit(true);
                      closeDetails();
                    }}>
                      {t("edit_order")}
                    </button>

                    <button className="btn-card-action-delete" onClick={() => {
                      setShowConfirm(true);
                      setConfirmMode("delete");
                      closeDetails();
                    }}>
                      {t("delete_order")}
                    </button>

                    <button className="btn-card-action-hide" onClick={() => {
                      axios
                        .put(`http://127.0.0.1:8000/api/trucks/${vehicle.id}/`, {
                          ...vehicle,
                          hidden: !vehicle.hidden,
                        }, {
                          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
                        })
                        .then(() => window.location.reload())
                        .catch(() => alert("⚠️ Не удалось изменить видимость заказа"));
                    }}>
                      {vehicle.hidden ? `${t("show")}` : `${t("hide")}`}
                    </button>
                  </div>
                )
              )}


              {!onDelete && !bookingView && vehicle.company_name !== localStorage.getItem("userCompanyName") && (
                <button
                  className="btn btn-outline-success mt-2"
                  onClick={() => {
                    if (isBlocked) {
                      handleBlockedClick();
                    } else {
                      handleBooking();
                    }
                  }}
                >
                  📩 {t("book_order") || "Забронировать"}
                </button>
              )}



              {bookingView === 'sent' && onCancel && (
                <div className="cancel-request-inline">
                  <button
                    className="btn-card-action-delete"
                    onClick={() => {
                      setShowConfirm(true);
                      setConfirmMode("cancel");
                      setShowEdit(false);
                      setShowCompleteConfirm(false);
                      setEditConfirm(false);
                      setIsEditing?.(false);
                      closeDetails();
                    }}
                  >
                    ❌ {t("cancelled_order")}
                  </button>
                </div>
              )}

          </div>

          {showAcceptConfirm && (
                <div className="card-confirm-box card-confirm-complete">
                  <p>{t("confirm_accept_question") || "Вы уверены, что хотите принять заявку?"}</p>
                  <div className="card-confirm-buttons">
                    <button className="btn btn-success" onClick={() => {
                      onStatusChange(vehicle.request_id, 'Accepted');
                      setShowAcceptConfirm(false);
                    }}>
                      {t("yes")}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowAcceptConfirm(false)}>
                      {t("no")}
                    </button>
                  </div>
                </div>
              )}

              {showRejectConfirm && (
                <div className="card-confirm-box card-confirm-complete">
                  <p>{t("confirm_reject_question") || "Вы уверены, что хотите отклонить заявку?"}</p>
                  <div className="card-confirm-buttons">
                    <button className="btn btn-danger" onClick={() => {
                      onStatusChange(vehicle.request_id, 'Rejected');
                      setShowRejectConfirm(false);
                    }}>
                      {t("yes")}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowRejectConfirm(false)}>
                      {t("no")}
                    </button>
                  </div>
                </div>
              )}




            {/* </div> */}


            {showConfirm && (
            <div className="card-confirm-box">
              <p>
                {confirmMode === 'cancel'
                  ? t("confirm_cancel_question") || "Вы уверены, что хотите отменить заявку?"
                  : t("confirm_delete_question") || "Вы действительно хотите удалить заказ?"}
              </p>
              <div className="card-confirm-buttons">
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    if (confirmMode === 'cancel') {
                      try {
                        await axios.patch(`http://localhost:8000/api/booking-requests/${vehicle.request_id}/`, {
                          status: 'Cancelled'
                        }, {
                          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` }
                        });
                        alert(t("request_cancelled"));
                        onCancel?.(vehicle.request_id);
                      } catch (err) {
                        console.error("Ошибка отмены:", err);
                        alert(t("action_failed"));
                      }
                    } else if (confirmMode === 'delete') {
                      const token = localStorage.getItem("authToken");
                      if (!token) {
                        alert("❌ Токен отсутствует");
                        return;
                      }

                      try {
                        if (bookingView === 'archived') {
                          // ✅ мягкое удаление заявки (локально у пользователя)
                          await axios.post(`http://localhost:8000/api/bookings/${vehicle.request_id}/soft-delete/`, {}, {
                            headers: { Authorization: `Token ${token}` }
                          });
                        } else {
                          // ❗ в остальных режимах — обычное удаление
                          if (vehicle.request_id) {
                            await axios.delete(`http://localhost:8000/api/booking-requests/${vehicle.request_id}/`, {
                              headers: { Authorization: `Token ${token}` }
                            });
                          }

                          await axios.delete(`http://localhost:8000/api/trucks/${vehicle.id}/`, {
                            headers: { Authorization: `Token ${token}` }
                          });
                        }

                        alert("🗑️ Удаление выполнено");
                        onDelete?.(vehicle.id);
                      } catch (err) {
                        console.error("Ошибка при удалении:", err);
                        alert("❌ Не удалось удалить транспорт/заявку");
                      }
                    }

                    setShowConfirm(false);
                    setConfirmMode(null);
                  }}
                >
                  {t("yes") || "Да"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmMode(null);
                  }}
                >
                  {t("no") || "Нет"}
                </button>
              </div>
            </div>
          )}

{showCompleteConfirm && (
            <div className="card-confirm-box card-confirm-complete">
              <p>{t("confirm_complete_question") || "Вы уверены, что хотите завершить заказ?"}</p>
              <div className="card-confirm-buttons">
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    try {
                      await axios.patch(`http://localhost:8000/api/booking-requests/${vehicle.request_id}/`, {
                        status: 'Finished'
                      }, {
                        headers: { Authorization: `Token ${localStorage.getItem("authToken")}` }
                      });
                      alert("✅ Заказ завершён");
                      onStatusChange?.(vehicle.request_id, 'Finished');
                    } catch (err) {
                      console.error("Ошибка завершения заказа:", err);
                      alert("❌ Не удалось завершить заказ");
                    }
                    setShowCompleteConfirm(false);
                  }}
                >
                  {t("yes")}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCompleteConfirm(false)}
                >
                  {t("no")}
                </button>
              </div>
            </div>
          )}



        {showDetails && vehicle && (
          <div className="details-box">
            <button
              onClick={closeDetails}
              className="close-details-btn"
              aria-label="Close"
              title={t("close")}
            >
              &times;
            </button>

            <table className="details-layout-table">
              <tbody>
                {/* Заголовки */}
                <tr>
                  <td>
                    <h5>
                      {t("details_of")} {vehicle.loading_canton}, {vehicle.loading_city} → {vehicle.unloading_canton}, {vehicle.unloading_city}
                      <span>#{orderNumber}</span>
                    </h5>
                  </td>
                  <td><h5>{t("company")}</h5></td>
                  <td><h5></h5></td>
                </tr>

                {/* Ряд 1 */}
                <tr className="top-row">
                  <td className="details-left">
                    <div><strong>{t("from")}:</strong> {new Date(vehicle.loading_date_from).toLocaleDateString()} – {new Date(vehicle.loading_date_to).toLocaleDateString()}</div>
                    <div><strong>{t("loading_street")}:</strong> {vehicle.truck_loading_street || "N/A"}</div>
                    <div><strong>{t("unloading_street")}:</strong> {vehicle.truck_unloading_street || "N/A"}</div>
                    <div><strong>{t("transport")}:</strong> {transportTypes[vehicle.vehicle_type] || t("unknown")}</div>
                    <div><strong>{t("weight")}:</strong> {vehicle.carrying_capacity} t</div>
                    <div><strong>{t("volume")}:</strong> {vehicle.useful_volume ? `${vehicle.useful_volume} m³` : 'N/A'}</div>
                  </td>

                  <td className="details-center">
                    {vehicle.company_name ? (
                      localStorage.getItem("authToken") ? (
                        <Link to={`/company-profile/${encodeURIComponent(vehicle.company_name)}`} className="company-link"><strong>{vehicle.company_name}</strong></Link>
                      ) : (
                        <span className="company-link" onClick={() => alert("Пожалуйста, войдите или зарегистрируйтесь.")}><strong>{vehicle.company_name}</strong></span>
                      )
                    ) : 'N/A'}
                    <div>{formatName(vehicle.contact_name)}</div>
                    <table className="contact-subtable">
                      <tbody>
                        <tr>
                          <td><strong>{t("phone")}:</strong></td>
                          <td>{vehicle.phone || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>{t("email")}:</strong></td>
                          <td>{vehicle.email || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>{t("viber_whatsapp")}:</strong></td>
                          <td>{vehicle.whatsapp || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  <td className="details-actions">
                    <button className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
                      {t("mark_as")}
                    </button>
                    {showDropdown && (
                      <div className="dropdown-menu-box">
                        <button className="dropdown-item">{t("book")}</button>
                        <button className="dropdown-item">{t("save")}</button>
                        <button className="dropdown-item">{t("additional")}</button>
                      </div>
                    )}
                  </td>
                  </tr>

                  {/* Ряд 2 */}
                  <tr>
                    <td className="details-left">
                      <strong>{t("notes")}:</strong>
                      <div className="notes-box">
                        {vehicle.additional_info || t("no_extra_info")}
                      </div>
                    </td>
                    <td className="details-center" colSpan={2}>
                      <strong>{t("trip")}</strong>
                      <div><strong>{t("distance")}:</strong> 300 km</div>
                      <div><strong>{t("price")}:</strong> {vehicle.price} Fr</div>
                      <button className="btn-view-route">{t("view_route")}</button>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {showEdit && (
          <EditVehicleModal
            isOpen={showEdit}
            onClose={() => {
              setShowEdit(false);
              setIsEditing?.(false);
            }}
            formData={editFormData}
            onChange={handleEditChange}
            onSubmit={() => setEditConfirm(true)}
            cantons={cantons}
            transportTypesList={transportTypesList}
            confirmMode={editConfirm}
            setConfirmMode={setEditConfirm}
            handleFinalSubmit={async () => {
              try {
                const response = await axios.put(
                  `http://127.0.0.1:8000/api/trucks/${vehicle.id}/`,
                  editFormData,
                  {
                    headers: {
                      Authorization: `Token ${localStorage.getItem("authToken")}`,
                    },
                  }
                );
                if (response.status === 200 || response.status === 204) {
                  alert(t("order_updated") || "Транспорт успешно обновлён");
                  setShowEdit(false);
                  setEditConfirm(false);
                  window.location.reload(); // обновим данные как в Cargo
                }
              } catch (error) {
                console.error("Ошибка при обновлении:", error);
                alert(t("update_error") || "Не удалось обновить транспорт");
              }
            }}
          />
        )}

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          orderId={vehicle.request_id}
          targetUserId={targetUserId}
          truckId={vehicle.id}
          onSubmit={async (reviewData) => {
            try {
              await axios.post("http://localhost:8000/api/reviews/", reviewData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              });

              alert("✅ Отзыв отправлен");
              setAlreadyReviewed(true);
              setShowReviewModal(false);
            } catch (err) {
              console.error("Ошибка при отправке отзыва:", err);
              alert("❌ Не удалось отправить отзыв");
            }
          }}
        />



        </div>
      </div>
    </div>
  );
}

export default VehicleCard;
