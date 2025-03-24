"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"
import "./Login.css"
import InputField from "../components/common/Input/InputField"
import ButtonCustom from "../components/common/Button/ButtonCustom"
import AuthCard from "../components/ui/AuthCard/AuthCard"
import Toast from "../components/common/Toast/Toast"
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../services/authApi'

const inputStyle = {
  backgroundColor: "#2F284B",
  color: "white",
  border: "none",
  padding: "10px",
}

const placeholderStyle = `
  input::placeholder {
    color: white !important;
    opacity: 1;
  }
`

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuth()
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    document.title = "Đăng nhập - Melodify"
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      addToast("Vui lòng nhập đầy đủ thông tin!", "error")
      return
    }

    try {
      setIsLoading(true)

      const data = await authApi.login(email, password);
      localStorage.setItem("token", data.token);

      const tokenParts = data.token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      
      const userData = await authApi.getUserInfo(payload.unique_name, data.token);
      setUser(userData);

      addToast(data.message || "Đăng nhập thành công!", "success");

      setTimeout(() => {
        navigate("/")
      }, 1500)

    } catch (error) {
      console.error("Login error:", error)
      addToast(error.message || "Có lỗi xảy ra khi đăng nhập!", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{placeholderStyle}</style>

      <div
        className="d-flex align-items-center justify-content-end"
        style={{ minHeight: "100vh", width: "100vw", backgroundColor: "#18122B", paddingRight: "10%" }}
      >
        <div style={{ position: "absolute", top: "20px", left: "20px" }}>
          <img src="/app-asset/img/logo.png" alt="Logo" width="200" />
        </div>

        <div
          className="d-flex justify-content-center align-items-center flex-grow-1 d-none d-md-flex"
          style={{ width: "50%", height: "100vh" }}
        >
          <img
            src="/app-asset/img/flat-background-world-music-day-celebration.png"
            alt="Music Illustration"
            style={{ width: "70%", maxWidth: "70%", height: "auto", objectFit: "contain" }}
          />
        </div>

        <AuthCard title="Đăng nhập">
          <p className="text-center text-white mb-4">Đăng nhập với email và mật khẩu của bạn</p>
          <form onSubmit={handleSubmit}>
            <InputField 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="bi bi-eye-fill"
              disabled={isLoading}
            />
            <p className="text-white mb-4" align="right">
              <Link to="/forgot" className="text-decoration-none text-white">
                Quên mật khẩu?
              </Link>
            </p>
            <ButtonCustom
              text={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              type="submit"
              className="btn-danger"
              style={{ backgroundColor: "#8D2FBD" }}
              disabled={isLoading}
            />
          </form>
          <ButtonCustom
            text="Đăng nhập bằng Google"
            className="btn-light d-flex align-items-center justify-content-center"
            disabled={isLoading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width="20"
              className="me-2"
            />
          </ButtonCustom>
          <p className="text-center text-white">
            Không có tài khoản?{" "}
            <Link to="/register" className="text-decoration-none text-white">
              Đăng ký
            </Link>
          </p>
        </AuthCard>
      </div>

      <div 
        className="position-fixed"
        style={{
          top: "20px",
          right: "20px",
          zIndex: 9999
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  )
}

export default Login

