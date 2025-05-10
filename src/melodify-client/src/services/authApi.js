import api from './api';

export const authApi = {
  login: async (email, password) => {
    const response = await fetch(`${api.API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi đăng nhập!');
    }
    return data;
  },

  register: async (displayName, email, password) => {
    const response = await fetch(`${api.API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi đăng ký!');
    }
    return data;
  },

  getUserInfo: async (userId, token) => {
    const response = await fetch(`${api.API_BASE_URL}/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin người dùng');
    }
    return response.json();
  }
}; 