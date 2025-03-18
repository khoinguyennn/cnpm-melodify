import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import "./Toast.css";

const Toast = ({ message, type = "success", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tăng thời gian hiển thị lên 3 giây
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <div className="toast-content">
        {type === 'success' ? (
          <CheckCircle size={24} color="#4CAF50" />
        ) : (
          <AlertCircle size={24} color="#F44336" />
        )}
        <span className="ms-2">{message}</span>
      </div>
      <button 
        className="btn-close btn-close-white"
        onClick={handleClose}
      />
    </div>
  );
};

export default Toast;