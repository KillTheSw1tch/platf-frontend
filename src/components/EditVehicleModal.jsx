import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/CargoModal.css'; // или EditVehicleModal.css — ты уже подключил

function EditVehicleModal({
  isOpen,
  onClose,
  formData,
  onChange,
  cantons,
  transportTypesList,
  confirmMode,
  setConfirmMode,
  handleFinalSubmit
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <button className="custom-close-btn" onClick={onClose}>×</button>

        {!confirmMode ? (
          <>
            <h2>{t("edit_order")}</h2>
            <form className="modal-form">
              <label>{t('loading_canton')}</label>
              <select name="loading_canton" value={formData.loading_canton} onChange={onChange}>
                {cantons.map((option) => (
                  <option key={option.value} value={option.value}>{t(option.label)}</option>
                ))}
              </select>

              <label>{t('loading_city')}</label>
              <input name="loading_city" value={formData.loading_city} onChange={onChange} />

              <label>{t('loading_postal_code')}</label>
              <input name="loading_postal" value={formData.loading_postal} onChange={onChange} />

              <label>{t('unloading_canton')}</label>
              <select name="unloading_canton" value={formData.unloading_canton} onChange={onChange}>
                {cantons.map((option) => (
                  <option key={option.value} value={option.value}>{t(option.label)}</option>
                ))}
              </select>

              <label>{t('unloading_city')}</label>
              <input name="unloading_city" value={formData.unloading_city} onChange={onChange} />

              <label>{t('unloading_postal_code')}</label>
              <input name="unloading_postal" value={formData.unloading_postal} onChange={onChange} />

              <label>{t('date_from')}</label>
              <input type="date" name="loading_date_from" value={formData.loading_date_from} onChange={onChange} />

              <label>{t('date_to')}</label>
              <input type="date" name="loading_date_to" value={formData.loading_date_to} onChange={onChange} />

              <label>{t('weight_tons')}</label>
              <input name="carrying_capacity" value={formData.carrying_capacity} onChange={onChange} />

              <label>{t('volume_m3')}</label>
              <input name="useful_volume" value={formData.useful_volume} onChange={onChange} />

              <label>{t('transport_type')}</label>
              <select name="vehicle_type" value={formData.vehicle_type} onChange={onChange}>
                {transportTypesList.map((option) => (
                  <option key={option.value} value={option.value}>{t(option.label)}</option>
                ))}
              </select>

              <label>{t('truck_count')}</label>
              <input type="number" name="number_of_vehicles" value={formData.number_of_vehicles} onChange={onChange} />

              <label>{t('price')}</label>
              <input name="price" value={formData.price} onChange={onChange} />

              <label>{t('extra_information')}</label>
              <textarea rows="2" name="additional_info" value={formData.additional_info} onChange={onChange} />

              <button type="button" className="btn-save" onClick={() => setConfirmMode(true)}>
                ✅ {t("save_changes")}
              </button>
            </form>
          </>
        ) : (
          <div className="edit-center">
            <p className="edit-confirm-text">{t("confirm_edit_question")}</p>
            <button className="btn btn-success me-3" onClick={handleFinalSubmit}>{t("yes")}</button>
            <button className="btn btn-secondary" onClick={() => setConfirmMode(false)}>{t("no")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditVehicleModal;
