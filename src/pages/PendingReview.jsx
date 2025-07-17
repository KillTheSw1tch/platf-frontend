import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function PendingReview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    fetch("http://127.0.0.1:8000/api/company/check-approval/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.approved) {
          localStorage.removeItem("documentsStatus");
          navigate("/my-company/overview");
        }

        if (data.rejected) {
          alert("❌ Документи відхилено. Зверніться до адміністратора.");
        }
      })
      .catch((err) => {
        console.error("Помилка при перевірці статусу:", err);
      });
  }, [navigate]);

  return (
    <div className="pending-review-page">
      <h2>{t("pending_review_title") || "Очікування підтвердження"}</h2>
      <p>
        {t("pending_review_message") ||
          "Ваші документи на перевірці. Ви отримаєте сповіщення після підтвердження."}
      </p>
    </div>
  );
}

export default PendingReview;
