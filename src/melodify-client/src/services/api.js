const API_BASE_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json'
  };
};

const handleResponse = async (response) => {
  const data = await response.text();
  
  try {
    const jsonData = JSON.parse(data);
    if (!response.ok) {
      throw new Error(jsonData.message || 'Có lỗi xảy ra');
    }
    return jsonData;
  } catch (error) {
    if (!response.ok) {
      throw new Error(data || 'Có lỗi xảy ra');
    }
    return { message: data };
  }
};

const api = {
  API_BASE_URL,
  getAuthHeaders,
  handleResponse
};

export default api;