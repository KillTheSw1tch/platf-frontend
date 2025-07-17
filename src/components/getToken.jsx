// src/utils/getToken.js
export const getToken = () =>
    localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  