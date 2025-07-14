import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import api from '../services/api';
import './AllArtists.css';

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const FollowedArtists = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    document.title = "Nghệ sĩ đã theo dõi - Melodify";
    fetchFollowedArtists();
  }, []);

  const fetchFollowedArtists = async () => {
    try {
      const response = await fetch(`${api.API_BASE_URL}/Follow/following`, {
        headers: api.getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      } else {
        setArtists([]);
      }
    } catch (error) {
      setArtists([]);
      console.error('Error fetching followed artists:', error);
    }
  };

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      currentSong={null}
      isPlaying={false}
      onPlayingStateChange={() => {}}
    >
      <div className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-bold">Nghệ sĩ đã theo dõi</h2>
        </div>

        <div className="row row-cols-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-7 g-4">
          {artists.length === 0 && (
            <div className="col-12 text-center text-secondary">
              Bạn chưa theo dõi nghệ sĩ nào.
            </div>
          )}
          {artists.map((artist) => (
            <div key={artist.artistID} className="col">
              <Link 
                to={`/artist/${artist.artistID}`} 
                className="text-decoration-none"
              >
                <div className="text-center artist-card">
                  <div className="position-relative mx-auto mb-3" style={{ width: "150px", height: "150px" }}>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}${artist.imageUrl}`}
                      alt={artist.name}
                      className="rounded-circle w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <h3 className="fs-6 fw-medium mb-1">{artist.name}</h3>
                  <p className="small text-secondary-light m-0">{truncateText(artist.bio, 50)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default FollowedArtists; 