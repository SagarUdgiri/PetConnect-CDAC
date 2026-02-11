import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const notificationService = {
  getNotifications: async (userId) => {
    const response = await axios.get(`${BASE_URL}/api/Notifications/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.post(`${BASE_URL}/api/Notifications/mark-read/${notificationId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  markAllAsRead: async (userId) => {
    const response = await axios.post(`${BASE_URL}/api/Notifications/mark-all-read/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
};

export default notificationService;
