import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  enable2FA: () => Promise<string>; // Returns QR code URL
  verify2FA: (token: string) => Promise<void>;
  disable2FA: (token: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('cryptovest_user');
      const storedToken = localStorage.getItem('cryptovest_token');
      
      if (storedUser && storedToken) {
        // Validate token with backend (simulated)
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      localStorage.removeItem('cryptovest_user');
      localStorage.removeItem('cryptovest_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication
      if (email === 'demo@cryptovest.com' && password === 'demo123') {
        const userData: User = {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          avatar: undefined,
          createdAt: new Date().toISOString(),
        };
        
        const token = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('cryptovest_user', JSON.stringify(userData));
        localStorage.setItem('cryptovest_token', token);
        
        setUser(userData);
      } else if (email === 'admin@cryptovest.com' && password === 'admin123') {
        const userData: User = {
          id: 'admin',
          email,
          firstName: 'Admin',
          lastName: 'User',
          avatar: undefined,
          createdAt: new Date().toISOString(),
        };
        
        const token = 'mock_admin_token_' + Date.now();
        
        localStorage.setItem('cryptovest_user', JSON.stringify(userData));
        localStorage.setItem('cryptovest_token', token);
        
        setUser(userData);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: Math.random().toString(36),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
      };
      
      const token = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('cryptovest_user', JSON.stringify(newUser));
      localStorage.setItem('cryptovest_token', token);
      
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cryptovest_user');
    localStorage.removeItem('cryptovest_token');
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('cryptovest_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password reset email sent to:', email);
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email verified with token:', token);
    } catch (error) {
      throw error;
    }
  };

  const enable2FA = async (): Promise<string> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Return mock QR code URL
      return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=cryptovest-2fa-secret';
    } catch (error) {
      throw error;
    }
  };

  const verify2FA = async (token: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('2FA enabled with token:', token);
    } catch (error) {
      throw error;
    }
  };

  const disable2FA = async (token: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('2FA disabled with token:', token);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    verifyEmail,
    enable2FA,
    verify2FA,
    disable2FA,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};