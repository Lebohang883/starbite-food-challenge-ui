import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllChallenges, getLeaderboard } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengesRes, leaderboardRes] = await Promise.all([
          getAllChallenges(),
          getLeaderboard()
        ]);
        setChallenges(challengesRes.data.data);
        setLeaderboard(leaderboardRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>StarBite</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/challenges')}>Challenges</button>
          <button onClick={() => navigate('/submissions')}>Submissions</button>
          <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {user?.username}!</h2>
          <p>You have <strong>{user?.points || 0}</strong> points</p>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <h3>Recent Challenges</h3>
            {challenges.length === 0 ? (
              <p>No challenges yet!</p>
            ) : (
              challenges.slice(0, 3).map((challenge) => (
                <div key={challenge._id} className="challenge-item">
                  <h4>{challenge.title}</h4>
                  <p>{challenge.points} points</p>
                </div>
              ))
            )}
            <button className="btn-primary" onClick={() => navigate('/challenges')}>
              View All Challenges
            </button>
          </div>

          <div className="card">
            <h3>Top Players</h3>
            {leaderboard.slice(0, 5).map((player) => (
              <div key={player.username} className="leaderboard-item">
                <span>#{player.rank} {player.username}</span>
                <span>{player.points} pts</span>
              </div>
            ))}
            <button className="btn-primary" onClick={() => navigate('/leaderboard')}>
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;