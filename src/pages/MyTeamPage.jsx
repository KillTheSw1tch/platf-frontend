import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../components/getToken';
import '../styles/MyTeamPage.css';
import { useNavigate } from 'react-router-dom'; 

import { useTranslation } from 'react-i18next';

import CargoCard from '../components/CargoCard';
import VehicleCard from '../components/vehicleCard';



const MyTeamPage = () => {
    const { t } = useTranslation();

    const [members, setMembers] = useState([]);
    const [selectedType, setSelectedType] = useState("cargo");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [orders, setOrders] = useState([]);

    const [role, setRole] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState("all");

    const [openedDetailsCardId, setOpenedDetailsCardId] = useState(null);

    const [yourOwnUserId, setYourOwnUserId] = useState(null);

    useEffect(() => {
        const fetchOwnId = async () => {
            try {
                const token = getToken();
                const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
                headers: { Authorization: `Bearer ${token}` }
                });
                setYourOwnUserId(res.data.id);
                setSelectedUserId(res.data.id);  // 👈 добавляем это
            } catch (error) {
                console.error("Ошибка при получении своего ID:", error);
            }
        };


        fetchOwnId();
    }, []);


    const isSelfView = selectedUserId === yourOwnUserId;

    

    const navigate = useNavigate();


    const fetchTeamMembers = async () => {
        try {
            const token = getToken();

            const roleRes = await axios.get("http://127.0.0.1:8000/api/company/check-approval/", {
            headers: { Authorization: `Bearer ${token}` }
            });

            const userRole = roleRes.data.role;
            setRole(userRole);

            if (!["owner", "manager"].includes(userRole)) {
            navigate("/"); // если не owner/manager — уходим
            return;
            }

            const res = await axios.get("http://127.0.0.1:8000/api/team/members/", {
            headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(res.data);
            console.log("MEMBERS DATA:", res.data);
        } catch (error) {
            console.error("Ошибка при загрузке команды:", error);
            navigate("/"); // в случае ошибки — тоже уходим
        }
    };


    const fetchOrders = async () => {
        if (!selectedUserId) return;
        try {
            const token = getToken();
            let url = '';

            switch (selectedStatus) {
            case 'sent':
                url = `http://127.0.0.1:8000/api/booking-requests/sent/?user_id=${selectedUserId}`;
                break;
            case 'received':
                url = `http://127.0.0.1:8000/api/booking-requests/received/?user_id=${selectedUserId}`;
                break;
            case 'in_progress':
                url = `http://127.0.0.1:8000/api/booking-requests/active/?user_id=${selectedUserId}`;
                break;
            case 'archived':
                url = `http://127.0.0.1:8000/api/booking-requests/archived/?user_id=${selectedUserId}`;
                break;
            default:
                if (selectedType === "cargo") {
                    url = `http://127.0.0.1:8000/api/team/orders/?user_id=${selectedUserId}&type=cargo`;
                } else {
                    url = `http://127.0.0.1:8000/api/team/orders/?user_id=${selectedUserId}&type=truck`;
                }

            }

            const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
            });

            setOrders(res.data);
        } catch (error) {
            console.error("Ошибка при загрузке заказов:", error);
        }
    };


    useEffect(() => {
        fetchTeamMembers();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [selectedUserId, selectedType, selectedStatus]);

    return (
        <div className="my-team-page"> {/* 👈 Обёртка как в поиске */}
            <div className="my-team-container">
                <h2>{t("my_team")}</h2>

                <div className="filter-buttons">
                    <button onClick={() => setSelectedType("cargo")} className={selectedType === "cargo" ? "selected" : ""}>
                    {t("cargo")}
                    </button>
                    <button onClick={() => setSelectedType("truck")} className={selectedType === "truck" ? "selected" : ""}>
                    {t("transport")}
                    </button>

                    <div className="status-filters">
                        <button onClick={() => setSelectedStatus("all")} className={selectedStatus === "all" ? "selected" : ""}>{t("all_orders") || "Все заказы"}</button>
                        <button onClick={() => setSelectedStatus("sent")} className={selectedStatus === "sent" ? "selected" : ""}>{t("sent_requests")}</button>
                        <button onClick={() => setSelectedStatus("received")} className={selectedStatus === "received" ? "selected" : ""}>{t("received_requests")}</button>
                        <button onClick={() => setSelectedStatus("in_progress")} className={selectedStatus === "in_progress" ? "selected" : ""}>{t("in_process")}</button>
                        <button onClick={() => setSelectedStatus("archived")} className={selectedStatus === "archived" ? "selected" : ""}>{t("archived_requests")}</button>
                    </div>
                </div>

                <div className="team-members">
                    {members.map(member => (
                    <button
                        key={member.id}
                        onClick={() => setSelectedUserId(member.id)}
                        className={selectedUserId === member.id ? "selected" : ""}
                    >
                        {member.name}
                    </button>
                    ))}
                </div>

                <div className="orders">
                    {orders.length === 0 ? (
                    <p>{t("no_orders")}</p>
                    ) : (
                    orders.map((order, index) => (
                        <div key={index} className="order-card">
                            {selectedType === "cargo" ? (
                            <CargoCard
                                cargo={{
                                ...(order.cargo_data || order), // 🔥 если есть cargo_data, используем его
                                request_id: order.id,
                                status: order.status
                                }}

                                bookingView={selectedStatus}
                                isSelfView={isSelfView}
                                openedDetailsCardId={openedDetailsCardId}
                                setOpenedDetailsCardId={setOpenedDetailsCardId}
                            />
                            ) : (
                           <VehicleCard
                                vehicle={{
                                    ...(order.truck_data || order),
                                    request_id: order.id,
                                    status: order.status
                                }}
                                bookingView={selectedStatus}
                                isSelfView={isSelfView}
                                openedDetailsCardId={openedDetailsCardId}
                                setOpenedDetailsCardId={setOpenedDetailsCardId}
                            />

                            )}
                        </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTeamPage;
