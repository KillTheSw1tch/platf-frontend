import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CompanyDetails.css';
import CargoCard from '../components/CargoCard';
import VehicleCard from '../components/vehicleCard';
import { useTranslation } from 'react-i18next';

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="star full">★</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" className="star half">★</span>);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
  }

  return stars;
};



function CompanyDetails() {
  const { companyName } = useParams();
  const [companyData, setCompanyData] = useState(null);

  const [rating, setRating] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);


  const [interestedCargo, setInterestedCargo] = useState(null);
  const [interestedVehicle, setInterestedVehicle] = useState(null);
  
  const [openedDetailsCardId, setOpenedDetailsCardId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [fallbackProfile, setFallbackProfile] = useState({});

  const { t } = useTranslation();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("ru-RU");
  };
  

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/company-by-name/${companyName}/`);
        const data = await res.json();
        setCompanyData(data);

        if (data && data.email) {
          const resRating = await fetch(`http://127.0.0.1:8000/api/user-rating-by-email/?email=${data.email}`);
          const ratingData = await resRating.json();
          setRating(ratingData.rating);
          setReviewsCount(ratingData.reviews);
        }

      } catch (error) {
        console.error("Ошибка при загрузке компании:", error);
      }
    };
  
    fetchCompany();
  
    try {
      const cargoStr = localStorage.getItem("interestedCargo");
      const vehicleStr = localStorage.getItem("interestedVehicle");
  
      const cargoTime = Number(localStorage.getItem("interestedCargoTime")) || 0;
      const vehicleTime = Number(localStorage.getItem("interestedVehicleTime")) || 0;
  
      if (cargoStr && !vehicleStr) {
        setInterestedCargo(JSON.parse(cargoStr));
        setInterestedVehicle(null);
      } else if (vehicleStr && !cargoStr) {
        setInterestedVehicle(JSON.parse(vehicleStr));
        setInterestedCargo(null);
      } else if (cargoStr && vehicleStr) {
        if (vehicleTime > cargoTime) {
          setInterestedVehicle(JSON.parse(vehicleStr));
          setInterestedCargo(null);
        } else {
          setInterestedCargo(JSON.parse(cargoStr));
          setInterestedVehicle(null);
        }
      }
    } catch (e) {
      console.warn("Ошибка чтения localStorage:", e);
    }
  }, [companyName]);

  const [fallbackViber, setFallbackViber] = useState("");

  useEffect(() => {
    const profileStr = localStorage.getItem("userProfile");
    if (profileStr) {
      try {
        const parsed = JSON.parse(profileStr);
        if (parsed.profile?.viber_whatsapp_number) {
          setFallbackViber(parsed.profile.viber_whatsapp_number);
        }
        if (parsed.profile) {
          setFallbackProfile(parsed.profile);
        }
      } catch (e) {
        console.warn("Ошибка чтения userProfile из localStorage");
      }
    }
  }, []);
  


  const formatFullName = (rawName) => {
    if (!rawName) return "";
  
    return rawName
      .replace(/\./g, " ")                            // заменяем точки на пробелы
      .split(" ")                                     // разбиваем на слова
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // делаем каждое слово с заглавной
      .join(" ");
  };
  
  
  
  

  if (!companyData) return <p>Loading...</p>;

  return (
    <div className="company-details-container">

      <div className="company-card">
        <div className="top-section">
          <img
              src={companyData.company_photo_url || "/default-avatar.png"}
              alt="avatar"
              className="company-avatar"
            />
          <div className="top-info">
          <h1 className="company-name">
            {companyData.company_name}
            <span className={`verification ${companyData.is_verified ? "verified" : "not-verified"}`}>
              {companyData.is_verified ? t("verified") : t("not_verified")}
            </span>
            <div className="company-rating">
              {rating !== null ? (
                <>
                  <span className="rating-value">
                    {rating.toFixed(1)} {renderStars(rating)}
                  </span>
                  <span className="reviews-count">
                    ({reviewsCount} {t("reviews")})
                  </span>
                </>
              ) : (
                <span className="rating-value">{t("no_reviews")}</span>
              )}
            </div>


          </h1>

            <div className="stats">
              <span>🚚 {t("total_cargo")}: {companyData.total_cargo}</span>
              <span>🚛 {t("total_vehicles")}: {companyData.total_vehicles}</span>
              <span>📦 {t("total_orders")}: {companyData.total_orders}</span>
              <span>📝 {t("active_orders")}: {companyData.active_orders}</span>
            </div>

            <div className="info-cards-grid">
       
              <div className="info-card-row">
                <span className="info-label">🗓️ {t("registration_date")}</span>
                <span className="info-value">{formatDate(companyData.registration_date)}</span>

              </div>
              <div className="info-card-row">
                <span className="info-label">👤 {t("full_name")}</span>
                <span className="info-value">{formatFullName(companyData.full_name)}</span>
              </div>
              <div className="info-card-row">
                <span className="info-label">🎯 {t("activity")}</span>
                <span className="info-value">
                  {companyData.activity === 'transporter'
                    ? t('transporter')
                    : companyData.activity === 'client'
                    ? t('client')
                    : companyData.activity}
                </span>
              </div>

        
              <div className="info-card-row">
                <span className="info-label">📱 {t("phone")}</span>
                <span className="info-value">{companyData.phone}</span>
              </div>
              <div className="info-card-row">
                <span className="info-label">💬 {t("viber_whatsapp")}</span>
                <span  className="info-value">{companyData.viber_whatsapp || fallbackViber || "-"}</span>
              </div>
              <div className="info-card-row">
                <span className="info-label">✉️ {t("email")}</span>
                <span className="info-value">{companyData.email}</span>
              </div>
            </div>
          </div>
          
        </div>

        <div className="bottom-cards-grid">
          <div className="info-card-box">
            <span className="info-label">📍 {t("address")}</span>
            <span className="info-value">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${
                  encodeURIComponent(
                    [
                      companyData.city || fallbackProfile.city,
                      companyData.address || fallbackProfile.address,
                      companyData.canton || fallbackProfile.canton,
                    ]
                      .filter(Boolean)
                      .join(', ')
                  )
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                {[
                  companyData.city || fallbackProfile.city,
                  companyData.address || fallbackProfile.address,
                  companyData.canton || fallbackProfile.canton,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </a>

            </span>
          </div>


          <div className="info-card-box info-card-centered">
            <span className="info-label">{t("added_to_partners")}</span>
            <span className={`info-value ${companyData.partner_count ? "" : "muted"}`}>
              {companyData.partner_count || t("not_enough_data")}
            </span>
          </div>

          <div className="info-card-box info-card-centered">
            <span className="info-label">{t("added_to_blacklist")}</span>
            <span className={`info-value ${companyData.blacklist_count ? "" : "muted"}`}>
              {companyData.blacklist_count || t("not_enough_data")}
            </span>
          </div>
        </div>

        <div className="company-action-buttons">
          <button className="company-action-button button-partners">
            ➕🤝 {t("partners")}
          </button>
          <button className="company-action-button button-blacklist">
            ➕🔧 {t("blacklist")}
          </button>
        </div>
      </div>

      {interestedCargo && (
        <div className="section-block">
          <h2>{t("interested_cargo")}</h2>
          <CargoCard
            cargo={interestedCargo}
            onDelete={null}
            setIsEditing={() => {}}
            setIsDetailsOpen={setIsDetailsOpen}
            openedDetailsCardId={openedDetailsCardId}
            setOpenedDetailsCardId={setOpenedDetailsCardId}
          />
        </div>
      )}

      {interestedVehicle && (
        <div className="section-block">
          <h2>{t("interested_vehicle")}</h2>
          <VehicleCard
            vehicle={interestedVehicle}
            onDelete={null}
            setIsEditing={() => {}}
            setIsDetailsOpen={setIsDetailsOpen}
            openedDetailsCardId={openedDetailsCardId}
            setOpenedDetailsCardId={setOpenedDetailsCardId}
          />
        </div>
      )}

    </div>
  );
}

export default CompanyDetails;
