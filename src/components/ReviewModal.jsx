import React, { useState } from 'react';
import '../styles/ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, onSubmit, targetUserId, orderId, cargoId }) => {
  console.log("🔍 ReviewModal открыт", {
    isOpen,
    targetUserId,
    orderId,
    cargoId
  });  


  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null; // ❗ не рендерим, если закрыто

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Выберите оценку от 1 до 5");
      return;
    }

    const reviewData = {
        rating,
        comment,
        booking: orderId,
        cargo: cargoId,
        target_user: targetUserId, // 👈 ВАЖНО! Добавляем
    };


    onSubmit(reviewData);
    onClose(); // закрываем модалку
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Оцените пользователя</h2>

        <div className="stars">
          {[1, 2, 3, 4, 5].map(num => (
            <span
              key={num}
              className={rating >= num ? 'star active' : 'star'}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Комментарий (необязательно)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="submit-button" onClick={handleSubmit}>Готово</button>
      </div>
    </div>
  );
};

export default ReviewModal;
