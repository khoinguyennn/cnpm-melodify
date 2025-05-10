import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import "./Footer.css";

const Footer = ({ className }) => {
  return (
    <footer className={`footer ${className || ''}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Về Melodify</h3>
          <p>
            Melodify là nền tảng nghe nhạc trực tuyến, mang đến cho bạn những trải nghiệm 
            âm nhạc tuyệt vời nhất. Khám phá, thưởng thức và chia sẻ âm nhạc 
            cùng cộng đồng yêu nhạc.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Liên hệ</h3>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>contact@melodify.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>0987 769 860</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Trà Vinh, Việt Nam</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Theo dõi chúng tôi</h3>
          <p>
            Đăng ký nhận thông tin mới nhất về âm nhạc, sự kiện và ưu đãi đặc biệt từ Melodify.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">
          <img src="/app-asset/img/icon.png" alt="Melodify" />
          <span>Melodify</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Melodify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
