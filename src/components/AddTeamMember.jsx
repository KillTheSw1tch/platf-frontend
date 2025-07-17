import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from './getToken';
import { useTranslation } from 'react-i18next';

const AddTeamMember = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    viber_whatsapp_number: '',
    role: 'worker',
  });

  const [message, setMessage] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const token = getToken();
    const company = JSON.parse(localStorage.getItem("companyData"));

    if (!company || !company.code) {
      setMessage(t("error_no_company_data"));
      return;
    }

    try {
      const payload = {
        ...formData,
        company_code: company.code
      };

      const response = await axios.post('http://127.0.0.1:8000/api/team/add-member/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(t("employee_added_successfully"));
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        viber_whatsapp_number: '',
        role: 'worker',
      });
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("📛 Ошибка с бэка:", error.response.data);
        setMessage(`❌ ${JSON.stringify(error.response.data)}`);
      } else {
        console.error(error);
        setMessage(t("error_adding_employee"));
      }
    }
  };

  return (
    <div>
      <h2>{t("add_employee")}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder={t("full_name")} required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder={t("phone")} required />
        <input
          name="viber_whatsapp_number"
          value={formData.viber_whatsapp_number}
          onChange={handleChange}
          placeholder="Viber / WhatsApp"
        />
        <input name="username" value={formData.username} onChange={handleChange} placeholder={t("username")} required />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder={t("password")} required />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="worker">{t("role_worker")}</option>
          <option value="manager">{t("role_manager")}</option>
        </select>
        <button type="submit">{t("add")}</button>
      </form>
    </div>
  );
};

export default AddTeamMember;

