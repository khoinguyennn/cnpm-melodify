import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import { Heart, Play, Plus } from "lucide-react";
import { songApi } from "../services/songApi";
import "./Favorites.css";

const FavoriteItem = ({ song, onPlay, isPlaying, onRemoveFavorite }) => {
  const handleRemoveFavorite = async (e) => {
    e.stopPropagation();
    await onRemoveFavorite(song.songID);
  };

  return (
    <div 
      className="d-flex align-items-center gap-3 p-2 rounded hover-bg mb-2 favorite-item" 
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
        <h3 className="fs-6 fw-medium mb-0 text-truncate">{song.title}</h3>
        <p className="small text-secondary-light mb-0 text-truncate">{song.artistName}</p>
      </div>
      <div className="action-icons">
        <button 
          title="Xóa khỏi yêu thích"
          onClick={handleRemoveFavorite}
          className="favorite"
        >
          <Heart 
            size={18} 
            fill="currentColor"
            className="text-danger"
          />
        </button>
        <button title="Thêm vào playlist">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

const Favorites = () => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Bài hát yêu thích - Melodify";
    if (user) {
      fetchFavoriteSongs();
    }
  }, [user]);

  const fetchFavoriteSongs = async () => {
    try {
      const userId = user?.userID;
      if (!userId) {
        console.error('User ID not found');
        return;
      }
      const data = await songApi.getFavorites(userId);
      setFavoriteSongs(data);
    } catch (error) {
      console.error('Error fetching favorite songs:', error);
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

  const handleRemoveFavorite = async (songID) => {
    try {
      await songApi.unfavorite(songID);
      // Refresh danh sách sau khi xóa
      fetchFavoriteSongs();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert(error.message || 'Có lỗi xảy ra khi xóa bài hát khỏi yêu thích!');
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
      <div className="favorites-container px-4">
        <h1 className="fs-4 fw-bold mb-4">Bài hát yêu thích</h1>
        
        {favoriteSongs.length === 0 ? (
          <div className="text-center text-secondary-light py-5">
            <Heart size={48} className="mb-3" />
            <p>Bạn chưa có bài hát yêu thích nào.</p>
          </div>
        ) : (
          <div className="favorite-songs-list">
            {favoriteSongs.map((song) => (
              <FavoriteItem
                key={song.songID}
                song={song}
                onPlay={handlePlaySong}
                isPlaying={isPlaying && currentSong?.songID === song.songID}
                onRemoveFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Favorites; 