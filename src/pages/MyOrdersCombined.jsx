import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CargoCard from '../components/CargoCard';
import VehicleCard from '../components/vehicleCard';
import DetailsPanel from '../components/DetailsPanel';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import '../styles/Myorder.css';
import { getToken } from '../components/getToken';
import ReceivedRequestCard from '../components/ReceivedRequestCard';
import SentRequestCard from '../components/SentRequestCard';
import InProcessCard from '../components/InProcessCard';
import ArchivedCard from '../components/ArchivedCard';




function MyOrdersCombined() {
  const { t } = useTranslation();

  const [cargos, setCargos] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [viewMode, setViewMode] = useState('cargo');
  const [isEditing, setIsEditing] = useState(false);

  const [openedDetailsCardId, setOpenedDetailsCardId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [bookingView, setBookingView] = useState('');

  const [bookingRequests, setBookingRequests] = useState([]);

  const [orderNumberSearch, setOrderNumberSearch] = useState('');

  const [userId, setUserId] = useState(null);

  const [filteredItems, setFilteredItems] = useState([]);

  const [confirmMode, setConfirmMode] = useState(null);

  const [companyData, setCompanyData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);


  const navigate = useNavigate();

  const handleBookingStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/booking-requests/${id}/`, {
        status: newStatus
      }, {
        headers: { Authorization: `Token ${getToken()}` }
      });

      alert("✅ Статус заявки обновлен");

      // Если заявка принята → переместим в active
      if (newStatus === "Accepted") {
        setBookingView('active');
      }

      // Если пользователь на вкладке "sent", удалим заявку, если статус → Accepted или Rejected
      if (bookingView === 'sent' && (newStatus === "Accepted" || newStatus === "Rejected")) {
        setBookingRequests(prev => prev.filter(req => req.id !== id));
      }

    } catch (err) {
      alert("❌ Не удалось обновить заявку");
      console.error(err);
    }
  };



  const getFilteredRequestsByViewMode = () => {
    return bookingRequests.filter(req => {
      if (viewMode === 'cargo') return !!req.cargo;
      if (viewMode === 'vehicle') return !!req.truck;
      return true;
    });
  };
  
 
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    const token = getToken();
    console.log("🧪 TOKEN:", token);
    if (!token) {
      alert("❌ Токен отсутствует, пользователь будет перенаправлен");
      navigate('/login');
    }
    const email = localStorage.getItem('userEmail');
    if (!token || !email) {
      alert("Пожалуйста, войдите в систему.");
      navigate('/login');
      return;
    }

    if (bookingView === 'sent') {
      // ✅ Загружаем все грузы (чтобы отобразить грузовые заявки)
      axios.get('http://127.0.0.1:8000/api/cargo/', {
        headers: { Authorization: `Token ${token}` }
      }).then(res => {
        setCargos(res.data);
      }).catch(err => console.error("❌ Ошибка при получении грузов:", err));
    
      // ✅ Загружаем все ТРАНСПОРТЫ (чтобы отобразить транспортные заявки)
      axios.get('http://127.0.0.1:8000/api/trucks/', {
        headers: { Authorization: `Token ${token}` }
      }).then(res => {
        setVehicles(res.data);
      }).catch(err => console.error("❌ Ошибка при получении транспорта:", err));
    } else {
      // 🧩 Только СВОИ грузы и транспорт (для других вкладок)
      axios.get('http://127.0.0.1:8000/api/cargo/', {
        headers: { Authorization: `Token ${token}` }
      }).then(res => {
        const userCargos = res.data.filter(c => c.email === email);
        setCargos(userCargos);
      }).catch(err => console.error("Ошибка при получении СВОИХ грузов:", err));
    
      axios.get('http://127.0.0.1:8000/api/trucks/', {
        headers: { Authorization: `Token ${token}` }
      }).then(res => {
        const userVehicles = res.data.filter(v => v.email === email);
        setVehicles(userVehicles);
      }).catch(err => console.error("Ошибка при получении СВОИХ машин:", err));
    }
    

    axios.get('http://127.0.0.1:8000/api/user/profile/', {
      
      
      
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      setUserId(res.data.id);
    }).catch(err => console.error("Ошибка при получении пользователя:", err));
    

    if (bookingView) {
      fetchBookings(bookingView); // ✅ передаём явно
    }
    
    
  }, [bookingView]);

  
  

  const filteredCargos = useMemo(() => {
    if (!bookingView || bookingRequests.length === 0) return cargos;
    return cargos.filter(cargo =>
      bookingRequests.some(req => req.cargo === cargo.id)
    );
  }, [bookingRequests, cargos, bookingView]);
  
  const filteredVehicles = useMemo(() => {
    if (!bookingView || bookingRequests.length === 0) {
      console.log("🔄 Возвращаю все машины (нет активного фильтра или заявок)");
      return vehicles;
    }
  
    const result = vehicles.filter(vehicle => {
      const matched = bookingRequests.some(req => {
        console.log(`🔍 Сравнение: vehicle.id=${vehicle.id} vs req.truck=${req.truck}`);
        return Number(req.truck) === Number(vehicle.id);
      });
      return matched;
    });
  
    console.log("✅ Отфильтрованные машины:", result);
    return result;
  }, [bookingRequests, vehicles, bookingView]);
  
  
  const handleApplyFilter = () => {
    if (!bookingView) {
      const filtered = (viewMode === 'cargo' ? cargos : vehicles).filter(item => {
        const orderMatches = orderNumberSearch === '' || item.order_number === orderNumberSearch;


        return orderMatches;
      });

      setFilteredItems(filtered);
      return;
    }

  
    let activeRequests = bookingRequests;
  
    if (bookingView === 'active') {
      activeRequests = bookingRequests.filter(req => req.status?.toLowerCase() === 'accepted');
    } else if (bookingView === 'archived') {
      activeRequests = bookingRequests.filter(req => req.status?.toLowerCase() === 'finished');
    }

  
    const filtered = (viewMode === 'cargo' ? cargos : vehicles).filter(item => {
      const hasRequest = activeRequests.some(req => {
        return viewMode === 'cargo'
          ? req.cargo === item.id
          : req.truck === item.id;
      });

      const orderMatches = orderNumberSearch === '' || item.order_number === orderNumberSearch;

      return hasRequest && orderMatches;
    });

  
    setFilteredItems(filtered);
  };
  

  const fetchBookings = async (view) => {
    try {
      const token = getToken();
      if (!token) {
        alert("❌ Токен отсутствует, пользователь будет перенаправлен");
        navigate('/login');
        return;
      }
  
      const res = await axios.get(`http://127.0.0.1:8000/api/booking-requests/${view}/`, {
        headers: { Authorization: `Token ${token}` }
      });
  
      setBookingRequests(res.data); // ❗ просто сохраняем, не фильтруем вручную
      console.log("📦 Booking data for:", view, res.data);
  
    } catch (error) {
      console.error("Ошибка при получении заявок:", error);
    }
  };
  
  
  

  useEffect(() => {
    handleApplyFilter();
    console.log('📊 Обновляем фильтр')
  }, [bookingRequests, cargos, vehicles, viewMode, bookingView]);
  
  
  
  
  

  return (
    <div className="container my-5">
      <h2 className="mb-4">{t("my_orders")}</h2>

      <div className="order-controls">
        <div className="order-buttons">
          <button
            className={`order-toggle-btn ${viewMode === 'cargo' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('cargo');
              setIsDetailsOpen(false);
              setIsEditing(false);
            }}
          >
            {t("cargo")}
          </button>
          <button
            className={`order-toggle-btn ${viewMode === 'vehicle' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('vehicle');
              setIsDetailsOpen(false);
              setIsEditing(false);
            }}
          >
            {t("transportation")}
          </button>
        </div>

        <div className="order-search-box">
          <label className="order-search-label">{t("search_by_order_number")}</label>
          <div className="order-search-row">
            <input
              type="text"
              className="order-search-input"
              placeholder="C/V..."
              value={orderNumberSearch}
              onChange={(e) => setOrderNumberSearch(e.target.value)}
            />
            
            {orderNumberSearch && (
              <span
                className="order-clear-btn"
                onClick={() => {
                  setOrderNumberSearch('');

                  // Сброс фильтра вручную — показать все элементы
                  if (!bookingView) {
                    setFilteredItems(viewMode === 'cargo' ? cargos : vehicles);
                  } else {
                    let activeRequests = bookingRequests;

                    if (bookingView === 'active') {
                      activeRequests = bookingRequests.filter(req => req.status?.toLowerCase() === 'accepted');
                    } else if (bookingView === 'archived') {
                      activeRequests = bookingRequests.filter(req => req.status?.toLowerCase() === 'finished');
                    }

                    const fullList = (viewMode === 'cargo' ? cargos : vehicles).filter(item => {
                      return activeRequests.some(req => (
                        viewMode === 'cargo'
                          ? req.cargo === item.id
                          : req.truck === item.id
                      ));
                    });

                    setFilteredItems(fullList);
                  }
                }}
              >
                ×
              </span>
            )}

            <button
              className="order-search-btn"
              onClick={handleApplyFilter}
            >
              {t("apply")}
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 FLEX layout like HomePage */}
      <div className="mb-4">
        <h4>{t("booking_requests")}</h4>
        <div className="d-flex gap-2 flex-wrap">
          <button
            className={`btn ${bookingView === 'sent' ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setBookingView(prev => prev === 'sent' ? '' : 'sent')}
          >
            {t("sent_requests")}
          </button>

          <button
            className={`btn ${bookingView === 'received' ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setBookingView(prev => prev === 'received' ? '' : 'received')}
          >
            {t("received_requests")}
          </button>

          <button
            className={`btn ${bookingView === 'active' ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setBookingView(prev => prev === 'active' ? '' : 'active')}
          >
            {t("In process")}
          </button>

          <button
            className={`btn ${bookingView === 'archived' ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setBookingView(prev => prev === 'archived' ? '' : 'archived')}
          >
            {t("archived_requests")}
          </button>

        </div>

        <div className="mt-3">
          {bookingView === 'received' && (
            <div className="d-flex flex-column gap-4">
              {getFilteredRequestsByViewMode()
                .filter(req => req.status !== 'Accepted')
                .map(req => {
                  const relatedItem = req.cargo_data || req.truck_data;


                  return (
                    <ReceivedRequestCard
                      key={req.id}
                      request={req}
                      relatedItem={relatedItem}
                      onStatusChange={handleBookingStatusChange}
                      setIsEditing={setIsEditing}
                      setIsDetailsOpen={setIsDetailsOpen}
                      openedDetailsCardId={openedDetailsCardId}
                      setOpenedDetailsCardId={setOpenedDetailsCardId}
                    />
                  );
                })}
            </div>
          )}



          {bookingView === 'sent' && (
            <div className="d-flex flex-column gap-4">
              {getFilteredRequestsByViewMode()
                .filter(req => !["Accepted", "Rejected", "Cancelled", "Finished"].includes(req.status))
                .map(req => {
                  const relatedItem = req.cargo_data || req.truck_data;


                  return (
                    <React.Fragment key={req.id}>
                      <SentRequestCard
                        request={req}
                        relatedItem={relatedItem}
                        onCancel={(id) => {
                          setBookingRequests(prev => prev.filter(r => r.id !== id));
                        }}
                        setIsEditing={setIsEditing}
                        setIsDetailsOpen={setIsDetailsOpen}
                        openedDetailsCardId={openedDetailsCardId}
                        setOpenedDetailsCardId={setOpenedDetailsCardId}
                      />
                    </React.Fragment>
                  );
                })}
            </div>
          )}

          {bookingView === 'active' && (
            <div className="d-flex flex-column gap-4">
              {getFilteredRequestsByViewMode()
                .filter(req => req.status?.toLowerCase() === 'accepted')
                .map(req => {
                  const relatedItem = req.cargo_data || req.truck_data;

                  return (
                    <InProcessCard
                      key={req.id}
                      request={req}
                      relatedItem={relatedItem}
                      onStatusChange={handleBookingStatusChange}
                      setIsEditing={setIsEditing}
                      setIsDetailsOpen={setIsDetailsOpen}
                      openedDetailsCardId={openedDetailsCardId}
                      setOpenedDetailsCardId={setOpenedDetailsCardId}
                    />
                  );
                })}
            </div>
          )}


          {bookingView === 'archived' && (
            <div className="d-flex flex-column gap-4">
              {getFilteredRequestsByViewMode()
                .filter(req => req.status?.toLowerCase() === 'finished')
                .map(req => {

                const relatedItem = req.cargo_data || req.truck_data;


                return (
                  <ArchivedCard
                    key={req.id}
                    request={req}
                    relatedItem={relatedItem}
                    onStatusChange={handleBookingStatusChange}
                    setIsEditing={setIsEditing}
                    setIsDetailsOpen={setIsDetailsOpen}
                    openedDetailsCardId={openedDetailsCardId}
                    setOpenedDetailsCardId={setOpenedDetailsCardId}
                    onDelete={(id) => {
                      const token = getToken();
                      if (!token) {
                        alert("❌ Токен отсутствует");
                        return;
                      }

                      axios.post(`http://127.0.0.1:8000/api/bookings/${id}/soft-delete/`, {}, {
                        headers: { Authorization: `Token ${token}` },
                      }).then(() => {
                        // удаляем заявку только из состояния (а не из базы!)
                        setBookingRequests(prev => prev.filter(r => r.id !== id));
                        alert("✅ Заказ удалён из архива");
                      }).catch(err => {
                        alert("❌ Не удалось удалить заказ");
                        console.error(err);
                      });
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div> {/* <-- Закрывает mt-3 */}

        <div className="cards-wrapper">
          {!['received', 'sent', 'active', 'archived'].includes(bookingView) && (
            <div className="cards-wrapper">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  viewMode === 'cargo' ? (
                    <CargoCard
                      key={item.id}
                      cargo={{
                        ...item,
                        request_id: bookingRequests.find(req => req.cargo === item.id)?.id
                      }}
                      onStatusChange={handleBookingStatusChange}
                      onDelete={(id) => {
                        const token = getToken();
                        if (!token) {
                          alert("❌ Токен отсутствует, пользователь будет перенаправлен");
                          navigate('/login');
                        }
                        axios.delete(`http://127.0.0.1:8000/api/cargo/${id}/`, {
                          headers: { Authorization: `Token ${token}` }
                        }).then(() => {
                          setCargos(prev => prev.filter(c => c.id !== id));
                        }).catch(err => {
                          console.error("Ошибка при удалении груза:", err);
                          alert("⚠️ Не удалось удалить заказ");
                        });
                      }}
                      setIsEditing={setIsEditing}
                      setIsDetailsOpen={setIsDetailsOpen}
                      openedDetailsCardId={openedDetailsCardId}
                      setOpenedDetailsCardId={setOpenedDetailsCardId}
                      bookingView={bookingView}
                    />
                  ) : (
                    <VehicleCard
                      key={item.id}
                      vehicle={{
                        ...item,
                        request_id: bookingRequests.find(req => req.truck === item.id)?.id, // 💡 Добавляем ID заявки внутрь
                      }}
                      onDelete={(requestId) => {
                        console.log("📦 onDelete вызван с requestId:", requestId);
                        const token = getToken();
                        if (!token) {
                          alert("❌ Токен отсутствует, пользователь будет перенаправлен");
                          navigate('/login');
                          return;
                        }

                        axios.delete(`http://127.0.0.1:8000/api/booking-requests/${requestId}/`, {
                          headers: { Authorization: `Token ${token}` }
                        }).then(() => {
                          // Удалим заявку и сам транспорт из списка, если нужно
                          setBookingRequests(prev => prev.filter(req => req.id !== requestId));
                          setVehicles(prev =>
                            prev.filter(v => {
                              const req = bookingRequests.find(r => r.truck === v.id);
                              return req?.id !== requestId;
                            })
                          );
                        }).catch(err => {
                          console.error("Ошибка при удалении заявки:", err);
                          alert("❌ Не удалось удалить заявку");
                        });
                      }}
                      setIsEditing={setIsEditing}
                      setIsDetailsOpen={setIsDetailsOpen}
                      openedDetailsCardId={openedDetailsCardId}
                      setOpenedDetailsCardId={setOpenedDetailsCardId}
                      bookingView={bookingView}
                    />

                  )
                ))
              ) : (
                <p className="text-muted">
                  {viewMode === 'cargo' ? t("no_cargo_yet") : t("no_vehicles_yet")}
                </p>
              )}
            </div>
          )}
    </div> {/* <-- Закрывает cards-wrapper */}

  </div> 
  );
}

export default MyOrdersCombined;
