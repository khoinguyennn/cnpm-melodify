"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../../components/layout/Navbar/Navbar"
import Overview from "../components/Overview"
import SongManagement from "../components/SongManagement"
import ArtistManagement from "../components/ArtistManagement"
import UserManagement from "../components/UserManagement"
import PlaylistManagement from "../components/PlaylistManagement"
import "../styles/AdminDashboard.css"

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="admin-dashboard">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content-area">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="songs" element={<SongManagement />} />
            <Route path="artists" element={<ArtistManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="playlists" element={<PlaylistManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

