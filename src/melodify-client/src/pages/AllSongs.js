import { useState, useEffect } from 'react';
import { Play, PlaySquare } from 'lucide-react';
import { songApi } from '../services/songApi';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import '../pages/Home.css';

const AllSongs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.title = "Bài hát - Melodify";
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const data = await songApi.getAll();
      setSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handlePlaySong = async (song) => {
    try {
      if (currentSong?.songID === song.songID) {
        setIsPlaying(!isPlaying);
        return;
      }

      await songApi.play(song.songID);
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      currentSong={currentSong}
      isPlaying={isPlaying}
      onPlayingStateChange={setIsPlaying}
    >
      <div className="px-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-bold">Bài hát mới</h2>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
          {songs.map((song) => (
            <div key={song.songID} className="col">
              <div 
                className="position-relative song-card" 
                style={{ maxWidth: "150px", cursor: "pointer" }}
                onClick={() => handlePlaySong(song)}
              >
                <div className="ratio ratio-1x1 rounded overflow-hidden mb-2">
                  <img
                    src={`https://localhost:7153${song.imageUrl}` || "/placeholder.svg"}
                    alt={song.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center song-overlay"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)", opacity: currentSong?.songID === song.songID ? 1 : 0 }}
                  >
                    {currentSong?.songID === song.songID ? (
                      <div className={`playing-animation ${isPlaying ? 'active' : 'paused'}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary rounded-circle p-2"
                        style={{ backgroundColor: "#8D2FBD", border: "none", transform: "scale(0)" }}
                      >
                        <PlaySquare size={24} />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="fs-6 fw-medium text-truncate mb-1" style={{ fontSize: "0.9rem" }}>
                    {song.title}
                  </h3>
                  <p 
                    className="small text-secondary-light text-truncate m-0" 
                    style={{ 
                      fontSize: "0.8rem",
                      color: currentSong?.songID === song.songID ? "#8D2FBD" : undefined 
                    }}
                  >
                    {song.artistName}
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

export default AllSongs; 