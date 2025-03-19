"use client"
import "./Home.css"
import { useState, useEffect } from "react"
import { Link, Navigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "bootstrap/dist/css/bootstrap.min.css"
import { PlaySquare, ChevronLeft, ChevronRight, RotateCw, Heart, Plus, Play } from "lucide-react"
import { initWow } from "../utils/wowInit"
import { useAuth } from '../contexts/AuthContext'
import PlayingBar from "../components/PlayingBar"

const SuggestionItem = ({ song }) => {
  return (
    <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg mb-2 suggestion-item">
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
        <button title="Add to favorites">
          <Heart size={18} />
        </button>
        <button title="Add to playlist">
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}

const Home = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [newSongs, setNewSongs] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.title = "Trang chủ - Melodify";
    initWow();
    fetchSongs();
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
      const response = await fetch('https://localhost:7153/api/Songs');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      setNewSongs(data);
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

      const response = await fetch(`https://localhost:7153/api/Songs/${song.songID}/play`);
      if (!response.ok) {
        throw new Error('Failed to get song URL');
      }
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const handlePlayingStateChange = (playing) => {
    setIsPlaying(playing);
  };

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  const heroImages = [
    "app-asset/img/banner1.jpg",
    "app-asset/img/banner2.jpg",
    "app-asset/img/banner3.jpg",
  ]

  const artists = [
    {
      id: 1,
      name: "Sơn Tùng",
      image: "/app-asset/img/sontungmtp.jpg",
    },
    {
      id: 2,
      name: "HIEUTHUHAI",
      image: "/app-asset/img/hieuthuhai.jpg",
    },
    {
      id: 3,
      name: "Trúc Nhân",
      image: "/app-asset/img/trucnhan.jpg",
    },
    {
      id: 4,
      name: "Vũ",
      image: "/app-asset/img/vu.jpg",
    },
    {
      id: 5,
      name: "Đen",
      image: "/app-asset/img/den.jpg",
    },
    {
      id: 6,
      name: "MCK",
      image: "/app-asset/img/mck.jpg",
    },
    {
      id: 7,
      name: "Mr Siro",
      image: "app-asset/img/mrsiro.jpeg",
    },
  ]

  const suggestedSongs = [
    {
      id: 1,
      title: "TRÂN BỘ NHỚ (feat....)",
      artist: 'ANH TRAI "SAY HI", Dương Domic',
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 2,
      title: "Thay Tôi Yêu Cô Ấy",
      artist: "Thanh Hưng",
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 3,
      title: "Chưa Chắc / 未必",
      artist: "Ngôn Cẩn Vũ / 言禁羽",
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 4,
      title: "Ngày Thơ",
      artist: "Tăng Duy Tân, Phong Max",
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 5,
      title: "FREQUENCY 超频率",
      artist: "WayV",
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 6,
      title: "Đừng Vì Anh Mà Khóc",
      artist: "Quang Hùng MasterD",
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 7,
      title: "Ly Hôn ở Cộng Hòa Ghana / 在加纳共和国离婚",
      artist: "Đới Vũ Đồng / 戴羽彤, Thừa Hoàn / 承欢",
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 8,
      title: "On The Ground",
      artist: "ROSÉ",
      image: "app-asset/img/mrsiro.jpeg",
    },
    {
      id: 9,
      title: "Đừng Khóc Một Mình (Thiếu Gia Ở Đây Rồi OST)",
      artist: "Quang Hùng MasterD",
      image: "app-asset/img/mrsiro.jpeg",
    },
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
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#18122B", color: "white" }}>
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0",
          transition: "margin-left 0.3s",
          paddingBottom: "100px",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />

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
            <button className="btn btn-primary hero-cta">
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

        <div className="px-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-4 fw-bold">Song new</h2>
            <Link to="#" className="text-decoration-none text-secondary-light">
              View all
            </Link>
          </div>

          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
            {newSongs.map((song) => (
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

        <div className="px-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-4 fw-bold">Suggest for you</h2>
            <button
              className="btn d-flex align-items-center gap-2 text-secondary-light"
              style={{ backgroundColor: "rgba(141, 47, 189, 0.2)" }}
              onClick={() => console.log("Refresh suggestions")}
            >
              <RotateCw size={16} />
              LÀM MỚI
            </button>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-4">
              {suggestedSongs.slice(0, 3).map((song) => (
                <SuggestionItem key={song.id} song={song} />
              ))}
            </div>
            <div className="col-12 col-lg-4">
              {suggestedSongs.slice(3, 6).map((song) => (
                <SuggestionItem key={song.id} song={song} />
              ))}
            </div>
            <div className="col-12 col-lg-4">
              {suggestedSongs.slice(6, 9).map((song) => (
                <SuggestionItem key={song.id} song={song} />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-4 fw-bold">Playlist for you</h2>
            <Link to="#" className="text-decoration-none text-secondary-light">
              View all
            </Link>
          </div>

          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
            {[
              { 
                id: 1, 
                title: "Chill Mix", 
                description: "Thư giãn cùng những giai điệu nhẹ nhàng",
                image: "/app-asset/img/playlist1.jpg"
              },
              { 
                id: 2, 
                title: "Workout Hits", 
                description: "Năng lượng cho những buổi tập",
                image: "/app-asset/img/playlist2.jpg"
              },
              { 
                id: 3, 
                title: "V-Pop Rising", 
                description: "Những bản hit Việt mới nhất",
                image: "/app-asset/img/playlist3.jpg"
              },
              { 
                id: 4, 
                title: "K-Pop Mania", 
                description: "Đắm chìm trong thế giới K-Pop",
                image: "/app-asset/img/playlist4.jpg"
              },
              { 
                id: 5, 
                title: "Acoustic Favorites", 
                description: "Những bản acoustic đầy cảm xúc",
                image: "/app-asset/img/playlist5.jpg"
              },
              { 
                id: 6, 
                title: "Party Mix", 
                description: "Sôi động cùng những bản EDM",
                image: "/app-asset/img/playlist6.jpg"
              },
              { 
                id: 7, 
                title: "Party Mix", 
                description: "Sôi động cùng những bản EDM",
                image: "/app-asset/img/playlist6.jpg"
              }
            ].map((playlist) => (
              <div key={playlist.id} className="col">
                <div className="position-relative" style={{ maxWidth: "150px" }}>
                  <div className="ratio ratio-1x1 rounded overflow-hidden mb-2">
                    <img
                      src={playlist.image || "/placeholder.svg"}
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
                      {playlist.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-4 fw-bold">Artist</h2>
            <Link to="#" className="text-decoration-none text-secondary-light d-flex align-items-center">
              View all
              <ChevronRight size={20} className="ms-1" />
            </Link>
          </div>

          <div className="row row-cols-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-7 g-4">
            {artists.map((artist) => (
              <div key={artist.id} className="col">
                <div className="text-center artist-card">
                  <div className="position-relative mx-auto mb-3" style={{ width: "150px", height: "150px" }}>
                    <img
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      className="rounded-circle w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <h3 className="fs-6 fw-medium mb-1">{artist.name}</h3>
                  <p className="small text-secondary-light m-0">Artist</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>

      {currentSong && (
        <PlayingBar 
          song={currentSong} 
          isSidebarOpen={isSidebarOpen}
          onPlayingStateChange={handlePlayingStateChange}
          isPlaying={isPlaying}
        />
      )}
    </div>
  )
}

export default Home

