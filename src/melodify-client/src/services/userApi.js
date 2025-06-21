import api from './api';

export const userApi = {
  // Lấy danh sách users
  getAll: async () => {
    const response = await fetch(`${api.API_BASE_URL}/User`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Lấy thông tin user theo ID
  getById: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/User/${id}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Cập nhật thông tin user
  update: async (id, formData) => {
    try {
      const response = await fetch(`${api.API_BASE_URL}/User/change/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': api.getAuthHeaders().Authorization
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin user với file
  updateWithFile: async (id, formData) => {
    const response = await api.put(`/User/change/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Xóa user
  delete: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/User/${id}`, {
      method: 'DELETE',
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Đăng ký user mới
  register: async (formData) => {
    const response = await fetch(`${api.API_BASE_URL}/User/register`, {
      method: 'POST',
      headers: {
        'Authorization': api.getAuthHeaders().Authorization
      },
      body: formData
    });
    return api.handleResponse(response);
  },

  // Thêm method đổi mật khẩu
  changePassword: async (id, passwordData) => {
    try {
      const response = await fetch(`${api.API_BASE_URL}/User/change-password/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': api.getAuthHeaders().Authorization,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      return api.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }
}; 