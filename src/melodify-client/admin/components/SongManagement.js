"use client"

import { useState, useEffect } from "react"
import DataTable from "./DataTable"
import { Plus, Edit, Trash, X, Upload } from "lucide-react"
import "../styles/Modal.css"
import Toast from "../../components/common/Toast/Toast";
import { songApi } from '../../services/songApi';
import { artistApi } from '../../services/artistApi';

const API_BASE_URL = "https://localhost:7153/api/Songs"

const SongManagement = () => {
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSong, setCurrentSong] = useState(null)
  const [toasts, setToasts] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSongs()
    fetchArtists()
  }, [])

  const fetchSongs = async () => {
    try {
      const data = await songApi.getAll();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
      addToast("Lỗi khi tải danh sách bài hát!", "error");
    }
  }

  const addToast = (message, type) => {
    const newToast = {
      id: Date.now(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchArtists = async () => {
    try {
      const data = await artistApi.getAll();
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      addToast("Lỗi khi tải danh sách nghệ sĩ!", "error");
    }
  }

  const handleAdd = () => {
    setCurrentSong(null)
    setAudioPreview(null)
    setImagePreview(null)
    setIsModalOpen(true)
  }

  const handleEdit = (song) => {
    setCurrentSong({
      ...song,
      releaseDate: song.releaseDate.split('T')[0] // Format date cho input
    });
    setAudioPreview(`https://localhost:7153${song.url}`);
    setImagePreview(`https://localhost:7153${song.imageUrl}`);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài hát này?");
  
    if (confirmDelete) {
      try {
        const data = await songApi.delete(id);
        setSongs(prevSongs => prevSongs.filter(song => song.songID !== id));
        addToast(data.message || "Xóa bài hát thành công!", "success");
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        addToast(error.response?.data?.message || "Có lỗi xảy ra khi xóa bài hát!", "error");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.target);
      
      // Validate files for new song
      if (!currentSong) {
        const audioFile = event.target.audioFile.files[0];
        const imageFile = event.target.imageFile.files[0];
        if (!audioFile || !imageFile) {
          addToast("Vui lòng chọn đầy đủ file audio và ảnh!", "error");
          return;
        }
      }

      let result;
      if (currentSong) {
        result = await songApi.update(currentSong.songID, formData);
      } else {
        result = await songApi.add(formData);
      }
      
      fetchSongs();
      setIsModalOpen(false);
      setCurrentSong(null);
      addToast(result.message || `${currentSong ? 'Cập nhật' : 'Thêm'} bài hát thành công!`, "success");
      
      setAudioPreview(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error:", error);
      addToast(error.response?.data?.message || `Có lỗi xảy ra!`, "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === 'audioFile') {
      if (!file.type.startsWith('audio/')) {
        addToast("Vui lòng chọn file audio hợp lệ!", "error");
        e.target.value = '';
        return;
      }
      setAudioPreview(URL.createObjectURL(file));
    } else if (e.target.name === 'imageFile') {
      if (!file.type.startsWith('image/')) {
        addToast("Vui lòng chọn file ảnh hợp lệ!", "error");
        e.target.value = '';
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const predefinedGenres = [
    "Pop", "Rock", "Rap", "R&B", "EDM", "Jazz",
    "Blues", "Classical", "Folk", "Country",
    "Metal", "Indie", "K-Pop", "V-Pop", "Ballad"
  ];

  const columns = [
    { 
      key: "imageUrl", 
      label: "Cover", 
      render: (song) => (
        <img 
          src={`https://localhost:7153${song.imageUrl}`} 
          alt={song.title} 
          style={{ width: "50px", height: "50px", borderRadius: "4px" }} 
        />
      ) 
    },
    { key: "title", label: "Title" },
    { key: "artistName", label: "Artist" },
    { key: "album", label: "Album" },
    { key: "genre", label: "Genre" },
    { key: "releaseDate", label: "Release Date" },
    { 
      key: "url", 
      label: "Audio", 
      render: (song) => (
        <audio controls>
          <source src={`https://localhost:7153${song.url}`} type="audio/mpeg" />
        </audio>
      ) 
    },
    {
      key: "actions",
      label: "Actions",
      render: (song) => (
        <>
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            onClick={() => handleEdit(song)}
            title="Chỉnh sửa"
          >
            <Edit size={16} />
          </button>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(song.songID)}
            title="Xóa"
            style={{ 
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            <Trash size={16} />
          </button>
        </>
      ),
    }
  ];

  return (
    <div className="song-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Song Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={20} className="me-2" /> Add New Song
        </button>
      </div>

      <DataTable columns={columns} data={songs} />

      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h3 className="custom-modal-title">
                {currentSong ? "Edit Song" : "Add New Song"}
              </h3>
              <button className="custom-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="custom-form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    defaultValue={currentSong?.title} 
                    required 
                    className="custom-form-control" 
                  />
                </div>

                <div className="custom-form-group">
                  <label>Artist</label>
                  <select 
                    name="artistId" 
                    defaultValue={currentSong?.artistId || ""} 
                    required 
                    className="custom-form-control"
                  >
                    <option value="">Select Artist</option>
                    {artists.map(artist => (
                      <option key={artist.artistID} value={artist.artistID}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="custom-form-group">
                  <label>Album</label>
                  <input 
                    type="text" 
                    name="album" 
                    defaultValue={currentSong?.album} 
                    placeholder="Album (Optional)" 
                    className="custom-form-control" 
                  />
                </div>

                <div className="custom-form-group">
                  <label>Genre</label>
                  <select 
                    name="genre" 
                    defaultValue={currentSong?.genre || ""} 
                    required 
                    className="custom-form-control"
                  >
                    <option value="">Select Genre</option>
                    {predefinedGenres.map((genre, index) => (
                      <option key={index} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div className="custom-form-group">
                  <label>Release Date</label>
                  <input 
                    type="date" 
                    name="releaseDate" 
                    defaultValue={currentSong?.releaseDate?.split('T')[0]} 
                    required 
                    className="custom-form-control" 
                  />
                </div>

                <div className="custom-form-group">
                  <label>Cover Image</label>
                  <input 
                    type="file" 
                    name="imageFile" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="custom-form-control" 
                  />
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} 
                    />
                  )}
                </div>

                <div className="custom-form-group">
                  <label>Audio File</label>
                  <input 
                    type="file" 
                    name="audioFile" 
                    accept="audio/*" 
                    onChange={handleFileChange}
                    className="custom-form-control" 
                  />
                  {audioPreview && (
                    <audio controls style={{ marginTop: '10px', width: '100%' }}>
                      <source src={audioPreview} type="audio/mpeg" />
                    </audio>
                  )}
                </div>

                <div className="custom-modal-footer">
                  <button type="submit" className="custom-btn custom-btn-primary">
                    Save
                  </button>
                  <button 
                    type="button" 
                    className="custom-btn custom-btn-secondary" 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="position-fixed" style={{
        top: "20px",
        right: "20px",
        zIndex: 9999
      }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SongManagement;