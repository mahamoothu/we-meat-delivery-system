import React, { createContext, useContext, useState } from 'react';
import { ShopOwnerUser } from '../types/shop';

interface AuthContextType {
  isLoggedIn: boolean;
  user: ShopOwnerUser | null;
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: ShopOwnerUser = {
  id: 'usr_owner_001',
  name: 'Rajesh Kumar (Partner Store Owner)',
  phoneNumber: '+91 98450 99881',
  storeId: 'SHOP-BLR-001',
  role: 'SHOP_OWNER',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<ShopOwnerUser | null>(null);

  const login = async (phoneNumber: string) => {
    // Mock login step - stores temporary phone number
    setUser({
      ...MOCK_USER,
      phoneNumber,
    });
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    if (otp === '123456') {
      setIsLoggedIn(true);
      setUser(prev => prev || MOCK_USER);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid OTP. Please enter mock test code: 123456',
    };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
