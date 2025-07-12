"use client"

import { useState, useEffect, useRef } from "react"
import { User, Lock, Shield, Edit2, Camera, Mail, Phone, Calendar, MapPin, Info, Eye, EyeOff } from "lucide-react"
import Sidebar from "../components/layout/Sidebar/Sidebar"
import Navbar from "../components/layout/Navbar/Navbar"
import { useAuth } from '../contexts/AuthContext'
import { userApi } from '../services/userApi'
import Toast from "../components/common/Toast/Toast"
import "./UserProfile.css"
import MainLayout from '../components/layout/MainLayout/MainLayout'

const UserProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState("personal")
    const { user, setUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [toasts, setToasts] = useState([])
    const fileInputRef = useRef(null)
    const [showPassword, setShowPassword] = useState({
      current: false,
      new: false,
      confirm: false
    })
  
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  
    const [isSubmitting, setIsSubmitting] = useState(false)
  
    const [formData, setFormData] = useState({
      displayName: user?.displayName || "",
      email: user?.email || "",
      imageFile: null,
      imagePreview: user?.imageUrl ? `https://localhost:7153${user.imageUrl}` : "/app-asset/img/avatar.webp",
    })
  
    useEffect(() => {
      if (user) {
        setFormData({
          displayName: user.displayName || "",
          email: user.email || "",
          imageFile: null,
          imagePreview: user.imageUrl ? `https://localhost:7153${user.imageUrl}` : "/app-asset/img/avatar.webp",
        })
      }
    }, [user])
  
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
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
    }
  
    const handleEdit = () => {
      setIsEditing(true)
    }
  
    const handleCancel = () => {
      setIsEditing(false)
      setFormData({
        displayName: user?.displayName || "",
        email: user?.email || "",
        imageFile: null,
        imagePreview: user?.imageUrl ? `https://localhost:7153${user.imageUrl}` : "/app-asset/img/avatar.webp",
      })
    }
  
    const handleImageClick = () => {
      fileInputRef.current?.click()
    }
  
    const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          addToast("Vui lòng chọn file ảnh hợp lệ!", "error")
          return
        }
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: URL.createObjectURL(file)
        }))
      }
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      
      if (!formData.displayName.trim()) {
        addToast("Vui lòng nhập tên hiển thị!", "error")
        return
      }

      if (!formData.email.trim()) {
        addToast("Vui lòng nhập email!", "error")
        return
      }

      try {
        const formDataToSend = new FormData()
        formDataToSend.append('displayName', formData.displayName)
        formDataToSend.append('role', user.role)
        if (formData.imageFile) {
          formDataToSend.append('imageFile', formData.imageFile)
        }

        const response = await userApi.update(user.userID, formDataToSend)
        if (response.user) {
          setUser(response.user)
          setIsEditing(false)
          addToast("Cập nhật thông tin thành công!", "success")
        }
      } catch (error) {
        console.error("Update error:", error)
        addToast(error.message || "Có lỗi xảy ra khi cập nhật thông tin!", "error")
      }
    }
  
    const getRoleBadgeColor = (role) => {
      switch (role?.toLowerCase()) {
        case 'admin':
          return '#FF4D4D';
        case 'premium':
          return '#FFD700';
        default:
          return '#4CAF50';
      }
    }
  
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('vi-VN', options)
    }
  
    const handlePasswordChange = async (e) => {
      e.preventDefault();
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        addToast("Mật khẩu mới không khớp!", "error");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        addToast("Mật khẩu mới phải có ít nhất 6 ký tự!", "error");
        return;
      }

      try {
        setIsSubmitting(true);
        
        const response = await userApi.changePassword(user.userID, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        });

        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        addToast(response.message || "Đổi mật khẩu thành công!", "success");
      } catch (error) {
        console.error('Password change error:', error);
        addToast(error.message || "Có lỗi xảy ra khi đổi mật khẩu!", "error");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const getPasswordStrength = () => {
      const length = passwordData.newPassword.length;
      if (length >= 8) return "Strong";
      if (length >= 6) return "Medium";
      if (length >= 4) return "Weak";
      return "Very Weak";
    };
  
    return (
      <MainLayout
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentSong={null}
        isPlaying={false}
        onPlayingStateChange={(state) => {}}
      >
        <div className="container-fluid py-4">
          <div className="profile-header-banner">
            <div className="profile-header-content">
              <div 
                className="profile-avatar-wrapper" 
                onClick={isEditing ? handleImageClick : undefined}
                style={{ cursor: isEditing ? 'pointer' : 'default' }}
              >
                <img 
                  src={formData.imagePreview} 
                  alt="Profile" 
                  className={`profile-avatar-large ${isEditing ? 'editable' : ''}`} 
                />
                {isEditing && (
                  <div className="avatar-overlay">
                    <Camera size={24} />
                    <span>Thay đổi ảnh</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="profile-header-info">
                <div className="d-flex align-items-center gap-3">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-name-input"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Nhập tên hiển thị"
                    />
                  ) : (
                    <h1 className="profile-name">{formData.displayName}</h1>
                  )}
                  <span className="role-badge" style={{ backgroundColor: getRoleBadgeColor(user?.role) }}>
                    <Shield size={14} />
                    {user?.role}
                  </span>
                </div>
                <p className="profile-join-date">Tham gia ngày {formatDate(user?.createdAt)}</p>
                
                <div className="mt-3">
                  {isEditing ? (
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={handleSubmit}>
                        Lưu thay đổi
                      </button>
                      <button className="btn btn-outline-secondary" onClick={handleCancel}>
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-outline-primary" onClick={handleEdit}>
                      <Edit2 size={16} className="me-2" />
                      Chỉnh sửa thông tin
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="profile-nav-card">
                <h5 className="nav-title">Account Settings</h5>
                <div className="nav-items">
                  <button
                    className={`nav-item-btn ${activeTab === "personal" ? "active" : ""}`}
                    onClick={() => setActiveTab("personal")}
                  >
                    <User size={20} />
                    <span>Personal Info</span>
                  </button>
                  <button
                    className={`nav-item-btn ${activeTab === "security" ? "active" : ""}`}
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock size={20} />
                    <span>Security</span>
                  </button>
                  <button
                    className={`nav-item-btn ${activeTab === "privacy" ? "active" : ""}`}
                    onClick={() => setActiveTab("privacy")}
                  >
                    <Shield size={20} />
                    <span>Privacy</span>
                  </button>
                </div>
              </div>
            </div>
  
            <div className="col-md-9">
              {activeTab === "personal" && (
                <div className="profile-content-card">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="content-title mb-0">Personal Information</h2>
                    {!isEditing && (
                      <button className="btn btn-outline-primary" onClick={handleEdit}>
                        <Edit2 size={16} className="me-2" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-item full-width">
                      <div className="info-label">
                        <User size={18} />
                        <span>Display Name</span>
                      </div>
                      <div className="info-content">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            value={formData.displayName}
                            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                            placeholder="Nhập tên hiển thị"
                          />
                        ) : (
                          <div className="info-value">{user?.displayName}</div>
                        )}
                      </div>
                    </div>
    
                    <div className="info-item full-width">
                      <div className="info-label">
                        <Mail size={18} />
                        <span>Email</span>
                      </div>
                      <div className="info-content">
                        {isEditing ? (
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Nhập email"
                          />
                        ) : (
                          <div className="info-value">{user?.email}</div>
                        )}
                      </div>
                    </div>
                  </div>
    
                  {isEditing && (
                    <div className="mt-4 d-flex gap-2 justify-content-end">
                      <button className="btn btn-primary" onClick={handleSubmit}>
                        Lưu thay đổi
                      </button>
                      <button className="btn btn-outline-secondary" onClick={handleCancel}>
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              )}
    
              {activeTab === "security" && (
                <div className="profile-content-card">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="content-title mb-0">Security Settings</h2>
                  </div>
    
                  <div className="security-card">
                    <div className="security-card-header">
                      <div className="d-flex align-items-center gap-3">
                        <div className="security-icon">
                          <Lock size={20} />
                        </div>
                        <div>
                          <h5 className="mb-1">Change Password</h5>
                          <p className="text-secondary mb-0">Make sure to use a strong password to protect your account</p>
                        </div>
                      </div>
                    </div>
    
                    <div className="security-card-body">
                      <form onSubmit={handlePasswordChange}>
                        <div className="password-field mb-4">
                          <label className="form-label text-secondary">Current Password</label>
                          <div className="input-group">
                            <input 
                              type={showPassword.current ? "text" : "password"}
                              className="form-control custom-input" 
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({
                                ...prev,
                                currentPassword: e.target.value
                              }))}
                              placeholder="Enter your current password"
                            />
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary" 
                              onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                            >
                              {showPassword.current ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                          </div>
                        </div>
    
                        <div className="password-field mb-4">
                          <label className="form-label text-secondary">New Password</label>
                          <div className="input-group">
                            <input 
                              type={showPassword.new ? "text" : "password"}
                              className="form-control custom-input" 
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({
                                ...prev,
                                newPassword: e.target.value
                              }))}
                              placeholder="Enter new password"
                            />
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                            >
                              {showPassword.new ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                          </div>
                          <div className="password-strength mt-2">
                            <div className="strength-bars d-flex gap-1">
                              <div className={`strength-bar ${passwordData.newPassword.length >= 2 ? 'active' : ''}`}></div>
                              <div className={`strength-bar ${passwordData.newPassword.length >= 4 ? 'active' : ''}`}></div>
                              <div className={`strength-bar ${passwordData.newPassword.length >= 6 ? 'active' : ''}`}></div>
                              <div className={`strength-bar ${passwordData.newPassword.length >= 8 ? 'active' : ''}`}></div>
                            </div>
                            <small className="text-secondary">Password strength: {getPasswordStrength()}</small>
                          </div>
                        </div>
    
                        <div className="password-field mb-4">
                          <label className="form-label text-secondary">Confirm New Password</label>
                          <div className="input-group">
                            <input 
                              type={showPassword.confirm ? "text" : "password"}
                              className="form-control custom-input" 
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({
                                ...prev,
                                confirmPassword: e.target.value
                              }))}
                              placeholder="Confirm your new password"
                            />
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                              {showPassword.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                          </div>
                        </div>
    
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Lock size={18} />
                              Update Password
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
    
              {activeTab === "privacy" && (
                <div className="profile-content-card">
                  <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                      <Shield size={48} className="text-primary mb-3" />
                      <h4 className="mb-2">Privacy Settings</h4>
                      <p className="text-secondary">
                        Tính năng này đang được phát triển. Vui lòng quay lại sau!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Toasts */}
        <div className="position-fixed" style={{ top: "20px", right: "20px", zIndex: 9999 }}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </MainLayout>
    )
  }
  
  export default UserProfile