
import './i18n'; // ⬅️ импорт конфигурации i18next
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';  // <-- Імпорт стилів Bootstrap
import 'bootstrap'; // 👈 обязательно!



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
