import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra token khi khởi động
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      // Gọi API để lấy thông tin user
      fetchUserData(payload.unique_name); // unique_name chứa userID
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7153/api/User/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);