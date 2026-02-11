import axios from 'axios';

const BASE_URL = 'https://localhost:7129';

// LOGIN
export const login = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
  return response.data;
};

// VERIFY OTP
export const verifyOtp = async (email, otp) => {
  const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp });
  return response.data;
};

// REGISTER
export const register = async (userData) => {
  const payload = {
    fullName: userData.full_name,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    imageUrl: userData.imageUrl || '',
    bio: userData.bio || '',
    latitude: userData.latitude || '',
    longitude: userData.longitude || ''
  };

  const response = await axios.post(`${BASE_URL}/api/auth/register`, payload);
  return response.data;
};

const authService = {
  login,
  verifyOtp,
  register,
  getUserById: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default authService;
