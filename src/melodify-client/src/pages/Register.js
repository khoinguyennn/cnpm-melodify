import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from "react-router-dom"
import InputField from "../components/InputField"
import ButtonCustom from "../components/ButtonCustom"
import AuthCard from "../components/AuthCard"
import Toast from "../components/Toast"

const placeholderStyle = `
  input::placeholder {
    color: white !important;
    opacity: 1;
  }
`

const Register = () => {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    document.title = "Đăng ký - Melodify"
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

    // Kiểm tra form
    if (!displayName || !email || !password || !confirmPassword) {
      addToast("Vui lòng điền đầy đủ thông tin!", "error")
      return
    }

    if (password !== confirmPassword) {
      addToast("Mật khẩu xác nhận không khớp!", "error")
      return
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      addToast("Email không hợp lệ!", "error")
      return
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      addToast("Mật khẩu phải có ít nhất 6 ký tự!", "error")
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch("https://localhost:7153/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi đăng ký!")
      }

      addToast(data.message || "Đăng ký thành công!", "success")

      // Chuyển về trang đăng nhập sau 1.5 giây
      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (error) {
      console.error("Register error:", error)
      addToast(error.message || "Có lỗi xảy ra khi đăng ký!", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{placeholderStyle}</style>

      <div 
        className="d-flex align-items-center justify-content-end" 
        style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#18122B', paddingRight: '10%' }}>

        <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
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

        <AuthCard title="Đăng ký">
          <p className="text-center text-white mb-4">
            Tạo tài khoản mới bằng email của bạn
          </p>

          <form onSubmit={handleSubmit}>
            <InputField 
              type="text" 
              placeholder="Tên hiển thị" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
            />
            <InputField 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <InputField 
              type="password" 
              placeholder="Mật khẩu" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <InputField 
              type="password" 
              placeholder="Xác nhận mật khẩu" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />

            <ButtonCustom 
              text={isLoading ? "Đang đăng ký..." : "Đăng ký"} 
              type="submit" 
              className="btn-danger" 
              style={{ backgroundColor: '#8D2FBD' }}
              disabled={isLoading}
            />

            <ButtonCustom 
              text="Đăng ký bằng Google" 
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
          </form>

          <p className="text-center text-white">
            Đã có tài khoản? <Link to="/login" className="text-decoration-none text-white">Đăng nhập</Link>
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

export default Register
