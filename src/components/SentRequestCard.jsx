import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CargoCard from './CargoCard';
import VehicleCard from './vehicleCard';
import '../styles/RequestCard.css';



function SentRequestCard({ request, relatedItem, onCancel, setIsEditing, setIsDetailsOpen, openedDetailsCardId, setOpenedDetailsCardId }) {
  const { t } = useTranslation();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const token = localStorage.getItem("authToken");

  const formatName = (username) => {
    if (!username) return '';
    return username
      .replace(/\./g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const companyName = relatedItem?.company_name;

  return (
    <div className="card request-wrapper p-3 shadow-sm mb-4">
      <div className="mb-4">
        <h5 className="mb-0">
          {t("request_to")}:{' '}
          {formatName(request.receiver_username)}
          {companyName && (
            <>
              {' '}|{' '}
              <Link
                to={`/company-profile/${encodeURIComponent(companyName)}`}
                className="text-decoration-none text-muted"
              >
                {companyName}
              </Link>
            </>
          )}
        </h5>
      </div>

      {relatedItem ? (
  request.cargo ? (
    <CargoCard
      cargo={{
        ...relatedItem,
        request_id: request.id
      }}
      bookingView="sent"
      setIsEditing={setIsEditing}
      setIsDetailsOpen={setIsDetailsOpen}
      onCancel={onCancel}
      openedDetailsCardId={openedDetailsCardId}
      setOpenedDetailsCardId={setOpenedDetailsCardId}
    />
  ) : (
    <VehicleCard
      vehicle={{
        ...relatedItem,
        request_id: request.id
      }}
      bookingView="sent"
      onCancel={onCancel}
      setIsEditing={setIsEditing}
      setIsDetailsOpen={setIsDetailsOpen}
      openedDetailsCardId={openedDetailsCardId}
      setOpenedDetailsCardId={setOpenedDetailsCardId}
    />
  )
) : (
  <div className="alert alert-warning">
    ⚠ Связанный элемент не найден для заявки #{request.id}
  </div>
)}


    </div>
  );
}

export default SentRequestCard;
