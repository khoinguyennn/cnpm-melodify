import { Link, useLocation } from "react-router-dom";
import { HomeIcon, Search, Users, PlaySquare, Heart, User, Moon, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import Toast from "../../common/Toast/Toast";
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [toasts, setToasts] = useState([]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const addToast = (message, type) => {
    const newToast = {
      id: Date.now(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleThemeClick = () => {
    addToast("Tính năng đang phát triển!", "info");
  };

  const handleLogout = () => {
    logout();
    addToast("Đăng xuất thành công!", "success");
  };

  return (
    <>
      <div
        className="position-fixed h-100"
        style={{
          backgroundColor: "#241B3B",
          width: isSidebarOpen ? "250px" : "0",
          transition: "width 0.3s",
          overflowX: "hidden",
          zIndex: 1040,
          height: "calc(100% - 80px)",
        }}
      >
        <div className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <img
              src="/app-asset/img/icon.png"
              alt="Melodify"
              style={{ width: "40px", height: "40px", borderRadius: "8px" }}
            />
            <span className="fs-4 fw-bold text-white">Melodify</span>
          </div>

          <nav className="d-flex flex-column gap-4">
            <div className="d-flex flex-column gap-2">
              <Link 
                to="/" 
                className={`d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg ${
                  isActive('/') ? 'active-link' : ''
                }`}
              >
                <HomeIcon size={20} />
                <span>Home</span>
              </Link>
              <Link 
                to="/search" 
                className={`d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg ${
                  isActive('/search') ? 'active-link' : ''
                }`}
              >
                <Search size={20} />
                <span>Search</span>
              </Link>
            </div>

            <div>
              <p className="text-white small mb-2 ps-2">DISCOVER</p>
              <div className="d-flex flex-column gap-2">
                <Link 
                  to="/artist" 
                  className={`d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg ${
                    isActive('/artist') ? 'active-link' : ''
                  }`}
                >
                  <User size={20} />
                  <span>Artist</span>
                </Link>
                <Link 
                  to="/playlist" 
                  className={`d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg ${
                    isActive('/playlist') ? 'active-link' : ''
                  }`}
                >
                  <PlaySquare size={20} />
                  <span>Playlist</span>
                </Link>
                <Link 
                  to="/favorites" 
                  className={`d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg ${
                    isActive('/favorites') ? 'active-link' : ''
                  }`}
                >
                  <Heart size={20} />
                  <span>Favorites</span>
                </Link>
              </div>
            </div>

            {user?.role === 'Admin' && (
              <div>
                <p className="text-white small mb-2 ps-2">ADMIN</p>
                <div className="d-flex flex-column gap-2">
                  <Link 
                    to="/admin" 
                    className={`d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg ${
                      location.pathname.startsWith('/admin') ? 'active-link' : ''
                    }`}
                  >
                    <Settings size={20} />
                    <span>Admin Panel</span>
                  </Link>
                </div>
              </div>
            )}
          </nav>

          <div className="position-absolute bottom-0 start-0 w-100 p-4">
            <button 
              className="d-flex align-items-center gap-3 p-2 w-100 bg-transparent border-0 text-white rounded hover-bg"
              onClick={handleThemeClick}
            >
              <Moon size={20} />
              <span>Theme</span>
            </button>
            <button 
              className="d-flex align-items-center gap-3 p-2 w-100 bg-transparent border-0 text-white rounded hover-bg"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div 
        className="position-fixed"
        style={{
          top: "20px",
          right: "20px",
          zIndex: 9999
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};

export default Sidebar;
