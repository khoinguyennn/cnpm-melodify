import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { artistApi } from '../services/artistApi';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import './AllArtists.css';

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const AllArtists = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    document.title = "Nghệ sĩ - Melodify";
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const data = await artistApi.getAll();
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
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
          <h2 className="fs-4 fw-bold">Artist</h2>
        </div>

        <div className="row row-cols-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-7 g-4">
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

export default AllArtists; 