import api from './api';

export const artistApi = {
  // Lấy danh sách nghệ sĩ
  getAll: async () => {
    const response = await fetch(`${api.API_BASE_URL}/Artists`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/Artists/${id}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Thêm nghệ sĩ mới
  add: async (formData) => {
    const response = await fetch(`${api.API_BASE_URL}/Artists/add`, {
      method: 'POST',
      headers: {
        'Authorization': api.getAuthHeaders().Authorization
      },
      body: formData
    });
    return api.handleResponse(response);
  },

  // Cập nhật nghệ sĩ
  update: async (id, formData) => {
    const response = await fetch(`${api.API_BASE_URL}/Artists/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': api.getAuthHeaders().Authorization
      },
      body: formData
    });
    return api.handleResponse(response);
  },

  // Xóa nghệ sĩ
  delete: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/Artists/${id}`, {
      method: 'DELETE',
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Lấy bài hát của nghệ sĩ
  getSongs: async (id) => {
    const response = await api.get(`/Artists/${id}/songs`);
    return response.data;
  }
}; 