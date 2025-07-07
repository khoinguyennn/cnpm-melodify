const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const https = require('https');

// 👉 Bỏ qua lỗi SSL self-signed
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const API_BASE = 'https://localhost:7153/api';
let token = '';
let createdSongId = null;
let artistId = 3; // 👉 Nhớ đảm bảo artist này tồn tại

// 🔐 Đăng nhập Admin
async function loginAdmin() {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'tramkhoinguyen27122@gmail.com',
    password: 'nguyendz271'
  }, { httpsAgent });

  token = res.data.token;
  console.log('🔐 Đăng nhập thành công!');
}

// 🆕 Tạo bài hát mới
async function createSong() {
  const form = new FormData();
  form.append('title', 'Bài hát test');
  form.append('artistId', artistId);
  form.append('album', 'Album test');
  form.append('genre', 'Pop');
  form.append('releaseDate', new Date().toISOString());
  form.append('audioFile', fs.createReadStream('./test-audio.mp3'));
  form.append('imageFile', fs.createReadStream('./test-song.jpg'));

  const res = await axios.post(`${API_BASE}/songs/add`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders()
    },
    httpsAgent
  });

  createdSongId = res.data.song.songID;
  console.log('✅ Đã thêm bài hát:', res.data.song);
}

// ✏️ Cập nhật bài hát
async function updateSong() {
  const form = new FormData();
  form.append('title', 'Bài hát đã cập nhật');
  form.append('artistId', artistId);
  form.append('album', 'Album mới');
  form.append('genre', 'Rock');
  form.append('releaseDate', new Date().toISOString());
  form.append('audioFile', fs.createReadStream('./test-audio.mp3'));
  form.append('imageFile', fs.createReadStream('./test-song.jpg'));

  const res = await axios.put(`${API_BASE}/songs/${createdSongId}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders()
    },
    httpsAgent
  });

  console.log('✏️ Đã cập nhật bài hát:', res.data.song);
}

// 📋 Lấy tất cả bài hát
async function getAllSongs() {
  const res = await axios.get(`${API_BASE}/songs`, { httpsAgent });
  console.log(`📋 Có ${res.data.length} bài hát.`);
}

// 🔍 Xem chi tiết bài hát
async function getSongDetails() {
  const res = await axios.get(`${API_BASE}/songs/${createdSongId}`, { httpsAgent });
  console.log('🔍 Chi tiết bài hát:', res.data);
}

// 🔍 Tìm kiếm bài hát
async function searchSongs() {
  const res = await axios.get(`${API_BASE}/songs/search?keyword=đã cập nhật`, { httpsAgent });
  console.log(`🔎 Tìm thấy ${res.data.length} bài hát.`);
}

// ▶️ Phát nhạc
async function playSong() {
  const res = await axios.get(`${API_BASE}/songs/${createdSongId}/play`, { httpsAgent });
  console.log('▶️ URL phát nhạc:', res.data.url);
}

// 🎧 Lấy theo thể loại
async function getByGenre() {
  const res = await axios.get(`${API_BASE}/songs/genre/rock`, { httpsAgent });
  console.log(`🎧 Có ${res.data.length} bài hát thể loại rock.`);
}

// 🗑️ Xóa bài hát
async function deleteSong() {
  const res = await axios.delete(`${API_BASE}/songs/${createdSongId}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent
  });
  console.log('🗑️ Đã xoá bài hát:', res.data);
}

// ===========================
// 🚀 THỰC THI TOÀN BỘ TEST
// ===========================
(async () => {
  try {
    await loginAdmin();
    await createSong();
    await updateSong();
    await getAllSongs();
    await getSongDetails();
    await searchSongs();
    await playSong();
    await getByGenre();
    await deleteSong();
  } catch (err) {
    console.error('❌ Lỗi:', err.response?.data || err.message);
  }
})();
