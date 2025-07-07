const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');

// ✅ Bỏ qua chứng chỉ HTTPS tự ký (khi test localhost)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const API_BASE = 'https://localhost:7153/api';
let token = '';
let createdPlaylistId = null;

// Đăng nhập user
async function loginUser() {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'nguyenvanan@gmail.com',
    password: 'an123456'
  }, { httpsAgent });
  token = res.data.token;
  console.log('🔐 User login OK!');
}

// Tạo Playlist mới
async function createPlaylist() {
  const form = new FormData();
  form.append('title', 'Playlist thử nghiệm');
  form.append('description', 'Mô tả playlist này là để test.');
  form.append('image', fs.createReadStream('./test-playlist.jpg'));

  const res = await axios.post(`${API_BASE}/playlist/add`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders()
    },
    httpsAgent
  });

  createdPlaylistId = res.data.playlist.playlistID;
  console.log('✅ Playlist tạo thành công:', res.data.playlist);
}

// Xem tất cả Playlist
async function getAllPlaylists() {
  const res = await axios.get(`${API_BASE}/playlist`, { httpsAgent });
  console.log(`📋 Tổng playlist: ${res.data.length}`);
}

// Sửa Playlist
async function updatePlaylist() {
  const form = new FormData();
  form.append('title', 'Playlist đã sửa');
  form.append('description', 'Đã cập nhật nội dung');
  form.append('imageFile', fs.createReadStream('./test-playlist2.jpg'));

  const res = await axios.put(`${API_BASE}/playlist/${createdPlaylistId}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders()
    },
    httpsAgent
  });

  console.log('📝 Playlist cập nhật:', res.data);
}

// Lấy Playlist của tôi
async function getMyPlaylists() {
  const res = await axios.get(`${API_BASE}/playlist/my`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('🎧 Playlist của tôi:', res.data.map(p => p.Title));
}

// Xóa Playlist
async function deletePlaylist() {
  const res = await axios.delete(`${API_BASE}/playlist/${createdPlaylistId}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('🗑️ Playlist đã xoá:', res.data);
}

// ============================
// THỰC THI TOÀN BỘ
// ============================
(async () => {
  try {
    await loginUser();
    await createPlaylist();
    await getAllPlaylists();
    await updatePlaylist();
    await getMyPlaylists();
    await deletePlaylist();
  } catch (err) {
    console.error('❌ Lỗi:', err.response?.data || err.message);
  }
})();
