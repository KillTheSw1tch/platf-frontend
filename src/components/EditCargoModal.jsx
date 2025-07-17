import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/CargoModal.css";

const EditCargoModal = ({ cargo, cantons, transportTypesList, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [editConfirm, setEditConfirm] = useState(false);
  const [formData, setFormData] = useState({ ...cargo });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const cleanedData = { ...formData };
      if (cleanedData.transport_type)
        cleanedData.transport_type = parseInt(cleanedData.transport_type, 10);

      const response = await axios.put(
        `http://127.0.0.1:8000/api/cargo/${cargo.id}/`,
        cleanedData,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert(t("order_updated"));
        onSuccess();
      }
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      alert(t("update_error"));
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <button className="custom-close-btn" onClick={onClose}>&times;</button>
        <h4>{t("edit_order")} #{cargo.id}</h4>

        {!editConfirm ? (
          <form className="modal-form">
            <label>{t("loading_canton")}</label>
            <select name="loading_canton" value={formData.loading_canton} onChange={handleChange}>
              {cantons.map((option) => (
                <option key={option.value} value={option.value}>{t(option.label)}</option>
              ))}
            </select>

            <label>{t("loading_city")}</label>
            <input name="loading_city_primary" value={formData.loading_city_primary} onChange={handleChange} />

            <label>{t("loading_postal_code")}</label>
            <input name="loading_postal_primary" value={formData.loading_postal_primary} onChange={handleChange} />

            <label>{t("unloading_canton")}</label>
            <select name="unloading_canton" value={formData.unloading_canton} onChange={handleChange}>
              {cantons.map((option) => (
                <option key={option.value} value={option.value}>{t(option.label)}</option>
              ))}
            </select>

            <label>{t("unloading_city")}</label>
            <input name="unloading_city_primary" value={formData.unloading_city_primary} onChange={handleChange} />

            <label>{t("unloading_postal_code")}</label>
            <input name="unloading_postal_primary" value={formData.unloading_postal_primary} onChange={handleChange} />

            <label>{t("date_from")}</label>
            <input type="date" name="date_from" value={formData.date_from} onChange={handleChange} />

            <label>{t("date_to")}</label>
            <input type="date" name="date_to" value={formData.date_to} onChange={handleChange} />

            <label>{t("cargo_type")}</label>
            <input name="cargo_type" value={formData.cargo_type} onChange={handleChange} />

            <label>{t("weight_tons")}</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />

            <label>{t("volume_m3")}</label>
            <input type="number" name="volume" value={formData.volume} onChange={handleChange} />

            <label>{t("transport_type")}</label>
            <select name="transport_type" value={formData.transport_type} onChange={handleChange}>
              {transportTypesList.map((option) => (
                <option key={option.value} value={option.value}>{t(option.label)}</option>
              ))}
            </select>

            <label>{t("truck_count")}</label>
            <input type="number" name="truck_count" value={formData.truck_count} onChange={handleChange} />

            <label>{t("price")}</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} />

            <label>{t("extra_information")}</label>
            <textarea name="extra_info" rows="2" value={formData.extra_info} onChange={handleChange}></textarea>

            <button className="btn-save" onClick={(e) => { e.preventDefault(); setEditConfirm(true); }}>{t("save_changes")}</button>
          </form>
        ) : (
          <div className="modal-confirm">
            <p>{t("confirm_edit_question")}</p>
            <button className="btn btn-success me-3" onClick={handleSave}>{t("yes")}</button>
            <button className="btn btn-secondary" onClick={() => setEditConfirm(false)}>{t("no")}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCargoModal;