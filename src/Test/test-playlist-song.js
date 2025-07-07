const axios = require('axios');
const https = require('https');

// ⚙️ Bỏ qua chứng chỉ HTTPS tự ký
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const API_BASE = 'https://localhost:7153/api';

let token = '';
const playlistId = 4; // ✅ ID playlist hợp lệ (nên là playlist của người dùng đang test)
const songId = 19;     // ✅ ID bài hát hợp lệ có trong DB

// 1. Đăng nhập
async function loginUser() {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'nguyenvanan@gmail.com',
    password: 'an123456'
  }, { httpsAgent });

  token = res.data.token;
  console.log('🔐 Đăng nhập thành công!');
}

// 2. Thêm bài hát vào Playlist
async function addSongToPlaylist() {
  const res = await axios.post(`${API_BASE}/playlistsong/add?playlistId=${playlistId}&songId=${songId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('🎵 Thêm bài hát vào Playlist:', res.data);
}

// 3. Lấy danh sách bài hát trong Playlist
async function getSongsInPlaylist() {
  const res = await axios.get(`${API_BASE}/playlistsong/${playlistId}`, {
    httpsAgent
  });

  console.log(`📋 Danh sách bài hát trong Playlist ${playlistId}:`, res.data.map(s => s.title));
}

// 4. Xóa bài hát khỏi Playlist
async function removeSongFromPlaylist() {
  const res = await axios.delete(`${API_BASE}/playlistsong/remove?playlistId=${playlistId}&songId=${songId}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('🗑️ Đã xóa bài hát khỏi Playlist:', res.data);
}

// ==========================
// THỰC THI TOÀN BỘ
// ==========================
(async () => {
  try {
    await loginUser();
    await addSongToPlaylist();
    await getSongsInPlaylist();
    await removeSongFromPlaylist();
  } catch (err) {
    console.error('❌ Lỗi:', err.response?.data || err.message);
  }
})();
