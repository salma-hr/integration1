import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, productAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        console.log('User connected:', user); // Debug log
        
        // Charger les produits selon le rôle
        if (user.role === 'seller') {
          try {
            const sellerProducts = await productAPI.getBySeller(user._id);
            setProducts(sellerProducts);
          } catch (productError) {
            console.warn('Could not load seller products:', productError);
          }
        } else {
          try {
            const allProducts = await productAPI.getAll();
            setProducts(allProducts);
          } catch (productError) {
            console.warn('Could not load products:', productError);
          }
        }
      } else {
        // Si pas de token ou données utilisateur, nettoyer
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authAPI.login({ email, password });
      
      console.log('Login successful:', result);

      if (!result || !result.token || !result._id) {
        throw new Error('Invalid response from server');
      }

      // Créer l'objet user depuis la réponse
      const user = {
        _id: result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role
      };

      // Stocker dans localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('userData', JSON.stringify(user));
      setCurrentUser(user);

      // Charger les produits
      if (user.role === 'seller') {
        try {
          const sellerProducts = await productAPI.getBySeller(user._id);
          setProducts(sellerProducts);
        } catch (productError) {
          console.warn('Could not load seller products:', productError);
        }
      } else {
        try {
          const allProducts = await productAPI.getAll();
          setProducts(allProducts);
        } catch (productError) {
          console.warn('Could not load products:', productError);
        }
      }

      return { success: true, user };

    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || error.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authAPI.register(userData);
      
      console.log('Signup successful:', result);
      
      if (!result || !result.token || !result._id) {
        throw new Error('Invalid response from server');
      }

      // Créer l'objet user depuis la réponse
      const user = {
        _id: result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role
      };
      
      // Stocker dans localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('userData', JSON.stringify(user));
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.error || error.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setProducts([]);
    setError(null);
    console.log('User logged out');
  };

  // Les autres fonctions restent les mêmes...
  const addProduct = async (productData) => {
    try {
      setError(null);
      const newProduct = await productAPI.create(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add product';
      setError(message);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setError(null);
      const updatedProduct = await productAPI.update(id, productData);
      setProducts(prev => prev.map(p => 
        p._id === id ? updatedProduct : p
      ));
      return updatedProduct;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update product';
      setError(message);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      setError(null);
      await productAPI.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete product';
      setError(message);
      throw error;
    }
  };

  const refreshProducts = async () => {
    try {
      if (currentUser?.role === 'seller') {
        const sellerProducts = await productAPI.getBySeller(currentUser._id);
        setProducts(sellerProducts);
      } else {
        const allProducts = await productAPI.getAll();
        setProducts(allProducts);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to refresh products';
      setError(message);
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    error,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    orders: [],
    transactions: [],
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};