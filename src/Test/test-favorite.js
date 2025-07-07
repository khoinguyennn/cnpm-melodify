const axios = require('axios');
const https = require('https');

// ⚙️ Bỏ qua chứng chỉ HTTPS tự ký
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const API_BASE = 'https://localhost:7153/api';
let token = '';
const userId = 2;        // ✅ ID người dùng trong DB
const songIdToTest = 6;  // ✅ ID bài hát hợp lệ trong DB

// 1. Đăng nhập user thường
async function loginUser() {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'nguyenvanan@gmail.com',
    password: 'an123456'
  }, { httpsAgent });

  token = res.data.token;
  console.log('🔐 Đăng nhập thành công!');
}

// 2. Thêm bài hát vào danh sách yêu thích
async function addFavorite() {
  const res = await axios.post(`${API_BASE}/favorite/${songIdToTest}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('❤️ Đã thêm vào yêu thích:', res.data);
}

// 3. Kiểm tra bài hát đã được yêu thích chưa
async function checkFavorite() {
  const res = await axios.get(`${API_BASE}/favorite/check/${songIdToTest}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log(`🔍 Bài hát ${songIdToTest} đã được yêu thích?`, res.data);
}

// 4. Lấy danh sách bài hát yêu thích
async function getUserFavorites() {
  const res = await axios.get(`${API_BASE}/favorite/${userId}`, {
    httpsAgent
  });

  console.log(`🎧 Danh sách yêu thích của user ${userId}:`, res.data.map(s => s.Title || s.title));
}

// 5. Xóa bài hát khỏi danh sách yêu thích
async function removeFavorite() {
  const res = await axios.delete(`${API_BASE}/favorite/${songIdToTest}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('🗑️ Đã xoá khỏi yêu thích:', res.data);
}

// ========================
// THỰC THI TOÀN BỘ
// ========================
(async () => {
  try {
    await loginUser();
    await addFavorite();
    await checkFavorite();
    await getUserFavorites();
    await removeFavorite();
  } catch (err) {
    console.error('❌ Lỗi:', err.response?.data || err.message);
  }
})();
