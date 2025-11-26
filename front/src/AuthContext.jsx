import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const mockLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation de validation basique
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }

        let userData;
        if (email.includes('admin')) {
          userData = { 
            id: 1, 
            name: 'Admin User', 
            email: email, 
            role: 'admin',
            points: 5000
          };
        } else if (email.includes('seller')) {
          userData = { 
            id: 2, 
            name: 'Seller User', 
            email: email, 
            role: 'seller',
            points: 1000
          };
        } else {
          userData = { 
            id: 3, 
            name: 'Buyer User', 
            email: email, 
            role: 'buyer',
            points: 500
          };
        }
        login(userData);
        resolve(userData);
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      mockLogin,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};