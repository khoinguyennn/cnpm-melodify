"use client"
import "./Home.css"
import { useState, useEffect } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar/Sidebar"
import Navbar from "../components/layout/Navbar/Navbar"
import Footer from "../components/layout/Footer/Footer"
import "bootstrap/dist/css/bootstrap.min.css"
import { PlaySquare, ChevronLeft, ChevronRight, RotateCw, Heart, Plus, Play } from "lucide-react"
import { initWow } from "../utils/wowInit"
import { useAuth } from '../contexts/AuthContext'
import PlayingBar from "../components/layout/PlayingBar/PlayingBar"
import { songApi } from '../services/songApi'
import { artistApi } from '../services/artistApi'
import MainLayout from "../components/layout/MainLayout/MainLayout"
import AddToPlaylistModal from '../components/AddToPlaylistModal'
import { playlistApi } from '../services/playlistApi'

const SuggestionItem = ({ song, onPlay, isPlaying }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [song.id, user]);

  const checkFavoriteStatus = async () => {
    try {
      const status = await songApi.isFavorite(song.id);
      setIsFavorite(status);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    
    if (!user) {
      alert('Vui lòng đăng nhập để thêm bài hát vào yêu thích!');
      return;
    }

    try {
      if (isFavorite) {
        await songApi.unfavorite(song.id);
        setIsFavorite(false);
      } else {
        await songApi.favorite(song.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.message || 'Có lỗi xảy ra khi thao tác với bài hát yêu thích!');
    }
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Vui lòng đăng nhập để thêm bài hát vào playlist!');
      return;
    }
    setShowPlaylistModal(true);
  };

  return (
    <>
      <div 
        className="d-flex align-items-center gap-3 p-2 rounded hover-bg mb-2 suggestion-item" 
        onClick={() => onPlay(song)}
      >
        <div className="position-relative">
          <img
            src={song.image || "/placeholder.svg"}
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
          <p className="small text-secondary-light mb-0 text-truncate">{song.artist}</p>
        </div>
        <div className="action-icons">
          <button 
            title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            onClick={handleFavorite}
            className={isFavorite ? "favorite" : ""}
          >
            <Heart 
              size={18} 
              fill={isFavorite ? "currentColor" : "none"}
              className={isFavorite ? "text-danger" : ""}
            />
          </button>
          <button 
            title="Add to playlist"
            onClick={handleAddToPlaylist}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        songId={song.id}
        onAddSuccess={() => {
          alert('Đã thêm bài hát vào playlist thành công!');
        }}
      />
    </>
  );
};

