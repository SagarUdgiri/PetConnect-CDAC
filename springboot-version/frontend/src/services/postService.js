import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const postService = {
  getFeed: async (userId) => {
    const response = await axios.get(`${BASE_URL}/api/Posts/feed?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  getPost: async (postId) => {
    const response = await axios.get(`${BASE_URL}/api/Posts/get/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  createPost: async (postData) => {
    const response = await axios.post(`${BASE_URL}/api/Posts/create`, postData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  toggleLike: async (likeData) => {
    const response = await axios.post(`${BASE_URL}/api/Posts/like`, likeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  getComments: async (postId) => {
    const response = await axios.get(`${BASE_URL}/api/Posts/${postId}/getcomments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  addComment: async (postId, commentData) => {
    const response = await axios.post(`${BASE_URL}/api/Posts/${postId}/addcomment`, commentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  isLiked: async (postId, userId) => {
    const response = await axios.get(`${BASE_URL}/api/Posts/${postId}/isliked?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
  
  getUserPosts: async () => {
    const response = await axios.get(`${BASE_URL}/api/Posts/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  updatePost: async (postId, postData) => {
    const response = await axios.put(`${BASE_URL}/api/Posts/${postId}`, postData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
  
  deletePost: async (postId, userId) => {
    const response = await axios.delete(`${BASE_URL}/api/Posts/${postId}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
};

export default postService;
