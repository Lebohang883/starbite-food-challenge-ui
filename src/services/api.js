import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//Automatically attach JWT token ro every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;       
    }
    return config;
});

//Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

//Users
export const getAllUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

//Challenges
export const getAllChallenges = () => API.get('/challenges');
export const createChallenge = (data) => API.post('/challenges', data);
export const updateChallenge = (id, data) => API.put(`/challenges/${id}`, data);
export const deleteChallenge = (id) => API.delete(`/challenges/${id}`);

//Submissions
export const createSubmission = (data) => API.post('/submissions', data);
export const getAllSubmissions = () => API.get('/submissions');
export const approveSubmission = (id, data) => API.patch(`/submissions/${id}/approve`, data);

//Leaderboard
export const getLeaderboard = () => API.get('/leaderboard');

export default API;