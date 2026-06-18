import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Challenges from './pages/Challenges/Challenges';
import Submissions from './pages/Submissions/Submissions';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
    } />
    <Route path="/challenges" element={
      <ProtectedRoute>
        <Challenges />
      </ProtectedRoute>
    } />
    <Route path="/submissions" element={
      <ProtectedRoute>
        <Submissions />
      </ProtectedRoute>
    } />
    <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;