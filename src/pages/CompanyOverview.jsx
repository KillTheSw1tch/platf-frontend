import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/CompanyOverview.css';
import { getToken } from '../components/getToken';

import AddTeamMember from '../components/AddTeamMember';

import TeamMemberList from '../components/TeamMemberList';

import { useNavigate } from 'react-router-dom';



const CompanyOverview = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [companyData, setCompanyData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [role, setRole] = useState(null);

  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState(false);



  const formatFullName = (rawName) => {
    if (!rawName) return '';
    return rawName
      .replace(/[_\.]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
  const fetchCompanyData = async () => {
    try {
      const token = getToken();
      const res = await axios.get('http://127.0.0.1:8000/api/company/check-approval/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const companyInfo = res.data.company_data; // 👈 перенеси ВЫШЕ

      if (companyInfo && companyInfo.is_approved === false) {
        navigate('/my-company/pending-review');
        return;
      }


      setIsOwner(res.data.is_owner || false);
      setIsMember(res.data.is_member || false);
      setRole(res.data.role || null);


      if (!companyInfo) {
        if (res.data.is_member) {
          setError(false);
          return;
        } else {
          setError(true);
          return;
        }
      }


      const isOwner = res.data.is_owner || false; // <-- это должно приходить от бэка
      setIsOwner(isOwner);


      if (!companyInfo) {
        setCompanyData(null);  // сотрудник без регистрации
        return;
      }

      // Загружаем грузы и транспорт
      const [cargoRes, vehicleRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/cargo/', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://127.0.0.1:8000/api/trucks/', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const email = companyInfo.email;

      const cargos = cargoRes.data.filter(c => c.email === email);
      const vehicles = vehicleRes.data.filter(v => v.email === email);

      const updatedStats = {
        ...companyInfo,
        totalOrders: cargos.filter(c => c.is_completed).length + vehicles.filter(v => v.is_completed).length,
        activeOrders: cargos.filter(c => !c.is_completed).length + vehicles.filter(v => !v.vehicle && !v.is_completed).length,
        totalCargo: cargos.length,
        totalVehicles: vehicles.length,
      };

      setCompanyData(updatedStats);
    } catch (error) {
      console.error("Ошибка при получении данных компании:", error);
    }
  };

  fetchCompanyData();
}, []);


  if (error) {
    return <p>{t("you_are_team_member_no_company_access")}</p>;
  }

  if (!companyData && !error) {
    return <p>{t("loading_company_data")}</p>;
  }




  return (
    <div className="company-overview-container">
      <div className="company-overview-card">
        <h2 className="company-title">{t("company_information")}</h2>

        <div className="overview-section">
          <h3>{t("general_info")}</h3>
          <ul>
            <li><strong>{t("company_name")}:</strong> {companyData.name}</li>
            <li><strong>{t("address")}:</strong> {companyData.address}</li>
            <li><strong>{t("registration_date")}:</strong> {companyData.registrationDate}</li>
            <li><strong>{t("verified")}:</strong> {companyData.isVerified ? t("yes") : t("no")}</li>
          </ul>
        </div>

        <div className="overview-section">
          <h3>{t("contact_info")}</h3>
          <ul>
            <li><strong>{t("email")}:</strong> {companyData.email}</li>
            <li><strong>{t("phone_number")}:</strong> {companyData.phone}</li>
            <li><strong>{t("full_name")}:</strong> {formatFullName(companyData.fullName)}</li>

          </ul>
        </div>

        <div className="overview-section">
          <h3>{t("activity_data")}</h3>
          <ul>
            <li><strong>{t("total_orders")}:</strong> {companyData.totalOrders}</li>
            <li><strong>{t("active_orders")}:</strong> {companyData.activeOrders}</li>
            <li><strong>{t("total_cargo")}:</strong> {companyData.totalCargo}</li>
            <li><strong>{t("total_vehicles")}:</strong> {companyData.totalVehicles}</li>
          </ul>
        </div>

        <div className="overview-section">
          <h3>{t("additional")}</h3>
          <ul>
            <li><strong>{t("company_code")}:</strong> {companyData.code}</li>
            <li><strong>{t("country")}:</strong> {t(companyData.country)}</li>
          </ul>

          <div className="tags-container">
            <span className="tag">{t("interest")}: {companyData.interest}</span>
            <span className="tag">{t("activity")}: {companyData.activity}</span>
          </div>
        </div>
        {(role === "owner" || role === "manager") && (
          <>
            <div className="company-overview-card">
              <AddTeamMember />
            </div>
            <div className="company-overview-card">
              <TeamMemberList />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyOverview;
