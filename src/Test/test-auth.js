const axios = require('axios');
const https = require('https');

// Tạo agent bỏ qua SSL
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const testUser = {
  displayName: 'Nguyễn Văn Test',
  email: `test_${Date.now()}@example.com`,
  password: 'password123'
};

async function testAuthFlow() {
  try {
    console.log('🔄 Đang test đăng ký...');
    const registerRes = await axios.post(
      'https://localhost:7153/api/auth/register',
      testUser,
      { httpsAgent } // thêm dòng này để bỏ qua SSL warning
    );
    console.log('✅ Đăng ký thành công:', registerRes.data);

    console.log('\n🔄 Đang test đăng nhập...');
    const loginRes = await axios.post(
      'https://localhost:7153/api/auth/login',
      { email: testUser.email, password: testUser.password },
      { httpsAgent }
    );
    console.log('✅ Đăng nhập thành công!');
    console.log('📊 Token:', loginRes.data.token);

  } catch (err) {
    console.error('❌ Lỗi:', err.response ? err.response.data : err.message);
  }
}

testAuthFlow();
