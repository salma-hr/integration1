import axios from 'axios';
const API_URL = 'http://localhost:4000/api'; 

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur serveur');
  }
  return response.json();
};

export const productAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/products`);
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/products/${id}`);
    return res.data;
  },

  getBySeller: async (sellerId) => {
    const res = await axios.get(`${API_URL}/products?seller=${sellerId}`);
    return res.data;
  },

  create: async (productData) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/products`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  update: async (id, productData) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  delete: async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};

export const authAPI = {
  register: async (userData) => {
    const res = await axios.post(`${API_URL}/users/signup`, userData);
    return res.data;
  },

  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, userData);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};

export const orderAPI = {
  create: async (orderData) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  getByUser: async (userId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
};