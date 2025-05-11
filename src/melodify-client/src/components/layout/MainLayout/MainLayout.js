import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import PlayingBar from '../PlayingBar/PlayingBar';

const MainLayout = ({ children, isSidebarOpen, toggleSidebar, currentSong, isPlaying, onPlayingStateChange }) => {
  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#18122B", color: "white" }}>
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0",
          transition: "margin-left 0.3s",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <div className="flex-grow-1 main-content">
          {children}
        </div>

        {/* Footer */}
        <Footer className={isSidebarOpen ? 'with-sidebar' : ''} />

        {/* PlayingBar */}
        {currentSong && (
          <PlayingBar
            song={currentSong}
            isPlaying={isPlaying}
            onPlayingStateChange={onPlayingStateChange}
            isSidebarOpen={isSidebarOpen}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout; 