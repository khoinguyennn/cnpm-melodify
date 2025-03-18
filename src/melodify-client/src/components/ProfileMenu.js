import { forwardRef } from "react"
import { Settings, LogOut } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'

const ProfileMenu = forwardRef(({ user }, ref) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      ref={ref}
      className="position-absolute end-0 mt-2 rounded-3 shadow-lg"
      style={{
        top: "100%",
        zIndex: 1000,
        backgroundColor: "#212529",
        width: "200px",
        border: "1px solid #2a2a2a",
        overflow: "hidden",
      }}
    >
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <div className="d-flex align-items-center gap-3 p-3 border-bottom" style={{ borderColor: "#2a2a2a" }}>
          <img
            src={user?.imageUrl ? `https://localhost:7153${user.imageUrl}` : "/app-asset/img/avatar.webp"}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "40px", height: "40px", border: "2px solid #0d6efd", objectFit: "cover" }}
          />
          <div>
            <p className="fw-medium text-white mb-1">{user?.displayName || 'User'}</p>
            <span
              className="d-inline-block px-2 py-1 text-white rounded-1"
              style={{
                backgroundColor: "#8d2fbd",
                fontSize: "0.7rem",
                fontWeight: "bold",
              }}
            >
              {user?.role?.toUpperCase() || 'USER'}
            </span>
          </div>
        </div>
        <button
          className="d-flex align-items-center gap-3 px-3 py-2 text-white text-decoration-none w-100 bg-transparent border-0"
          role="menuitem"
          style={{ transition: "background-color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2a2a2a")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="d-flex align-items-center gap-3 px-3 py-2 text-white text-decoration-none w-100 bg-transparent border-0"
          role="menuitem"
          style={{ transition: "background-color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2a2a2a")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
})

ProfileMenu.displayName = 'ProfileMenu';

export default ProfileMenu

