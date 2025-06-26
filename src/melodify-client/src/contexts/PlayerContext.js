import { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const resumeSong = () => {
    setIsPlaying(true);
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      const nextSong = queue[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      playSong(nextSong);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const previousSong = queue[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      playSong(previousSong);
    }
  };

  const value = {
    currentSong,
    isPlaying,
    queue,
    currentIndex,
    playSong,
    pauseSong,
    resumeSong,
    playNext,
    playPrevious,
    setQueue
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 