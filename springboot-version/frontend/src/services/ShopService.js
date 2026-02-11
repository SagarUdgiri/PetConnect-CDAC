import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/shop';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getAllProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${BASE_URL}/products/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createProduct = async (product) => {
    const response = await axios.post(`${BASE_URL}/products`, product, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await axios.put(`${BASE_URL}/products/${id}`, product, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${BASE_URL}/products/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getAllCategories = async () => {
    const response = await axios.get(`${BASE_URL}/categories`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(`${BASE_URL}/categories`, categoryData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${BASE_URL}/categories/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

const ShopService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  deleteCategory
};

export default ShopService;
