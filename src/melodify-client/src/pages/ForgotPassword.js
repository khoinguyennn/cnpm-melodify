import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { useEffect } from "react";

const inputStyle = {
  backgroundColor: '#2F284B',
  color: 'white',
  border: 'none',
  padding: '10px',
};

const placeholderStyle = `
  input::placeholder {
    color: white !important;
    opacity: 1;
  }
`;

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Quên mật khẩu - Melodify";
  }, []);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yêu cầu đặt lại mật khẩu cho:", email);
    // Gọi API gửi email đặt lại mật khẩu ở đây
  };

  return (
    <>
      <style>{placeholderStyle}</style>

      <div 
        className="d-flex align-items-center justify-content-center" 
        style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#18122B' }}>
        
        <div className="card p-4" style={{ backgroundColor: '#241B3B', borderRadius: '10px', width: '400px' }}>
          <h2 className="text-center mb-4 text-white">Quên mật khẩu</h2>
          <p className="text-center text-white mb-4">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Email" 
                style={inputStyle} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn btn-danger w-100 mb-3" style={{ backgroundColor: '#8D2FBD', border: 'none' }}>
              Gửi yêu cầu
            </button>
          </form>
          <p className="text-center text-white">
          <Link to="/login" className="text-decoration-none text-white">Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
