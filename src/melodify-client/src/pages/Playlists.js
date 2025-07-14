import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import { Plus, Music } from "lucide-react";
import { playlistApi } from "../services/playlistApi";
import "./Playlists.css";
import { useNavigate } from "react-router-dom";

const CreatePlaylistModal = ({ isOpen, onClose, onCreatePlaylist }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Tạo URL để preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Tạo FormData để gửi cả file và text
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description || ''); // Đảm bảo description không null
      if (image) {
        formData.append('image', image);
      }

      await onCreatePlaylist(formData);
      // Reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo playlist. Vui lòng thử lại!';
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="fs-5 fw-bold mb-4">Tạo Playlist mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Tên Playlist</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="form-label">Ảnh bìa</label>
            <div className="d-flex gap-3 align-items-center">
              <div className="image-preview" style={{ width: "100px", height: "100px" }}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-100 h-100 rounded"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-100 h-100 rounded bg-secondary d-flex align-items-center justify-content-center">
                    <Music size={32} />
                  </div>
                )}
              </div>
              <div className="flex-grow-1">
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small className="text-secondary-light">
                  Chọn ảnh bìa cho playlist của bạn
                </small>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Tạo Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${playlist.playlistID}`);
  };

  return (
    <div 
      className="playlist-card" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="position-relative">
        <div className="playlist-image">
          {playlist.imageUrl ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${playlist.imageUrl}`}
              alt={playlist.title}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="default-image">
              <Music size={48} />
            </div>
          )}
        </div>
      </div>
      <div className="playlist-info">
        <h3 className="fs-6 fw-medium mb-1 text-truncate">{playlist.title}</h3>
        <p className="small text-secondary-light mb-0 text-truncate">
          {playlist.description || "Không có mô tả"}
        </p>
      </div>
    </div>
  );
};

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Playlist của tôi - Melodify";
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const data = await playlistApi.getMyPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleCreatePlaylist = async (playlistData) => {
    try {
      await playlistApi.createPlaylist(playlistData);
      fetchPlaylists(); // Refresh danh sách sau khi tạo
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert(error.message || 'Có lỗi xảy ra khi tạo playlist!');
    }
  };

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <div className="playlists-container px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fs-4 fw-bold mb-0">Playlist của tôi</h1>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Tạo Playlist
          </button>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center text-secondary-light py-5">
            <Music size={48} className="mb-3" />
            <p>Bạn chưa có playlist nào.</p>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-4">
            {playlists.map((playlist) => (
              <div key={playlist.playlistID} className="col">
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
          </div>
        )}

        <CreatePlaylistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreatePlaylist={handleCreatePlaylist}
        />
      </div>
    </MainLayout>
  );
};

export default Playlists; 