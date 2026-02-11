import axios from 'axios';
const BASE_URL = 'http://localhost:8080';

// GET ALL USERS (Admin only)
export const getAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin-users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// GET USER BY ID (Admin only)
export const getUserById = async (id) => {
  const response = await axios.get(`${BASE_URL}/api/admin-users/u/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// DELETE USER (Admin only)
export const deleteUser = async (id) => {
  const response = await axios.delete(`${BASE_URL}/api/admin-users/u/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// GET NEARBY USERS
export const getNearbyUsers = async (userLat, userLong, radiusKm = 10) => {
  const response = await axios.get(`${BASE_URL}/api/users/nearby-users`, {
    params: {
      userLat,
      userLong,
      radiusKm,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

const userService = {
  getAllUsers,
  getUserById,
  deleteUser,
  getNearbyUsers,
};

export default userService;
