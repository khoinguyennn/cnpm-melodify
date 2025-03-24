import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-center text-white py-4" style={{ backgroundColor: "#241B3B" }}>
      <div className="d-flex justify-content-center gap-3 mb-2">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
        <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
        <i className="fa-brands fa-x-twitter"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
        <i className="fab fa-instagram"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white">
        <i className="fab fa-youtube"></i>
        </a>
      </div>
      <p className="m-0">&copy; {new Date().getFullYear()} Melodify. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
