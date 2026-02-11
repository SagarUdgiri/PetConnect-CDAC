import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/Follows';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

const followService = {
  followUser: async (followingId) => {
    const response = await axios.post(`${BASE_URL}/follow/${followingId}`, {}, getAuthHeaders());
    return response.data;
  },

  unfollowUser: async (followingId) => {
    const response = await axios.post(`${BASE_URL}/unfollow/${followingId}`, {}, getAuthHeaders());
    return response.data;
  },

  isFollowing: async (followingId) => {
    const response = await axios.get(`${BASE_URL}/is-following/${followingId}`, getAuthHeaders());
    return response.data.status; // Returns "PENDING", "ACCEPTED", or "NONE"
  },

  getSuggestions: async (limit) => {
    const response = await axios.get(`${BASE_URL}/suggestions`, {
      ...getAuthHeaders(),
      params: limit ? { limit } : {}
    });
    return response.data;
  },

  acceptRequest: async (followerId) => {
    const response = await axios.post(`${BASE_URL}/accept-request/${followerId}`, {}, getAuthHeaders());
    return response.data;
  },

  getConnections: async () => {
    const response = await axios.get(`${BASE_URL}/connections`, getAuthHeaders());
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await axios.get(`${BASE_URL}/pending-requests`, getAuthHeaders());
    return response.data;
  },

  cancelRequest: async (followingId) => {
    const response = await axios.post(`${BASE_URL}/cancel-request/${followingId}`, {}, getAuthHeaders());
    return response.data;
  },
  searchUsers: async (query) => {
    const response = await axios.get(`${BASE_URL}/search`, {
      ...getAuthHeaders(),
      params: { q: query }
    });
    return response.data;
  },
};

export default followService;
