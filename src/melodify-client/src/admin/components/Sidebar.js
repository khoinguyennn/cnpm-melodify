import { Link } from "react-router-dom"
import { HomeIcon, Music, Users, PlaySquare, Mic } from "lucide-react"

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      style={{
        backgroundColor: "#241B3B",
        width: isOpen ? "250px" : "60px",
        transition: "width 0.3s",
        overflowX: "hidden",
      }}
    >
      <div className="p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <img
            src="/app-asset/img/icon.png"
            alt="Melodify"
            style={{ width: "40px", height: "40px", borderRadius: "8px" }}
          />
          {isOpen && <span className="fs-4 fw-bold text-white">Admin</span>}
        </div>

        <nav className="d-flex flex-column gap-2">
          <Link
            to="/admin"
            className="d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg"
          >
            <HomeIcon size={20} />
            {isOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/admin/songs"
            className="d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg"
          >
            <Music size={20} />
            {isOpen && <span>Songs</span>}
          </Link>
          <Link
            to="/admin/playlists"
            className="d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg"
          >
            <PlaySquare size={20} />
            {isOpen && <span>Playlists</span>}
          </Link>
          <Link
            to="/admin/artists"
            className="d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg"
          >
            <Mic size={20} />
            {isOpen && <span>Artists</span>}
          </Link>
          <Link
            to="/admin/users"
            className="d-flex align-items-center gap-3 p-2 text-white text-decoration-none rounded hover-bg"
          >
            <Users size={20} />
            {isOpen && <span>Users</span>}
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar

