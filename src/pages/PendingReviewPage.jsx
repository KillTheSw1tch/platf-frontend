import React from 'react';
import '../styles/PendingReview.css';
import { useTranslation } from 'react-i18next';

import hourglassImg from '../assets/png-transparent-hourglass-windows-wait-cursor-hourglass-glass-angle-time-thumbnail.png';


const PendingReviewPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pending-review-container">
        <div className="pending-review-box">
        <h2>{t("pending_review_title")}</h2>
        <p>{t("pending_review_message")}</p>
        <img
            src={hourglassImg}
            alt="Pending"
            className="pending-icon"
        />
        </div>
    </div>
    );
};

export default PendingReviewPage;