// Helper function để cắt text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const Home = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [newSongs, setNewSongs] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [artists, setArtists] = useState([]);
  const [suggestedSongs, setSuggestedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Trang chủ - Melodify";
    initWow();
    fetchSongs();
    fetchArtists();
    fetchSuggestedSongs();
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSong) {
      setIsAnimating(true);
    }
  }, [currentSong]);

  const fetchSongs = async () => {
    try {
      const data = await songApi.getAll();
      setNewSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };
  const handlePlayRandomSong = async () => {
    if (newSongs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * newSongs.length);
    const randomSong = newSongs[randomIndex];
    await handlePlaySong(randomSong);
  };
  const fetchArtists = async () => {
    try {
      const data = await artistApi.getAll();
      setArtists(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchSuggestedSongs = async () => {
    try {
      const data = await songApi.getAll();
      const shuffledSongs = data.sort(() => Math.random() - 0.5).slice(0, 9);
      setSuggestedSongs(shuffledSongs);
    } catch (error) {
      console.error('Error fetching suggested songs:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const data = await playlistApi.getAllPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
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

  const handlePlayingStateChange = (playing) => {
    setIsPlaying(playing);
  };

  const handleRefreshSuggestions = () => {
    fetchSuggestedSongs();
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  const heroImages = [
    "app-asset/img/banner1.jpg",
    "app-asset/img/banner2.jpg",
    "app-asset/img/banner3.jpg",
  ]

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      currentSong={currentSong}
      isPlaying={isPlaying}
      onPlayingStateChange={handlePlayingStateChange}
    >
      {/* Hero section */}
      <div className="position-relative mb-4 hero-section">
        <div className="position-absolute w-100 h-100">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Featured Music ${index + 1}`}
              className={`w-100 h-100 hero-image carousel-item ${index === currentImageIndex ? "d-block" : "d-none"}`}
              style={{ objectFit: "cover" }}
            />
          ))}
        </div>
        <div className="position-absolute w-100 h-100 hero-gradient-overlay" />
        <div className="position-absolute bottom-0 start-0 p-5 hero-content">
          <h1 className="hero-title mb-3">Kết nối cảm xúc qua âm nhạc</h1>
          <p className="hero-subtitle mb-4">Melodify</p>
          <button className="btn btn-primary hero-cta" onClick={handlePlayRandomSong}>
            <Play size={20} className="me-2" />
            Nghe ngay
          </button>
        </div>
        <button
          className="position-absolute top-50 start-0 translate-middle-y btn btn-dark rounded-circle ms-3 hero-nav-btn"
          onClick={prevImage}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="position-absolute top-50 end-0 translate-middle-y btn btn-dark rounded-circle me-3 hero-nav-btn"
          onClick={nextImage}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Song new section */}
      <div className="px-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-bold">Song new</h2>
          <Link to="/songs" className="text-decoration-none text-secondary-light">
            View all
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
          {newSongs.slice(0, 12).map((song) => (
            <div key={song.songID} className="col">
              <div 
                className="position-relative song-card" 
                style={{ maxWidth: "150px", cursor: "pointer" }}
                onClick={() => handlePlaySong(song)}
              >
                <div className="ratio ratio-1x1 rounded overflow-hidden mb-2">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${song.imageUrl}` || "/placeholder.svg"}
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

      {/* Suggest section */}
      <div className="px-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-bold">Suggest for you</h2>
          <button
            className="btn d-flex align-items-center gap-2 text-secondary-light"
            style={{ backgroundColor: "rgba(141, 47, 189, 0.2)" }}
            onClick={handleRefreshSuggestions}
          >
            <RotateCw size={16} />
            LÀM MỚI
          </button>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-4">
            {suggestedSongs.slice(0, 3).map((song) => (
              <SuggestionItem 
                key={song.songID} 
                song={{
                  id: song.songID,
                  title: song.title,
                  artist: song.artistName,
                  image: `${process.env.REACT_APP_BACKEND_URL}${song.imageUrl}`
                }}
                onPlay={() => handlePlaySong(song)}
                isPlaying={isPlaying && currentSong?.songID === song.songID}
              />
            ))}
          </div>
          <div className="col-12 col-lg-4">
            {suggestedSongs.slice(3, 6).map((song) => (
              <SuggestionItem 
                key={song.songID} 
                song={{
                  id: song.songID,
                  title: song.title,
                  artist: song.artistName,
                  image: `${process.env.REACT_APP_BACKEND_URL}${song.imageUrl}`
                }}
                onPlay={() => handlePlaySong(song)}
                isPlaying={isPlaying && currentSong?.songID === song.songID}
              />
            ))}
          </div>
          <div className="col-12 col-lg-4">
            {suggestedSongs.slice(6, 9).map((song) => (
              <SuggestionItem 
                key={song.songID} 
                song={{
                  id: song.songID,
                  title: song.title,
                  artist: song.artistName,
                  image: `${process.env.REACT_APP_BACKEND_URL}${song.imageUrl}`
                }}
                onPlay={() => handlePlaySong(song)}
                isPlaying={isPlaying && currentSong?.songID === song.songID}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Playlist section */}
      <div className="px-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-bold">Playlist for you</h2>
          <Link to="/playlists" className="text-decoration-none text-secondary-light">
            View all
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
          {playlists.map((playlist) => (
            <div key={playlist.playlistID} className="col">
              <div 
                className="position-relative" 
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

      {/* Artist section */}
      <div className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-bold">Artist</h2>
          <Link to="/artists" className="text-decoration-none text-secondary-light">
            View all
          </Link>
        </div>

        <div className="row row-cols-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-7 g-4">
          {artists.slice(0, 6).map((artist) => (
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
  )
}

export default Home

