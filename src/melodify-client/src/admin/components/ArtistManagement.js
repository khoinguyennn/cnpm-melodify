"use client"

import { useState, useEffect } from "react"
import DataTable from "./DataTable"
import { Plus, Edit, Trash, X } from "lucide-react"
import "../styles/Modal.css"
import Toast from "../../components/common/Toast/Toast"
import { artistApi } from '../../services/artistApi'

const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const ArtistManagement = () => {
  const [artists, setArtists] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentArtist, setCurrentArtist] = useState(null)
  const [toasts, setToasts] = useState([])
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const data = await artistApi.getAll();
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      addToast("Lỗi khi tải danh sách nghệ sĩ!", "error");
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
    setCurrentArtist(null)
    setImagePreview(null)
    setIsModalOpen(true)
  }

  const handleEdit = (artist) => {
    setCurrentArtist(artist)
    setImagePreview(`https://localhost:7153${artist.imageUrl}`)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nghệ sĩ này?")

    if (confirmDelete) {
      try {
        const data = await artistApi.delete(id);
        setArtists(prevArtists => prevArtists.filter(artist => artist.artistID !== id));
        addToast(data.message || "Xóa nghệ sĩ thành công!", "success");
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        addToast(error.message || "Có lỗi xảy ra khi xóa nghệ sĩ!", "error");
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      const formData = new FormData()
      
      // Lấy dữ liệu từ form
      formData.append('name', event.target.name.value)
      formData.append('bio', event.target.bio.value || '')
      
      // Lấy file ảnh
      const imageFile = event.target.imageFile.files[0]

      if (!currentArtist && !imageFile) {
        addToast("Vui lòng chọn ảnh cho nghệ sĩ!", "error")
        return
      }

      if (imageFile) {
        formData.append('imageFile', imageFile)
      }

      let result;
      if (currentArtist) {
        result = await artistApi.update(currentArtist.artistID, formData);
      } else {
        result = await artistApi.add(formData);
      }

      fetchArtists()
      setIsModalOpen(false)
      setCurrentArtist(null)
      setImagePreview(null)
      addToast(result.message || `${currentArtist ? 'Cập nhật' : 'Thêm'} nghệ sĩ thành công!`, "success")

    } catch (error) {
      console.error("Error:", error)
      addToast(error.message || `Có lỗi xảy ra khi ${currentArtist ? 'cập nhật' : 'thêm'} nghệ sĩ!`, "error")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      addToast("Vui lòng chọn file ảnh hợp lệ!", "error")
      e.target.value = ''
      return
    }
    setImagePreview(URL.createObjectURL(file))
  }

  const columns = [
    { 
      key: "imageUrl", 
      label: "Image", 
      render: (artist) => (
        <img 
          src={`https://localhost:7153${artist.imageUrl}`} 
          alt={artist.name} 
          style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
        />
      ) 
    },
    { key: "name", label: "Name" },
    { 
      key: "bio", 
      label: "Biography",
      render: (artist) => (
        <div title={artist.bio}>
          {truncateText(artist.bio, 100)}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (artist) => (
        <>
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            onClick={() => handleEdit(artist)}
            title="Chỉnh sửa"
          >
            <Edit size={16} />
          </button>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(artist.artistID)}
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
  ]

  return (
    <div className="artist-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Artist Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={20} className="me-2" /> Add New Artist
        </button>
      </div>

      <DataTable columns={columns} data={artists} />

      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h3 className="custom-modal-title">
                {currentArtist ? "Edit Artist" : "Add New Artist"}
              </h3>
              <button className="custom-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="custom-form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={currentArtist?.name} 
                    required 
                    className="custom-form-control" 
                  />
                </div>

                <div className="custom-form-group">
                  <label>Biography</label>
                  <textarea 
                    name="bio" 
                    defaultValue={currentArtist?.bio} 
                    className="custom-form-control"
                    rows="4" 
                  />
                </div>

                <div className="custom-form-group">
                  <label>Artist Image</label>
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
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        marginTop: '10px',
                        borderRadius: '50%' 
                      }} 
                    />
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
  )
}

export default ArtistManagement