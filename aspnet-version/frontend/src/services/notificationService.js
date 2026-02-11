import axios from 'axios';

const BASE_URL = 'https://localhost:7129';

const notificationService = {
  getNotifications: async () => {
    const response = await axios.get(`${BASE_URL}/api/Notifications`, {
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

  markAllAsRead: async () => {
    const response = await axios.post(`${BASE_URL}/api/Notifications/mark-all-read`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
};

export default notificationService;
