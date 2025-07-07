const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const https = require('https');

// 👇 Bỏ qua chứng chỉ HTTPS tự ký khi test cục bộ
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const API_BASE = 'https://localhost:7153/api';
let token = '';
let createdUserId = null;

// 🔐 Đăng nhập admin
async function loginAdmin() {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'tramkhoinguyen27122@gmail.com',
    password: 'nguyendz271' // ⚠️ Cập nhật mật khẩu thực tế
  }, { httpsAgent });

  token = res.data.token;
  console.log('🔐 Đăng nhập thành công!');
}

// 🧪 Tạo người dùng mới (Admin)
async function createUser() {
  const form = new FormData();
  form.append('displayName', 'Người dùng test');
  form.append('email', `user_${Date.now()}@example.com`);
  form.append('password', 'test123');
  form.append('role', 'User');
  form.append('ImageFile', fs.createReadStream('./test-avatar.jpg'));

  const res = await axios.post(`${API_BASE}/user/register`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders()
    },
    httpsAgent
  });

  createdUserId = res.data.userID;
  console.log('✅ Đã tạo người dùng:', res.data);
}

// 📄 Xem danh sách người dùng
async function getAllUsers() {
  const res = await axios.get(`${API_BASE}/user`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });
  console.log('📋 Tổng số người dùng:', res.data.length);
}

// 📝 Cập nhật thông tin user
async function updateUser() {
  const res = await axios.put(`${API_BASE}/user/${createdUserId}`, {
    displayName: 'Tên cập nhật',
    email: 'updateemail1@gmail.com',
    imageUrl: '/data/users/test.jpg',
    role: 'User'
  }, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });

  console.log('✅ Cập nhật thành công:', res.data);
}


// ❌ Xoá người dùng test
async function deleteUser() {
  const res = await axios.delete(`${API_BASE}/user/${createdUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });
  console.log('🗑️ Đã xoá người dùng test:', res.data);
}

// ==========================
// 🔁 CHẠY CÁC BƯỚC TEST
// ==========================
(async () => {
  try {
    await loginAdmin();
    await createUser();
    await getAllUsers();
    await updateUser();
    await deleteUser();
  } catch (err) {
    console.error('❌ Lỗi:', err.response?.data || err.message);
  }
})();
