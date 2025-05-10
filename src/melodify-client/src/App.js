import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./pages/Register";



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

          {/* Auth Routes */}
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;