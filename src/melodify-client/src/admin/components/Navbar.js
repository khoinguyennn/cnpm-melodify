"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, Search } from "lucide-react"
import ProfileMenu from "../../components/ProfileMenu"

const Navbar = ({ toggleSidebar }) => {
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
    <div className="sticky-top bg-dark p-3" style={{ backgroundColor: "#18122B" }}>
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
            className="form-control rounded-pill ps-5"
            style={{ backgroundColor: "#2F284B", border: "none", color: "white" }}
          />
        </div>

        <div className="ms-auto position-relative">
          <img
            ref={avatarRef}
            src="/app-asset/img/avatar.webp"
            alt="Profile"
            style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
            onClick={toggleProfileMenu}
          />
          {isProfileMenuOpen && <ProfileMenu ref={menuRef} />}
        </div>
      </div>
    </div>
  )
}

export default Navbar

