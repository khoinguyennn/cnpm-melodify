"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Mic2, Link, Heart } from "lucide-react"
import { songApi } from '../../../services/songApi'
import { useAuth } from '../../../contexts/AuthContext'
import "./PlayingBar.css"

const PlayingBar = ({ song, isSidebarOpen, onPlayingStateChange, isPlaying: parentIsPlaying }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setIsPlaying(parentIsPlaying)
    if (audioRef.current) {
      if (parentIsPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [parentIsPlaying])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
        audio.play()
        setIsPlaying(true)
        onPlayingStateChange(true)
      }

      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        onPlayingStateChange(false)
      }

      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleEnded)

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [song, onPlayingStateChange])

  useEffect(() => {
    if (song && user) {
      checkFavoriteStatus()
    }
  }, [song, user])

  const checkFavoriteStatus = async () => {
    try {
      const status = await songApi.isFavorite(song.songID)
      setIsFavorite(status)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleFavorite = async () => {
    if (!song || !user) {
      alert('Vui lòng đăng nhập để thêm bài hát vào yêu thích!')
      return
    }
    
    try {
      if (isFavorite) {
        await songApi.unfavorite(song.songID)
        setIsFavorite(false)
      } else {
        await songApi.favorite(song.songID)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert(error.message || 'Có lỗi xảy ra khi thao tác với bài hát yêu thích!')
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
      onPlayingStateChange(!isPlaying)
    }
  }

  const handleProgressChange = (e) => {
    const newTime = (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * duration
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseInt(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
    e.target.style.setProperty('--volume-percentage', `${newVolume}%`)
  }

  useEffect(() => {
    const volumeSlider = document.querySelector('.volume-slider')
    if (volumeSlider) {
      volumeSlider.style.setProperty('--volume-percentage', `${volume}%`)
    }
  }, [])

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className={`playing-bar ${isSidebarOpen ? 'with-sidebar' : ''}`}>
      <audio ref={audioRef} src={`${process.env.REACT_APP_BACKEND_URL}${song.url}`} />

      <div className="song-info">
        <img 
          src={`${process.env.REACT_APP_BACKEND_URL}${song.imageUrl}` || "/placeholder.svg"} 
          alt={song.title} 
          className="cover-art" 
        />
        <div className="song-details">
          <div className="song-title">{song.title}</div>
          <div className="song-artist">{song.artistName}</div>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button className="control-btn">
            <Shuffle size={18} />
          </button>
          <button className="control-btn">
            <SkipBack size={20} />
          </button>
          <button className="control-btn play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="control-btn">
            <SkipForward size={20} />
          </button>
          <button className="control-btn">
            <Repeat size={18} />
          </button>
        </div>

        <div className="progress-container">
          <span className="time-current">{formatTime(currentTime)}</span>
          <div className="progress-bar" ref={progressRef} onClick={handleProgressChange}>
            <div className="progress-filled" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          </div>
          <span className="time-total">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="extra-controls">
        <button 
          className="control-btn"
          onClick={handleFavorite}
          title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart 
            size={18} 
            fill={isFavorite ? "currentColor" : "none"}
            className={isFavorite ? "text-danger" : ""}
          />
        </button>
        <button className="control-btn">
          <Link size={18} />
        </button>
        <button className="control-btn">
          <Mic2 size={18} />
        </button>
        <div className="volume-control">
          <Volume2 size={18} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  )
}

export default PlayingBar

