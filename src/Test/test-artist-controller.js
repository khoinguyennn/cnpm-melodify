const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const https = require('https');

// 👉 Bỏ qua SSL self-signed (nếu dùng HTTPS local)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const API_BASE = 'https://localhost:7153/api';
let token = '';
let createdArtistId = null;

// 🔐 Đăng nhập Admin
async function loginAdmin() {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'tramkhoinguyen27122@gmail.com',
    password: 'nguyendz271' // ✅ Đổi nếu khác
  }, { httpsAgent });

  token = res.data.token;
  console.log('🔐 Đăng nhập thành công!');
}

// 🆕 Tạo nghệ sĩ
async function createArtist() {
  const form = new FormData();
  form.append('name', 'Nghệ sĩ test');
  form.append('bio', 'Tiểu sử của nghệ sĩ test.');
  form.append('imageFile', fs.createReadStream('./test-artist.jpg'));

  const res = await axios.post(`${API_BASE}/artists/add`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders()
    },
    httpsAgent
  });

  createdArtistId = res.data.artist.artistID;
  console.log('✅ Đã tạo nghệ sĩ:', res.data.artist);
}

// ✏️ Cập nhật nghệ sĩ
async function updateArtist() {
  const form = new FormData();
  form.append('name', 'Nghệ sĩ đã cập nhật');
  form.append('bio', 'Tiểu sử mới của nghệ sĩ.');
  form.append('imageFile', fs.createReadStream('./test-artist.jpg')); // Có thể dùng ảnh khác

  const res = await axios.put(`${API_BASE}/artists/${createdArtistId}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders()
    },
    httpsAgent
  });

  console.log('✏️ Đã cập nhật nghệ sĩ:', res.data.artist);
}

// 📋 Lấy tất cả nghệ sĩ
async function getAllArtists() {
  const res = await axios.get(`${API_BASE}/artists`, { httpsAgent });
  console.log(`📋 Có ${res.data.length} nghệ sĩ trong hệ thống.`);
}

// 🔍 Xem chi tiết nghệ sĩ
async function getArtistDetails() {
  const res = await axios.get(`${API_BASE}/artists/${createdArtistId}`, { httpsAgent });
  console.log('🔍 Chi tiết nghệ sĩ:', res.data);
}

// 🎵 Lấy bài hát của nghệ sĩ
async function getSongsByArtist() {
  const res = await axios.get(`${API_BASE}/artists/${createdArtistId}/songs`, { httpsAgent });
  console.log(`🎵 Nghệ sĩ có ${res.data.length} bài hát.`);
}

// 🗑️ Xoá nghệ sĩ
async function deleteArtist() {
  const res = await axios.delete(`${API_BASE}/artists/${createdArtistId}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });
  console.log('🗑️ Đã xoá nghệ sĩ:', res.data);
}

// ======================================
// 🚀 THỰC HIỆN TOÀN BỘ TEST
// ======================================
(async () => {
  try {
    await loginAdmin();
    await createArtist();
    await updateArtist();
    await getAllArtists();
    await getArtistDetails();
    await getSongsByArtist();
    await deleteArtist();
  } catch (err) {
    console.error('❌ Lỗi:', err.response?.data || err.message);
  }
})();
