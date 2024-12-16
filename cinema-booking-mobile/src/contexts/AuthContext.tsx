import React, { createContext, useState, useContext } from 'react';
import { api, setAuthToken } from '../services/api';
import { AuthResponse, User } from '../types/api.types';

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      console.log('Making request to:', `${api.defaults.baseURL}/auth/login`);
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      console.log('Response received:', response.data);
      const { access_token, user } = response.data;
      setAuthToken(access_token);
      setUser(user);
    } catch (error: any) {
      console.error('Detailed login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken('');
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        login,
        logout,
      }}
    >
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