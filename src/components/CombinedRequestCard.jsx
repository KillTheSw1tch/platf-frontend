import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function CombinedRequestCard({ request, relatedItem, onCancel }) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!relatedItem) return null;

  const isCargo = !!request.cargo;

  return (
    <div className="card p-4 shadow-sm mb-4">
      <div className="mb-2">
        <h5>{t("request_to")}: {request.receiver_username || "N/A"}</h5>
        <p>{request.message}</p>
        <p>{t("status")}: <strong>{request.status}</strong></p>
      </div>

      <div className="mb-2">
        <strong>{isCargo ? t("cargo") : t("transport")}:</strong> {relatedItem.loading_city_primary} → {relatedItem.unloading_city_primary}
      </div>
      <div className="d-flex flex-wrap gap-3 mb-3">
        <span><strong>{t("date")}:</strong> {new Date(relatedItem.date_from).toLocaleDateString()} - {new Date(relatedItem.date_to).toLocaleDateString()}</span>
        <span><strong>{t("weight")}:</strong> {relatedItem.weight} t</span>
        <span><strong>{t("volume")}:</strong> {relatedItem.volume} m³</span>
        <span><strong>{t("price")}:</strong> {relatedItem.price}</span>
      </div>

      <div className="d-flex gap-3 align-items-center">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowDetails(prev => !prev)}>
          {showDetails ? t("hide_details") : t("view_details")}
        </button>

        {!confirmCancel ? (
          <button className="btn btn-outline-danger btn-sm" onClick={() => setConfirmCancel(true)}>
            ❌ {t("cancel_request")}
          </button>
        ) : (
          <div className="alert alert-warning p-2 d-flex gap-2 align-items-center mb-0">
            <span>{t("confirm_cancel_question")}</span>
            <button className="btn btn-sm btn-danger" onClick={() => onCancel(request.id)}>
              {t("yes")}
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => setConfirmCancel(false)}>
              {t("no")}
            </button>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-3 p-3 border rounded bg-light">
          <h6>{t("details")}</h6>
          <p>
            🏠 <strong>{t("loading_street")}:</strong> {relatedItem.cargo_loading_street || 'N/A'}<br />
            🏁 <strong>{t("unloading_street")}:</strong> {relatedItem.cargo_unloading_street || 'N/A'}<br />
            🚚 <strong>{t("transport")}:</strong> {relatedItem.transport_type || 'N/A'}<br />
            📦 <strong>{t("cargo_type")}:</strong> {relatedItem.cargo_type || 'N/A'}<br />
            📝 <strong>{t("extra_information")}:</strong> {relatedItem.extra_info || '—'}
          </p>
        </div>
      )}
    </div>
  );
}

export default CombinedRequestCard;
