import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createSubmission, getAllSubmissions, approveSubmission } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Submissions.css';

const Submissions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    challengeId: location.state?.challengeId || '',
    notes: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await getAllSubmissions();
      setSubmissions(res.data.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
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
      await createSubmission(formData);
      setShowForm(false);
      setFormData({ challengeId: '', notes: '' });
      fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit');
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await approveSubmission(id, { status });
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="submissions-container">
      <nav className="navbar">
        <h1>StarBite</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/challenges')}>Challenges</button>
          <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
        </div>
      </nav>

      <div className="submissions-content">
        <div className="submissions-header">
          <h2>Submissions</h2>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Submission'}
          </button>
        </div>

        {showForm && (
          <div className="submission-form card">
            <h3>Submit a Challenge</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Challenge ID</label>
                <input
                  type="text"
                  name="challengeId"
                  value={formData.challengeId}
                  onChange={handleChange}
                  placeholder="Enter challenge ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Describe how you completed the challenge"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Submit</button>
            </form>
          </div>
        )}

        <div className="submissions-list">
          {submissions.length === 0 ? (
            <p>No submissions yet!</p>
          ) : (
            submissions.map((submission) => (
              <div key={submission._id} className="submission-card">
                <div className="submission-header">
                  <h3>{submission.challengeId?.title || 'Challenge'}</h3>
                  <span className={`status-badge status-${submission.status}`}>
                    {submission.status}
                  </span>
                </div>
                <p><strong>Submitted by:</strong> {submission.userId?.username}</p>
                <p><strong>Notes:</strong> {submission.notes}</p>
                <p><strong>Points:</strong> {submission.challengeId?.points} pts</p>
                {user?.role === 'admin' && submission.status === 'pending' && (
                  <div className="submission-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(submission._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleApprove(submission._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;