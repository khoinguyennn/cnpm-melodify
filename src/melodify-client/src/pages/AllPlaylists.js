import { useState, useEffect } from 'react';
import { PlaySquare } from 'lucide-react';
import { playlistApi } from '../services/playlistApi';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../pages/Home.css';
import { Plus} from "lucide-react";

const AllPlaylists = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Playlists - Melodify";
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const data = await playlistApi.getAllPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };
  const handleCreatePlaylist = () => {
    navigate('/playlist');
  };

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <div className="px-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-bold">Tất cả Playlist</h2>

          <button
            className="btn btn-primary d-flex align-items-center gap-2"
           onClick={handleCreatePlaylist}
          >
            <Plus size={20} />
            Playlist của tôi
          </button>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
          {playlists.map((playlist) => (
            <div key={playlist.playlistID} className="col">
              <div 
                className="position-relative song-card" 
                style={{ maxWidth: "150px", cursor: "pointer" }}
                onClick={() => handlePlaylistClick(playlist.playlistID)}
              >
                <div className="ratio ratio-1x1 rounded overflow-hidden mb-2">
                  <img
                    src={playlist.imageUrl ? `${process.env.REACT_APP_BACKEND_URL}${playlist.imageUrl}` : "/app-asset/img/playlist-default.png"}
                    alt={playlist.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center song-overlay">
                    <button
                      className="btn btn-primary rounded-circle p-2"
                      style={{ backgroundColor: "#8D2FBD", border: "none", transform: "scale(0)" }}
                    >
                      <PlaySquare size={24} />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="fs-6 fw-medium text-truncate mb-1" style={{ fontSize: "0.9rem" }}>
                    {playlist.title}
                  </h3>
                  <p 
                    className="small text-secondary-light text-truncate m-0" 
                    style={{ fontSize: "0.8rem" }}
                  >
                    {playlist.description || "Không có mô tả"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AllPlaylists; 