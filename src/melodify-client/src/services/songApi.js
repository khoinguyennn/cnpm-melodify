import api from './api';

export const songApi = {
  // Lấy danh sách bài hát
  getAll: async () => {
    const response = await fetch(`${api.API_BASE_URL}/Songs`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/${id}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Thêm bài hát mới
  add: async (formData) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/add`, {
      method: 'POST',
      headers: {
        'Authorization': api.getAuthHeaders().Authorization
      },
      body: formData
    });
    return api.handleResponse(response);
  },

  // Cập nhật bài hát
  update: async (id, formData) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': api.getAuthHeaders().Authorization
      },
      body: formData
    });
    return api.handleResponse(response);
  },

  // Xóa bài hát
  delete: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/${id}`, {
      method: 'DELETE',
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Play bài hát
  play: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/${id}/play`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  search: async (keyword) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Thêm method mới
  getByGenre: async (genre) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/genre/${encodeURIComponent(genre)}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Thêm bài hát vào yêu thích
  favorite: async (songId) => {
    const response = await fetch(`${api.API_BASE_URL}/Favorite/${songId}`, {
      method: 'POST',
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Xóa bài hát khỏi yêu thích
  unfavorite: async (songId) => {
    const response = await fetch(`${api.API_BASE_URL}/Favorite/${songId}`, {
      method: 'DELETE',
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Kiểm tra bài hát đã được yêu thích chưa
  isFavorite: async (songId) => {
    const response = await fetch(`${api.API_BASE_URL}/Favorite/check/${songId}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Thêm vào songApi object
  getFavorites: async (userId) => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const response = await fetch(`${api.API_BASE_URL}/Favorite/${userId}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  }
}; 