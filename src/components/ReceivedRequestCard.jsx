import React from 'react';
import { useTranslation } from 'react-i18next';
import CargoCard from './CargoCard';
import VehicleCard from './vehicleCard';
import { Link } from 'react-router-dom';
import '../styles/RequestCard.css';


function ReceivedRequestCard({
  request,
  relatedItem,
  onStatusChange,
  setIsEditing,
  setIsDetailsOpen,
  openedDetailsCardId,
  setOpenedDetailsCardId,
}) {
  const { t } = useTranslation();

  // 👉 если нет связанного транспорта или груза — ничего не рендерим
  if (!relatedItem) {
    return null;
  }

  const formatName = (username) => {
    if (!username) return 'N/A';
    return username
      .replace(/\./g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="card request-wrapper p-3 shadow-sm mb-4">
      <div className="mb-4">
        <h5 className="mb-0">
          {t("request_from")}: {formatName(request.sender_username)}
          {request.sender_company && (
            <>
              {' '}|{' '}
              <Link
                to={`/company-profile/${encodeURIComponent(request.sender_company)}`}
                className="text-decoration-none fw-bold"
              >
                {request.sender_company}
              </Link>
            </>
          )}
        </h5>
      </div>

      {request.cargo && (
        <CargoCard
          cargo={{
            ...relatedItem,
            request_id: request.id,
            request
          }}
          bookingView="received"
          onStatusChange={onStatusChange}
          setIsEditing={setIsEditing}
          setIsDetailsOpen={setIsDetailsOpen}
          openedDetailsCardId={openedDetailsCardId}
          setOpenedDetailsCardId={setOpenedDetailsCardId}
        />
      )}

      {request.truck && (
        <VehicleCard
          vehicle={{
            ...relatedItem,
            request_id: request.id,
            request
          }}
          bookingView="received"
          onStatusChange={onStatusChange}
          setIsEditing={setIsEditing}
          setIsDetailsOpen={setIsDetailsOpen}
          openedDetailsCardId={openedDetailsCardId}
          setOpenedDetailsCardId={setOpenedDetailsCardId}
        />
      )}
    </div>
  );
}


export default ReceivedRequestCard;
