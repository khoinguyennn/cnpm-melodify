import { useState, useEffect } from "react";
import { Music, Users, Mic2, UserCheck, RefreshCw } from "lucide-react";
import { songApi } from "../../services/songApi";
import { userApi } from "../../services/userApi";
import { artistApi } from "../../services/artistApi";

const Overview = () => {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalArtists: 0,
    totalUsers: 0,
    activeUsers: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [songs, artists, users] = await Promise.all([
        songApi.getAll(),
        artistApi.getAll(),
        userApi.getAll()
      ]);

      const activeUsers = users.filter(user => user.isActive).length;

      setStats({
        totalSongs: songs.length,
        totalArtists: artists.length,
        totalUsers: users.length,
        activeUsers: activeUsers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overview p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Dashboard Overview</h2>
        <button 
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={fetchStats}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        {isLoading ? (
          // Loading skeleton
          [...Array(4)].map((_, index) => (
            <div key={index} className="stat-card skeleton">
              <div className="skeleton-text"></div>
              <div className="skeleton-number"></div>
            </div>
          ))
        ) : (
          // Actual stats
          <>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(141, 47, 189, 0.1)' }}>
                <Music size={24} color="#8D2FBD" />
              </div>
              <div>
                <h3>Total Songs</h3>
                <p className="stat-number">{stats.totalSongs}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <Mic2 size={24} color="#3B82F6" />
              </div>
              <div>
                <h3>Total Artists</h3>
                <p className="stat-number">{stats.totalArtists}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                <Users size={24} color="#4CAF50" />
              </div>
              <div>
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>
                <UserCheck size={24} color="#FF4D4D" />
              </div>
              <div>
                <h3>Active Users</h3>
                <p className="stat-number">{stats.activeUsers}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
  
  