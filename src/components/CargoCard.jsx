  import React, { useEffect } from 'react';
  import { useState } from 'react';
  import { Link } from 'react-router-dom';
  import '../styles/CargoModal.css';
  import { useTranslation } from 'react-i18next';
  import i18n from '../i18n';
  // import '../styles/EditCargoModal.css';
  import axios from 'axios';

  import EditCargoModal from "./EditCargoModal";

  import getDocumentStatus from "../components/utils/getDocumentStatus";

  import ReviewModal from "./ReviewModal";

  

  function CargoCard({ cargo, onDelete, setIsEditing, setIsDetailsOpen, openedDetailsCardId, setOpenedDetailsCardId, bookingView, onStatusChange, onCancel, readOnlyView = false, isSelfView = false }) {
    
    const documentStatus = getDocumentStatus();
    const isBlocked = documentStatus !== "approved";


    const handleBooking = async () => {
      const token = localStorage.getItem("authToken");

      console.log("📦 cargo.id being sent:", cargo?.id);

    


    
      if (!token) {
        alert("⚠️ Вы должны войти в аккаунт, чтобы забронировать груз.");
        return;
      }
    
      try {
        const response = await fetch("http://localhost:8000/api/booking-requests/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            cargo: cargo.id,
            message: "Здравствуйте, я хочу забронировать ваш груз."
          })
        });
    
        const data = await response.json();
        console.log("Ответ сервера:", data);

    
        if (response.ok) {
          alert("✅ Заявка успешно отправлена.");
        } else {
        let message = data?.detail || (Array.isArray(data) && data[0]) || JSON.stringify(data);

        if (/уже отправили заявку|ожидайте/i.test(message)) {
          alert("⏳ Вы уже отправили запрос на этот заказ. Пожалуйста, ожидайте ответа.");
        } else {
          alert(`❌ Ошибка: ${message || "Что-то пошло не так."}`);
        }




        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
        alert("❌ Не удалось отправить заявку.");
      }
    };
    

    const { t } = useTranslation();

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
        const fetchReviews = async () => {
          const token = localStorage.getItem("authToken");

          try {
            const response = await axios.get("http://localhost:8000/api/reviews/", {
              headers: {
                Authorization: `Token ${token}`
              }
            });

            const myUserId = parseInt(localStorage.getItem("userId"));
            const existing = response.data.find(r =>
              r.author === myUserId && r.booking === cargo.request_id
            );


            if (existing) setAlreadyReviewed(true);
          } catch (err) {
            console.error("Ошибка при загрузке отзывов:", err);
          }
        };

        if (bookingView === 'archived') {
          fetchReviews();
        }
      }, [cargo.id, bookingView]);



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

    const [targetUserId, setTargetUserId] = useState(null); // 👈 добавь вверх вместе с useState

    useEffect(() => {

      console.log("🔥 useEffect сработал, cargo.request_id =", cargo?.request_id);


      const fetchBooking = async () => {
        const token = localStorage.getItem("authToken");
        const userId = parseInt(localStorage.getItem("userId"));

        if (!token || !userId) {
      console.warn("⛔ Нет токена или userId");
      return;
    }

    if (!cargo?.request_id) {
      console.warn("⛔ cargo.request_id пока пустой:", cargo?.id, cargo);
      return;
    }


        try {
          const response = await axios.get(`http://localhost:8000/api/booking-requests/${cargo.request_id}/`, {
            headers: {
              Authorization: `Token ${token}`
            }
          });

          if (!response || !response.data) {
            console.warn("❗ Данные бронирования не получены");
            return;
          }

          const booking = response.data;
          const targetId = booking.sender === userId ? booking.receiver : booking.sender;

          if (!targetId) {
            console.warn("❌ targetId не определён");
            return;
          }

          console.log("✅ targetUserId найден:", targetId);
          setTargetUserId(targetId);
        } catch (error) {
          console.error("❌ Ошибка при получении бронирования:", error);
        }
      };

      fetchBooking(); // 🟢 запускаем всегда
    }, [cargo?.request_id]);

    




      

    const showDetails = openedDetailsCardId === cargo.id;

    const orderNumber = cargo?.order_number || 'N/A';

    const [showConfirm, setShowConfirm] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [editConfirm, setEditConfirm] = useState(false);

    const [editFormData, setEditFormData] = useState({ ...cargo });
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

    const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const [alreadyReviewed, setAlreadyReviewed] = useState(false);


    const [confirmMode, setConfirmMode] = useState(null); // 'cancel' | 'delete' | 'complete'

    const [showReviewModal, setShowReviewModal] = useState(false);

    const [alreadyLeftReview, setAlreadyLeftReview] = useState(false);

    


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
      setOpenedDetailsCardId(cargo.id);
      setIsDetailsOpen?.(true);
    
      // 🆕 Сохраняем в LocalStorage
      localStorage.setItem('interestedCargo', JSON.stringify(cargo));
      localStorage.removeItem('interestedVehicle'); // ❗ Чтобы не путать груз и транспорт
    };
    
    
    
    
    const closeDetails = () => {
      setOpenedDetailsCardId(null);
      setIsDetailsOpen?.(false);
    };
    
    

    const transportTypes = {
      "0": t("any_vehicle"),
      "11": t("tent"),
      "21": t("closed"),
      "4": t("isothermal"),
      "19": t("all_metal"),
      "101": t("refrigerator"),
      "1": t("bus"),
      "29": t("passenger_bus"),
      "30": t("luxury_bus"),
      "17": t("car_carrier"),
      "23": t("crane_truck"),
      "39": t("fuel_tanker"),
      "50": t("concrete_mixer"),
      "42": t("bitumen_tanker"),
      "44": t("flour_tanker"),
      "7": t("flatbed"),
      "8": t("open_truck"),
      "41": t("tow_truck"),
      "43": t("excavator"),
      "3": t("grain_truck"),
      "58": t("grain_dump"),
      "54": t("empty_container"),
      "24": t("container_truck"),
      "53": t("feed_truck"),
      "5": t("forest_truck"),
      "57": t("manipulator"),
      "40": t("oil_tanker"),
      "36": t("furniture_truck"),
      "56": t("metal_scrap_truck"),
      "34": t("minibus"),
      "33": t("oversized"),
      "47": t("panel_truck"),
      "9": t("platform"),
      "52": t("poultry_truck"),
      "59": t("roll_carrier"),
      "22": t("dump_truck"),
      "48": t("glass_truck"),
      "38": t("cattle_truck"),
      "37": t("special_vehicle"),
      "31": t("trawl"),
      "35": t("pipe_carrier"),
      "28": t("tractor"),
      "32": t("cement_truck"),
      "49": t("gas_tanker"),
      "51": t("isothermal_tanker"),
      "2": t("food_tanker"),
      "14": t("chemical_tanker"),
      "20": t("plastic_tank"),
      "55": t("chip_truck")
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
        <div className={`card ${cargo.hidden ? 'card-hidden' : ''}`}>
          <div className="card-body">
            
            {cargo.hidden && (
              <div className="cargo-hidden-badge">
                {t("hidden")}
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-2">

  <div className="d-flex align-items-center gap-2">
    {cargo.status && (
      <div className={`status-label ${cargo.status.toLowerCase().replace(" ", "-")}`}>
        {t(cargo.status.toLowerCase()) || cargo.status}
      </div>
    )}

    <h5 className="card-title mb-0">
      {cargo.loading_canton}, {cargo.loading_city_primary} {cargo.loading_postal_primary} → {cargo.unloading_canton}, {cargo.unloading_city_primary} {cargo.unloading_postal_primary}
    </h5>
  </div>

  <div className="d-flex align-items-center gap-2 justify-content-end">
    {localStorage.getItem("authToken") ? (
      <Link
        to={`/company-profile/${encodeURIComponent(cargo.company_name)}`}
        className="d-flex align-items-center gap-2 text-decoration-none text-dark"
        onClick={() => {
          localStorage.setItem('interestedCargo', JSON.stringify(cargo));
          localStorage.setItem('interestedCargoTime', Date.now());
          localStorage.removeItem('interestedVehicle');
          localStorage.removeItem('interestedVehicleTime');
        }}
      >
        {cargo.company_logo_url && (
          <img
            src={cargo.company_logo_url}
            alt="Company Logo"
            className="company-logo-small"
          />
        )}
        <strong>{cargo.company_name}</strong>
      </Link>
    ) : (
      <span
        onClick={() => alert("Пожалуйста, войдите или зарегистрируйтесь.")}
        style={{ cursor: 'pointer', color: '#888' }}
        className="d-flex align-items-center gap-2"
      >
        {cargo.company_logo_url && (
          <img
            src={cargo.company_logo_url}
            alt="Company Logo"
            className="company-logo-small"
          />
        )}
        <strong>{cargo.company_name}</strong>
      </span>
    )}
  </div>

</div>


            
            <div className="card-text cargo-inline-row">
            <span className="cargo-info-block" style={{ fontSize: '0.9rem' }}>
              <strong>{t("date")}</strong> {new Date(cargo.date_from).toLocaleDateString()} - {new Date(cargo.date_to).toLocaleDateString()}
            </span>
              <span className="cargo-info-block"> <strong>{t("cargo")}:</strong> {cargo.cargo_type}</span>
              <span className="cargo-info-block"> <strong>{t("transport")}:</strong> {transportTypes[cargo.transport_type] || t("unknown")}</span>
              <span className="cargo-info-block"> <strong>{t("weight")}:</strong> {cargo.weight} t</span>
              <span className="cargo-info-block"> <strong>{t("volume")}</strong> {cargo.volume ? cargo.volume + ' m³' : 'N/A'}</span>
              <span className="cargo-info-block"> <strong>{t("price")}:</strong> {cargo.price} </span>
              <span className="cargo-info-block"> <strong>ㅤ</strong> <button
                  onClick={() => {
                    if (isBlocked) {
                      alert("Please complete your company profile to access this feature");
                    } else {
                      openDetails();
                    }
                  }}
                  className="btn_view_details"
                >
                  {t("view_details")}
                </button> 
              </span>
                  
            </div>
            
            <div className="cargo-bottom-row">
              

              {bookingView === 'received' && (
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn_accept_custom"
                    onClick={() => {
                      setShowAcceptConfirm(true);
                      setShowRejectConfirm(false);
                    }}
                    disabled={cargo.status === 'Accepted'}
                  >
                    ✅ {t("accept")}
                  </button>

                  <button
                    className="btn_reject_custom"
                    onClick={() => {
                      setShowRejectConfirm(true);
                      setShowAcceptConfirm(false);
                    }}
                    disabled={cargo.status === 'Rejected'}
                  >
                    ❌ {t("reject")}
                  </button>
                </div>
              )}


              {bookingView === 'active' && !readOnlyView ? (
                <div className="card-button-container">
                  {cargo.is_completed !== true && (
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
                onDelete && bookingView !== 'received' && !readOnlyView && (
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
                        .put(`http://127.0.0.1:8000/api/cargo/${cargo.id}/`, {
                          ...cargo,
                          hidden: !cargo.hidden,
                        }, {
                          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
                        })
                        .then(() => window.location.reload())
                        .catch(() => alert("⚠️ Не удалось изменить видимость заказа"));
                    }}>
                      {cargo.hidden ? `${t("show")}` : `${t("hide")}`}
                    </button>
                  </div>
                )
              )}


              {!onDelete && !bookingView && !readOnlyView && cargo.company_name !== localStorage.getItem("userCompanyName") && (
                <button
                  className="btn btn-outline-success mt-2"
                  onClick={() => {
                    if (isBlocked) {
                      alert("Please complete your company profile to access this feature");
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
                        await axios.patch(`http://localhost:8000/api/booking-requests/${cargo.request_id}/`, {
                          status: 'Cancelled'
                        }, {
                          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` }
                        });
                        alert(t("request_cancelled"));
                        onCancel?.(cargo.request_id);
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
                        // 🧠 Удалить заявку, если она есть
                        if (cargo.request_id) {
                          await axios.delete(`http://localhost:8000/api/booking-requests/${cargo.request_id}/`, {
                            headers: { Authorization: `Token ${token}` }
                          });
                        }

                        // 🧠 Удалить сам груз
                        await axios.delete(`http://localhost:8000/api/cargo/${cargo.id}/`, {
                          headers: { Authorization: `Token ${token}` }
                        });

                        alert("🗑️ Груз удалён");
                        onDelete?.(cargo.id);
                      } catch (err) {
                        console.error("Ошибка при удалении груза:", err);
                        alert("❌ Не удалось удалить груз");
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
                      await axios.patch(`http://localhost:8000/api/booking-requests/${cargo.request_id}/`, {
                        status: 'Finished'
                      }, {
                        headers: { Authorization: `Token ${localStorage.getItem("authToken")}` }
                      });
                      alert("✅ Заказ завершён");
                      onStatusChange?.(cargo.request_id, 'Finished');
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

          {showAcceptConfirm && (
                <div className="card-confirm-box card-confirm-complete">
                  <p>{t("confirm_accept_question") || "Вы уверены, что хотите принять заявку?"}</p>
                  <div className="card-confirm-buttons">
                    <button className="btn btn-success" onClick={() => {
                      onStatusChange(cargo.request_id, 'Accepted');
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
                      onStatusChange(cargo.request_id, 'Rejected');
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








              {showDetails && (
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
                            {t("details_of")} {cargo.loading_canton}, {cargo.loading_city_primary} → {cargo.unloading_canton}, {cargo.unloading_city_primary}
                            <span>#{orderNumber}</span>
                          </h5>
                        </td>
                        <td><h5>{t("company")}</h5></td>
                        <td><h5></h5></td>
                      </tr>


                      {/* Ряд 1 */}
                      <tr className="top-row">
                        <td className="details-left">
                          <div><strong>{t("from")}:</strong> {new Date(cargo.date_from).toLocaleDateString()} – {new Date(cargo.date_to).toLocaleDateString()}</div>
                          <div><strong>{t("loading_street")}:</strong> {cargo.cargo_loading_street}, {cargo.loading_postal_primary}</div>
                          <div><strong>{t("unloading_street")}:</strong> {cargo.cargo_unloading_street}, {cargo.unloading_postal_primary}</div>
                          <div><strong>{t("cargo")}:</strong> {cargo.cargo_type}</div>
                          <div><strong>{t("transport")}:</strong> {transportTypes[cargo.transport_type]}</div>
                          <div><strong>{t("weight")}:</strong> {cargo.weight} t</div>
                          <div><strong>{t("volume")}:</strong> {cargo.volume} m³</div>
                        </td>

                        <td className="details-center">
                          {cargo.company_name && localStorage.getItem("authToken") ? (
                            <Link to={`/company-profile/${encodeURIComponent(cargo.company_name)}`} className="company-link"><strong>{cargo.company_name}</strong></Link>
                          ) : (
                            <span className="company-link" onClick={() => alert("Войдите в аккаунт")}><strong>{cargo.company_name}</strong></span>
                          )}
                          <div>{formatName(cargo.contact_name)}</div>
                          <table className="contact-subtable">
                            <tbody>
                              <tr>
                                <td><strong>{t("phone")}:</strong></td>
                                <td>{cargo.phone_number}</td>
                              </tr>
                              <tr>
                                <td><strong>{t("email")}:</strong></td>
                                <td>{cargo.email}</td>
                              </tr>
                              <tr>
                                <td><strong>{t("viber_whatsapp")}:</strong></td>
                                <td>{cargo.viber_whatsapp_number}</td>
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
                            <div className="notes-box">{cargo.extra_info || t("no_extra_info")}</div>
                          </td>

                          <td className="details-center" colSpan={2}>
                            <strong>{t("trip")}</strong>
                            <div><strong>{t("distance")}:</strong> 300 km</div>
                            <div><strong>{t("price")}:</strong> {cargo.price} Fr</div>
                            <button className="btn-view-route">{t("view_route")}</button>
                          </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}




            {showEdit && (
              <EditCargoModal
                cargo={cargo}
                cantons={cantons}
                transportTypesList={transportTypesList}
                onClose={() => {
                  setShowEdit(false);
                  setIsEditing?.(false);
                }}
                onSuccess={() => {
                  setShowEdit(false);
                  setIsEditing?.(false);
                  window.location.reload(); // либо обнови только данные
                }}
              />
            )}

            

            <ReviewModal
              isOpen={showReviewModal}
              onClose={() => setShowReviewModal(false)}
              orderId={cargo.request_id}
              targetUserId={targetUserId}
              cargoId={cargo.id}
              onSubmit={async (reviewData) => {
                try {
                  await axios.post("http://localhost:8000/api/reviews/", reviewData, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
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

  export default CargoCard;
