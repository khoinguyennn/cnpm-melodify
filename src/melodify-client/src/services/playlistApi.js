import api from './api';

export const playlistApi = {
  // Lấy danh sách playlist của người dùng
  getMyPlaylists: async () => {
    const response = await fetch(`${api.API_BASE_URL}/Playlist/my`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Tạo playlist mới với ảnh
  createPlaylist: async (formData) => {
    try {
      const response = await fetch(`${api.API_BASE_URL}/Playlist/add`, {
        method: 'POST',
        headers: {
          ...api.getAuthHeaders(),
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra khi tạo playlist');
      }
      
      return api.handleResponse(response);
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết playlist
  getPlaylistById: async (id) => {
    const response = await fetch(`${api.API_BASE_URL}/Playlist/${id}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Lấy danh sách bài hát trong playlist
  getSongsInPlaylist: async (playlistId) => {
    const response = await fetch(`${api.API_BASE_URL}/PlaylistSong/${playlistId}`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Xóa bài hát khỏi playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    const response = await fetch(`${api.API_BASE_URL}/PlaylistSong/remove?playlistId=${playlistId}&songId=${songId}`, {
      method: 'DELETE',
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Thêm method mới vào playlistApi object
  addSongToPlaylist: async (playlistId, songId) => {
    const response = await fetch(`${api.API_BASE_URL}/PlaylistSong/add?playlistId=${playlistId}&songId=${songId}`, {
      method: 'POST',
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  },

  // Thêm method mới để lấy tất cả playlist
  getAllPlaylists: async () => {
    const response = await fetch(`${api.API_BASE_URL}/Playlist`, {
      headers: api.getAuthHeaders()
    });
    return api.handleResponse(response);
  }
}; 