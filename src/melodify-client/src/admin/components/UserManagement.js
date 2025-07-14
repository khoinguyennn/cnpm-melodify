"use client"

import { useState, useEffect } from "react"
import DataTable from "./DataTable"
import { Plus, Edit, Trash, X, Key } from "lucide-react"
import "../styles/Modal.css"
import Toast from "../../components/common/Toast/Toast"
import { userApi } from '../../services/userApi'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [toasts, setToasts] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      addToast("Lỗi khi tải danh sách người dùng!", "error");
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
    setCurrentUser(null)
    setImagePreview(null)
    setShowPassword(true)
    setIsModalOpen(true)
  }

  const handleEdit = (user) => {
    setCurrentUser(user)
    setImagePreview(`${process.env.REACT_APP_BACKEND_URL}${user.imageUrl}`)
    setShowPassword(false)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");

    if (confirmDelete) {
      try {
        const data = await userApi.delete(id);
        setUsers(prevUsers => prevUsers.filter(user => user.userID !== id));
        addToast(data.message || "Xóa người dùng thành công!", "success");
      } catch (error) {
        console.error("Error:", error);
        addToast(error.message || "Có lỗi xảy ra khi xóa người dùng!", "error");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.target);
      
      let result;
      if (currentUser) {
        result = await userApi.update(currentUser.userID, formData);
      } else {
        result = await userApi.register(formData);
      }

      // Cập nhật danh sách users
      if (currentUser) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.userID === currentUser.userID ? result.user : user
          )
        );
      } else {
        setUsers(prevUsers => [...prevUsers, result]);
      }

      setIsModalOpen(false);
      addToast(result.message || `${currentUser ? 'Cập nhật' : 'Thêm'} người dùng thành công!`, "success");

    } catch (error) {
      console.error("Error:", error);
      addToast(error.message || `Có lỗi xảy ra!`, "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast("Vui lòng chọn file ảnh hợp lệ!", "error");
      e.target.value = '';
      return;
    }
    setImagePreview(URL.createObjectURL(file));
  };

  const columns = [
    { 
      key: "imageUrl", 
      label: "Avatar", 
      render: (user) => (
        <img 
          src={`${process.env.REACT_APP_BACKEND_URL}${user.imageUrl}`} 
          alt={user.displayName} 
          style={{ width: "40px", height: "40px", borderRadius: "50%" }} 
        />
      ) 
    },
    { key: "displayName", label: "Display Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { 
      key: "createdAt", 
      label: "Created At",
      render: (user) => new Date(user.createdAt).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <>
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            onClick={() => handleEdit(user)}
            title="Chỉnh sửa"
          >
            <Edit size={16} />
          </button>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(user.userID)}
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
    <div className="user-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={20} className="me-2" /> Add New User
        </button>
      </div>

      <DataTable columns={columns} data={users} />

      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h3 className="custom-modal-title">
                {currentUser ? "Edit User" : "Add New User"}
              </h3>
              <button className="custom-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="custom-form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    defaultValue={currentUser?.email} 
                    required 
                    className="custom-form-control"
                    disabled={currentUser} // Email không thể sửa khi edit
                  />
                </div>

                {!currentUser && (
                  <div className="custom-form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      required 
                      className="custom-form-control" 
                    />
                  </div>
                )}

                <div className="custom-form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    name="displayName" 
                    defaultValue={currentUser?.displayName} 
                    required 
                    className="custom-form-control" 
                  />
                </div>

                <div className="custom-form-group">
                  <label>Role</label>
                  <select 
                    name="role" 
                    defaultValue={currentUser?.role || "User"} 
                    required 
                    className="custom-form-control"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="custom-form-group">
                  <label>Avatar</label>
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

export default UserManagement

