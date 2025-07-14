import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { songApi } from '../services/songApi';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import { Music, Headphones, Radio, Mic2, Guitar, Drum, Disc, Heart, Star, Music2, Play, PlaySquare, ArrowLeft } from 'lucide-react';
import '../pages/Home.css';

const Search = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchResults, setSearchResults] = useState([]); 
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const navigate = useNavigate();

  const genres = [
    { name: 'Pop', color: '#FF6B6B', icon: <Music size={24} />, gradient: 'linear-gradient(45deg, #FF6B6B, #FFE66D)' },
    { name: 'Folk', color: '#4ECDC4', icon: <Guitar size={24} />, gradient: 'linear-gradient(45deg, #4ECDC4, #556270)' },
    { name: 'Latin', color: '#FFD93D', icon: <Radio size={24} />, gradient: 'linear-gradient(45deg, #FFD93D, #FF6B6B)' },
    { name: 'Metal', color: '#6C5CE7', icon: <Headphones size={24} />, gradient: 'linear-gradient(45deg, #6C5CE7, #a363d9)' },
    { name: 'R&B', color: '#FF8ED4', icon: <Heart size={24} />, gradient: 'linear-gradient(45deg, #FF8ED4, #FF6B6B)' },
    { name: 'Soul', color: '#E17055', icon: <Mic2 size={24} />, gradient: 'linear-gradient(45deg, #E17055, #FAB1A0)' },
    { name: 'Punk', color: '#1DD1A1', icon: <Star size={24} />, gradient: 'linear-gradient(45deg, #1DD1A1, #00B894)' },
    { name: 'Disco', color: '#00B894', icon: <Disc size={24} />, gradient: 'linear-gradient(45deg, #00B894, #00CEC9)' },
    { name: 'Funk', color: '#FD79A8', icon: <Music2 size={24} />, gradient: 'linear-gradient(45deg, #FD79A8, #E84393)' },
    { name: 'Gospel', color: '#6C5CE7', icon: <Drum size={24} />, gradient: 'linear-gradient(45deg, #6C5CE7, #45aaf2)' },
  ];

  useEffect(() => {
    document.title = "Tìm kiếm - Melodify";
    const query = searchParams.get('q');
    const genre = searchParams.get('genre');
    
    if (!query && !genre) {
      setSearchResults([]);
      setSelectedGenre(null);
      return;
    }

    if (query) {
      performSearch(query);
    } else if (genre) {
      fetchSongsByGenre(genre);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentSong) {
      setIsAnimating(true);
    }
  }, [currentSong]);

  const performSearch = async (query) => {
    try {
      const results = await songApi.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  const fetchSongsByGenre = async (genreName) => {
    try {
      const results = await songApi.getByGenre(genreName);
      setSearchResults(results);
      const genre = genres.find(g => g.name === genreName);
      if (genre) {
        setSelectedGenre(genre);
      }
    } catch (error) {
      console.error('Error fetching songs by genre:', error);
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

  const handleGenreClick = (genre) => {
    setSearchResults([]);
    navigate(`/search?genre=${encodeURIComponent(genre.name)}`);
  };

  const handleBack = () => {
    setSearchResults([]);
    setSelectedGenre(null);
    navigate('/search');
  };

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      currentSong={currentSong}
      isPlaying={isPlaying}
      onPlayingStateChange={setIsPlaying}
    >
      <div className="px-4">
        {!searchParams.get('q') && !searchParams.get('genre') ? (
          <div className="mb-5">
            <h2 className="fs-4 fw-bold mb-4">Thể loại</h2>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
              {genres.map((genre) => (
                <div key={genre.name} className="col">
                  <div 
                    className="genre-card rounded-4 position-relative overflow-hidden"
                    style={{ 
                      background: genre.gradient,
                      cursor: 'pointer',
                      height: '160px'
                    }}
                    onClick={() => handleGenreClick(genre)}
                  >
                    <div className="position-absolute top-0 start-0 p-4 text-white">
                      <div className="genre-icon-wrapper mb-2">
                        {genre.icon}
                      </div>
                      <h3 className="fs-5 fw-bold mb-0">{genre.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <button 
                className="btn btn-link text-white p-0"
                onClick={handleBack}
                style={{ 
                  textDecoration: 'none',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="fs-4 fw-bold m-0">
                {searchParams.get('q') 
                  ? `Kết quả tìm kiếm cho "${searchParams.get('q')}"`
                  : `Bài hát thể loại ${searchParams.get('genre')}`
                }
              </h2>
            </div>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
              {searchResults.map((song) => (
                <div key={song.songID} className="col">
                  <div 
                    className="song-card" 
                    style={{ maxWidth: "150px", cursor: "pointer" }}
                  >
                    <div className="position-relative mb-3" onClick={() => handlePlaySong(song)}>
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${song.imageUrl}`}
                        alt={song.title}
                        className="img-fluid rounded-3"
                        style={{ aspectRatio: "1/1", objectFit: "cover" }}
                      />
                      <div
                        className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center song-overlay"
                        style={{ 
                          top: 0,
                          left: 0,
                          backgroundColor: "rgba(0,0,0,0.4)", 
                          opacity: currentSong?.songID === song.songID ? 1 : 0 
                        }}
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
        )}
      </div>
    </MainLayout>
  );
};

export default Search; 