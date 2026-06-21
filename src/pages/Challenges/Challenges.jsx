import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChallenges, createChallenge, deleteChallenge } from '../../services/api';
import './Challenges.css';

const Challenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: '',
    deadline: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await getAllChallenges();
      setChallenges(res.data.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createChallenge(formData);
      setShowForm(false);
      setFormData({ title: '', description: '', points: '', deadline: '' });
      fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create challenge');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await deleteChallenge(id);
        fetchChallenges();
      } catch (error) {
        console.error('Error deleting challenge:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="challenges-container">
      <nav className="navbar">
        <h1>StarBite</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
           <button onClick={() => navigate('/submissions')}>Submissions</button>
          <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
        </div>
      </nav>

      <div className="challenges-content">
        <div className="challenges-header">
          <h2>Food Challenges</h2>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Challenge'}
          </button>
        </div>

        {showForm && (
          <div className="challenge-form card">
            <h3>Create New Challenge</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Challenge title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Challenge description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Points</label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  placeholder="Points reward"
                  required
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Create Challenge</button>
            </form>
          </div>
        )}

        <div className="challenges-grid">
          {challenges.length === 0 ? (
            <p>No challenges yet! Create one above.</p>
          ) : (
            challenges.map((challenge) => (
              <div key={challenge._id} className="challenge-card">
                <div className="challenge-header">
                  <h3>{challenge.title}</h3>
                  <span className="points-badge">{challenge.points} pts</span>
                </div>
                <p>{challenge.description}</p>
                {challenge.mealSuggestion && (
                  <p className="meal-suggestion">🍽️ Suggested meal: {challenge.mealSuggestion}</p>
                )}
                <p className="deadline">⏰ Deadline: {new Date(challenge.deadline).toLocaleDateString()}</p>
                <div className="challenge-actions">
                  <button
                    className="btn-submit"
                    onClick={() => navigate('/submissions', { state: { challengeId: challenge._id } })}
                  >
                    Submit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(challenge._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;