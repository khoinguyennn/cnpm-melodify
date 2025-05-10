"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, Search } from "lucide-react"
import ProfileMenu from "../../ui/ProfileMenu/ProfileMenu"
import { useAuth } from '../../../contexts/AuthContext'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const avatarRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear input sau khi search
    }
  };

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

        <form 
          className="d-flex flex-grow-1"
          onSubmit={handleSearch}
        >
          <div className="position-relative flex-grow-1" style={{ maxWidth: "600px" }}>
            <Search
              className="position-absolute"
              style={{ left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }}
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài hát, nghệ sĩ..."
              className="form-control rounded-pill ps-5 search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

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

