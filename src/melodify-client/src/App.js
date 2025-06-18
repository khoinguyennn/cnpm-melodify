import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import AdminDashboard from "./admin/pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import ArtistDetail from "./pages/ArtistDetail";
import AllArtists from './pages/AllArtists';
import AllSongs from './pages/AllSongs';
import Search from './pages/Search';
import FollowedArtists from './pages/FollowedArtists';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import AllPlaylists from './pages/AllPlaylists';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role từ token
  try {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    if (payload.role !== 'Admin') {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Auth Route Component
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route
            path="/forgot"
            element={
              <AuthRoute>
                <ForgotPassword />
              </AuthRoute>
            }
          />

          <Route
            path="/artist/:id"
            element={
              <ProtectedRoute>
                <ArtistDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/artists" element={<AllArtists />} />
          <Route path="/songs" element={<AllSongs />} />
          <Route path="/search" element={<Search />} />
          <Route path="/artist" element={<FollowedArtists />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/playlist" element={<Playlists />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
          <Route path="/playlists" element={<AllPlaylists />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;