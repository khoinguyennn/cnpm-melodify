"use client"

import { useState, useEffect } from "react"
import DataTable from "./DataTable"
import { Plus, Edit, Trash, X } from "lucide-react"
import "../styles/Modal.css"
import Toast from "../../components/common/Toast/Toast"
import { playlistApi } from '../../services/playlistApi'
import { userApi } from '../../services/userApi'


const PlaylistManagement = () => {
  const [playlists, setPlaylists] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [toasts, setToasts] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [users, setUsers] = useState([])


  useEffect(() => {
    fetchPlaylists()
    fetchUsers()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const data = await playlistApi.getAllPlaylists()
      setPlaylists(data)
    } catch (error) {
      console.error("Error fetching playlists:", error)
      addToast("Lỗi khi tải danh sách playlist!", "error")
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll()
      setUsers(data)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error)
    }
  }

  const addToast = (message, type) => {
    const newToast = {
      id: Date.now(),
      message,
      type
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleAdd = () => {
    setCurrentPlaylist(null)
    setImagePreview(null)
    setIsModalOpen(true)
  }

  const handleEdit = (playlist) => {
    setCurrentPlaylist(playlist)
    setImagePreview(`https://localhost:7153${playlist.imageUrl}`)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa playlist này?");
    if (!confirmDelete) return;
  
    try {
      let songs = [];
  
      try {
        songs = await playlistApi.getSongsInPlaylist(id);
      } catch (error) {
        // Nếu lỗi 404, nghĩa là không có bài hát => tiếp tục xóa playlist
        if (error.response?.status !== 404) {
          throw error; // Nếu là lỗi khác thì ném ra
        }
      }
  
      // Nếu có bài hát thì xóa từng bài hát khỏi playlist
      if (songs.length > 0) {
        for (const song of songs) {
          await playlistApi.removeSongFromPlaylist(id, song.songID);
        }
      }
  
      // Cuối cùng xóa playlist
      const data = await playlistApi.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.playlistID !== id));
      addToast(data.message || "Xóa playlist thành công!", "success");
  
    } catch (error) {
      console.error("Error deleting playlist:", error);
      addToast(error.message || "Lỗi khi xóa playlist!", "error");
    }
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
  
    try {
      let result;
      if (currentPlaylist) {
        result = await playlistApi.updatePlaylist(currentPlaylist.playlistID, formData);
      } else {
        result = await playlistApi.createPlaylist(formData);
      }
  
      await fetchPlaylists();
      setIsModalOpen(false);
      addToast(`${currentPlaylist ? 'Cập nhật' : 'Thêm'} playlist thành công!`, "success");
    } catch (error) {
      console.error("Error:", error);
      addToast("Có lỗi xảy ra khi lưu playlist!", "error");
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      addToast("Vui lòng chọn file ảnh!", "error")
      e.target.value = ""
      return
    }

    setImagePreview(URL.createObjectURL(file))
  }

  const getUserName = (userID) => {
    const user = users.find(u => u.userID === userID)
    return user ? user.displayName : "Unknown"
  }

  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (playlist) => (
        <img
          src={`https://localhost:7153${playlist.imageUrl}`}
          alt={playlist.title}
          style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }}
        />
      )
    },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    {
        key: "userID",
        label: "Created By",
        render: (playlist) => getUserName(playlist.userID)
      },
    {
      key: "createdAt",
      label: "Created At",
      render: (playlist) => new Date(playlist.createdAt).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      render: (playlist) => (
        <>
          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(playlist)}>
            <Edit size={16} />
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(playlist.playlistID)}>
            <Trash size={16} />
          </button>
        </>
      )
    }
  ]

  return (
    <div className="playlist-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Playlist Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={20} className="me-2" /> Add Playlist
        </button>
      </div>

      <DataTable columns={columns} data={playlists} />

      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h3>{currentPlaylist ? "Edit Playlist" : "Add New Playlist"}</h3>
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
                    defaultValue={currentPlaylist?.title}
                    required
                    className="custom-form-control"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={currentPlaylist?.description}
                    required
                    className="custom-form-control"
                  />
                </div>

                <div className="custom-form-group">
                  <label>Image</label>
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
                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                    />
                  )}
                </div>

                <div className="custom-modal-footer">
                  <button type="submit" className="custom-btn custom-btn-primary">Save</button>
                  <button type="button" className="custom-btn custom-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="position-fixed" style={{ top: "20px", right: "20px", zIndex: 9999 }}>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  )
}

export default PlaylistManagement
