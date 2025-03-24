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

  play: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/Songs/${id}/play`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  }
}; 