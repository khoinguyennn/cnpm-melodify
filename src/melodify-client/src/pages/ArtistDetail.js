import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { artistApi } from "../services/artistApi";
import api from "../services/api";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Navbar from "../components/layout/Navbar/Navbar";
import { Play, UserPlus, Music, BadgeCheck, Check } from "lucide-react";
import PlayingBar from "../components/layout/PlayingBar/PlayingBar";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import './ArtistDetail.css'; 

const SuggestionItem = ({ song, onPlay }) => {
  return (
    <div 
      className="d-flex align-items-center gap-3 p-2 rounded hover-bg mb-2 suggestion-item"
      onClick={() => onPlay(song)}
    >
      <div className="position-relative">
        <img
          src={`https://localhost:7153${song.imageUrl}`}
          alt={song.title}
          className="rounded"
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
        />
        <div className="play-icon-overlay">
          <Play size={24} />
        </div>
      </div>
      <div className="flex-grow-1 min-width-0">
        <div className="d-flex align-items-center gap-2">
          <h3 className="fs-6 fw-medium mb-0 text-truncate">{song.title}</h3>
          {song.isPremium && (
            <span
              className="badge"
              style={{
                backgroundColor: "#FFD700",
                color: "#000",
                fontSize: "0.7rem",
                padding: "2px 6px",
              }}
            >
              PREMIUM
            </span>
          )}
        </div>
        <p className="small text-secondary-light mb-0 text-truncate">{song.artistName}</p>
      </div>
    </div>
  );
};

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchArtistDetails();
    fetchArtistSongs();
    const checkFollowing = async () => {
      try {
        const response = await fetch(
          `${api.API_BASE_URL}/Follow/following`,
          { headers: api.getAuthHeaders() }
        );
        if (response.ok) {
          const followedArtists = await response.json();
          if (followedArtists.some(a => a.artistID === Number(id))) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        }
      } catch (error) {
        setIsFollowing(false);
      }
    };

    if (id) {
      checkFollowing();
    }
  }, [id]);

  const fetchArtistDetails = async () => {
    try {
      const data = await artistApi.getById(id);
      setArtist(data);
      document.title = `${data.name} - Melodify`;
    } catch (error) {
      console.error("Error fetching artist:", error);
    }
  };

  const fetchArtistSongs = async () => {
    try {
      const data = await artistApi.getSongs(id);
      setSongs(data);
    } catch (error) {
      console.error("Error fetching artist songs:", error);
    }
  };

  const handleFollow = async () => {
    if (!artist || !artist.artistID) {
      alert("Không tìm thấy thông tin nghệ sĩ!");
      return;
    }
    try {
      if (isFollowing) {
        await artistApi.unfollow(artist.artistID);
        setIsFollowing(false);
      } else {
        await artistApi.follow(artist.artistID);
        setIsFollowing(true);
      }
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  const handlePlaySong = async (song) => {
    try {
      if (currentSong?.songID === song.songID) {
        setIsPlaying(!isPlaying);
        return;
      }
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  if (!artist) return null;

  console.log("artist", artist);

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      currentSong={currentSong}
      isPlaying={isPlaying}
      onPlayingStateChange={setIsPlaying}
    >
      <div className="artist-container">
        <div className="artist-header">
          <div className="artist-header-content">
            <div className="artist-info">
              <img
                src={`https://localhost:7153${artist?.imageUrl}`}
                alt={artist?.name}
                className="artist-avatar"
              />
              <div className="artist-text">
                <h1 className="artist-name">
                  {artist?.name}
                  <BadgeCheck className="verified-badge" />
                </h1>
                <p className="artist-bio">{artist?.bio}</p>
                <button
                  className={`follow-button ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollow}
                  disabled={!artist || !artist.artistID}
                >
                  {isFollowing ? (
                    <>
                      <Check size={18} style={{ marginRight: 6 }} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} style={{ marginRight: 6 }} />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="songs-section">
          <div className="section-header">
            <h2>
              <Music size={24} />
              Bài hát
            </h2>
          </div>

          <div className="songs-grid">
            {songs.map((song) => (
              <SuggestionItem 
                key={song.songID} 
                song={song} 
                onPlay={handlePlaySong}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ArtistDetail; 