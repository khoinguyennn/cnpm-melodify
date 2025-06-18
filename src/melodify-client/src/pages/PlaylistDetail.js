import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import { Trash2, Play } from "lucide-react";
import { playlistApi } from "../services/playlistApi";
import "./PlaylistDetail.css";

const PlaylistDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchPlaylistDetails();
  }, [id]);

  const fetchPlaylistDetails = async () => {
    try {
      setLoading(true);
      const playlistData = await playlistApi.getPlaylistById(id);
      setPlaylist(playlistData);

      const songsData = await playlistApi.getSongsInPlaylist(id);
      setSongs(songsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài hát này khỏi playlist?')) {
      return;
    }
    
    try {
      await playlistApi.removeSongFromPlaylist(id, songId);
      setSongs(songs.filter(song => song.songID !== songId));
    } catch (error) {
      console.error('Error removing song:', error);
      alert('Có lỗi xảy ra khi xóa bài hát khỏi playlist!');
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

  if (loading) return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </MainLayout>
  );


  if (!playlist) return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <div className="error-container">
        <div className="alert alert-warning" role="alert">
          Không tìm thấy playlist
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      currentSong={currentSong}
      isPlaying={isPlaying}
      onPlayingStateChange={setIsPlaying}
    >
      <div className="playlist-detail">
        <div className="playlist-header">
          <div className="playlist-info">
          <img 
            src={playlist.imageUrl ? `https://localhost:7153${playlist.imageUrl}` : "/app-asset/img/playlist-default.png"} 
            alt={playlist.title} 
            className="playlist-cover"
          />
            <div className="playlist-details">
              <h1>{playlist.title}</h1>
              <p className="description">{playlist.description}</p>
              <p className="song-count">{songs.length} bài hát</p>
            </div>
          </div>
        </div>

        <div className="songs-list">
          <h2>Danh sách bài hát</h2>
          {songs.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có bài hát nào trong playlist</p>
            </div>
          ) : (
            <div className="songs-container">
              {songs.map((song, index) => (
                <div 
                  key={song.songID} 
                  className="song-item"
                  onClick={() => handlePlaySong(song)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="song-number">{index + 1}</span>
                  <div className="position-relative">
                    <img 
                      src={song.imageUrl ? `https://localhost:7153${song.imageUrl}` : "/app-asset/img/song-default.png"}
                      alt={song.title} 
                      className="song-cover" 
                    />
                    <div className="play-icon-overlay">
                      <Play size={24} />
                    </div>
                  </div>
                  <div className="song-info">
                    <h3>{song.title}</h3>
                    <p>{song.artistName}</p>
                  </div>
                  {user && playlist.userID === user.userID && (
                    <button 
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSong(song.songID);
                      }}
                      title="Xóa khỏi playlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PlaylistDetail; 