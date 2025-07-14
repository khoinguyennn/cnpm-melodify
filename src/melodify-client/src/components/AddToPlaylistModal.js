import React, { useState, useEffect } from 'react';
import { playlistApi } from '../services/playlistApi';
import { useAuth } from '../contexts/AuthContext';
import './AddToPlaylistModal.css';
import { Music } from 'lucide-react';

const AddToPlaylistModal = ({ isOpen, onClose, songId, onAddSuccess }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchPlaylists();
    }
  }, [isOpen, user]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistApi.getMyPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistApi.addSongToPlaylist(playlistId, songId);
      onAddSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert(error.message || 'Có lỗi xảy ra khi thêm bài hát vào playlist');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Thêm vào Playlist</h5>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="text-center">Đang tải...</div>
          ) : playlists.length === 0 ? (
            <div className="text-center">Bạn chưa có playlist nào</div>
          ) : (
            <div className="playlist-list">
              {playlists.map(playlist => (
                <div 
                  key={playlist.playlistID}
                  className="playlist-item"
                  onClick={() => handleAddToPlaylist(playlist.playlistID)}
                >
                  <div className="position-relative">
                    <div className="playlist-image">
                      {playlist.imageUrl ? (
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}${playlist.imageUrl}`}
                          alt={playlist.title}
                          className="w-100 h-100"
                          style={{ 
                            objectFit: "cover",
                            borderRadius: "4px"
                          }}
                        />
                      ) : (
                        <div className="default-image">
                          <Music size={48} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="playlist-info">
                    <h6>{playlist.title}</h6>
                    <p>{playlist.description || "Không có mô tả"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal; 