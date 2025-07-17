import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function OrderSearchBox({ onResult }) {
  const { t } = useTranslation();
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    if (!number) {
      setError(t("enter_order_number"));
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`http://127.0.0.1:8000/api/find-order/?number=${number}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || t("search_error"));
      onResult(null);
    }
  };

  return (
    <div style={{ marginBottom: '20px', background: '#f9f9f9', padding: '10px', borderRadius: '6px' }}>
      <label>🔍 {t("search_by_order_number")}:</label>
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder={t("order_number_example")}
          style={{ flex: 1, padding: '8px' }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          {t("find")}
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
    </div>
  );
}

export default OrderSearchBox;
