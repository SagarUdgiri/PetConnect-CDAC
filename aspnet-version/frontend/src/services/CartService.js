import axios from 'axios';

const BASE_URL = 'https://localhost:7129/api/Cart';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getCart = async () => {
  const response = await axios.get(`${BASE_URL}/my-cart`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post(`${BASE_URL}/add`, null, {
    params: { productId, quantity },
    headers: getAuthHeader()
  });
  return response.data;
};

export const removeFromCart = async (cartItemId) => {
  const response = await axios.delete(`${BASE_URL}/remove/${cartItemId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const clearCart = async () => {
  const response = await axios.delete(`${BASE_URL}/clear`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const checkout = async (transactionId = '') => {
  const response = await axios.post(`${BASE_URL.replace('/Cart', '/Orders')}/checkout`, null, {
    params: { transactionId },
    headers: getAuthHeader()
  });
  return response.data;
};

const CartService = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  checkout
};

export default CartService;
