"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, Search } from "lucide-react"
import ProfileMenu from "../../ui/ProfileMenu/ProfileMenu"
import { useAuth } from '../../../contexts/AuthContext'
import './Navbar.css'

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const avatarRef = useRef(null)

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`navbar-container ${isSidebarOpen ? 'with-sidebar' : ''}`}>
      <div className="d-flex align-items-center gap-3">
        <button onClick={toggleSidebar} className="btn btn-link text-white p-1">
          <Menu size={24} />
        </button>

        <div className="position-relative flex-grow-1" style={{ maxWidth: "600px" }}>
          <Search
            className="position-absolute"
            style={{ left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }}
            size={20}
          />
          <input
            type="text"
            placeholder="Search"
            className="form-control rounded-pill ps-5 search-input"
          />
        </div>

        <div className="ms-auto position-relative">
          <img
            ref={avatarRef}
            src={user?.imageUrl ? `https://localhost:7153${user.imageUrl}` : "/app-asset/img/avatar.webp"}
            alt="Profile"
            style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", objectFit: "cover" }}
            onClick={toggleProfileMenu}
          />
          {isProfileMenuOpen && <ProfileMenu ref={menuRef} user={user} />}
        </div>
      </div>
    </div>
  )
}

export default Navbar

