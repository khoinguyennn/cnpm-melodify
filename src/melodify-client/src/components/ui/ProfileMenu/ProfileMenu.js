import { forwardRef } from "react"
import { LogOut, Settings, User, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../../contexts/AuthContext'

const ProfileMenu = forwardRef(({ user }, ref) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSettings = () => {
    navigate("/profile") // Điều hướng đến trang profile
  }

  // Function để format role name
  const formatRoleName = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  // Function để lấy màu cho role badge
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '#FF4D4D';
      case 'premium':
        return '#FFD700';
      default:
        return '#4CAF50';
    }
  }

  return (
    <div
      ref={ref}
      className="position-absolute end-0 mt-2 py-2"
      style={{
        backgroundColor: "#241B3B",
        borderRadius: "8px",
        minWidth: "200px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 1000
      }}
    >
      <div className="px-3 py-2 border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          <img
            src={user?.imageUrl ? `${process.env.REACT_APP_BACKEND_URL}${user.imageUrl}` : "/app-asset/img/avatar.webp"}
            alt="Profile"
            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-medium text-white">{user?.displayName || "User"}</span>
              {user?.role && (
                <span
                  style={{
                    backgroundColor: getRoleBadgeColor(user.role),
                    color: user.role.toLowerCase() === 'premium' ? '#000' : '#fff',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Shield size={12} />
                  {formatRoleName(user.role)}
                </span>
              )}
            </div>
            <div className="small text-secondary">{user?.email || ""}</div>
          </div>
        </div>
      </div>

      <div className="py-1">
        <button
          className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-white"
          style={{
            backgroundColor: "transparent",
            border: "none",
            width: "100%",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onClick={handleSettings}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2f284b"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <Settings size={18} />
          Settings
        </button>

        <button
          className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-white"
          style={{
            backgroundColor: "transparent",
            border: "none",
            width: "100%",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onClick={handleLogout}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2f284b"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
})

ProfileMenu.displayName = 'ProfileMenu';

export default ProfileMenu

