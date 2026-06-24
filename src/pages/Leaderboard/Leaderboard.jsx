import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard();
      setLeaderboard(res.data.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leaderboard-container">
      <nav className="navbar">
        <img src="/starbite-logo.png" alt="StarBite" className="auth-logo" />
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
           <button onClick={() => navigate('/submissions')}>Submissions</button>
          <button onClick={() => navigate('/challenges')}>Challenges</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
        </div>
      </nav>

      <div className="leaderboard-content">
        <h2>Leaderboard</h2>
        <p className="subtitle">Top StarBite challengers</p>

        <div className="leaderboard-list">
          {leaderboard.length === 0 ? (
            <p>No rankings yet!</p>
          ) : (
            leaderboard.map((player) => (
              <div
                key={player.username}
                className={`leaderboard-row ${player.username === user?.username ? 'highlight' : ''}`}
              >
                <span className="rank">{getMedal(player.rank)}</span>
                <span className="username">{player.username}</span>
                <span className="points">{player.points} pts</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;