import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await updateUser(user.id, formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <nav className="navbar">
        <img src="/starbite-logo.png" alt="StarBite" className="auth-logo" />
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
           <button onClick={() => navigate('/submissions')}>Submissions</button>
          <button onClick={() => navigate('/challenges')}>Challenges</button>
          <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h2>{user?.username}</h2>
          <p className="profile-role">{user?.role}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user?.points || 0}</span>
              <span className="stat-label">Points</span>
            </div>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {!isEditing ? (
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Username</span>
                <span className="detail-value">{user?.username}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="edit-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;