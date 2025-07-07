const axios = require('axios');
const https = require('https');

// ⚙️ Bỏ qua chứng chỉ HTTPS tự ký
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const API_BASE = 'https://localhost:7153/api';
let token = '';
const artistIdToTest = 4; // 👉 Cập nhật ID nghệ sĩ hợp lệ trong DB

// 1. Đăng nhập user thường
async function loginUser() {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'nguyenvanan@gmail.com',
    password: 'an123456' // Đảm bảo đúng thông tin đăng nhập
  }, { httpsAgent });

  token = res.data.token;
  console.log('🔐 Đăng nhập thành công!');
}

// 2. Theo dõi nghệ sĩ
async function followArtist() {
  const res = await axios.post(`${API_BASE}/follow/follow/${artistIdToTest}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('✅ Đã theo dõi nghệ sĩ:', res.data);
}

// 3. Xem danh sách nghệ sĩ đã theo dõi
async function getFollowedArtists() {
  const res = await axios.get(`${API_BASE}/follow/following`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('🎧 Danh sách nghệ sĩ đã theo dõi:', res.data.map(a => a.name || a.Name));
}

// 4. Bỏ theo dõi nghệ sĩ
async function unfollowArtist() {
  const res = await axios.delete(`${API_BASE}/follow/unfollow/${artistIdToTest}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('🗑️ Đã bỏ theo dõi nghệ sĩ:', res.data);
}

// ===========================
// THỰC THI TOÀN BỘ
// ===========================
(async () => {
  try {
    await loginUser();
    await followArtist();
    await getFollowedArtists();
    await unfollowArtist();
  } catch (err) {
    console.error('❌ Lỗi:', err.response?.data || err.message);
  }
})();
