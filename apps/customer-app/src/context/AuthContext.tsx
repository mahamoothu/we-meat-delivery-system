import React, { createContext, useContext, useState } from 'react';
import { CustomerUser } from '../types/customer';

interface AuthContextType {
  isLoggedIn: boolean;
  user: CustomerUser | null;
  onboarded: boolean;
  pendingPhone: string;
  login: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completeOnboarding: () => void;
  updateProfile: (data: Partial<CustomerUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [pendingPhone, setPendingPhone] = useState<string>('+919876543210');
  const [user, setUser] = useState<CustomerUser | null>(null);

  const login = async (phoneNumber: string): Promise<boolean> => {
    setPendingPhone(phoneNumber);
    return true;
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; error?: string }> => {
    // Mock OTP verification (123456)
    if (otp.trim() === '123456') {
      const authenticatedUser: CustomerUser = {
        id: 'user_cust_001',
        name: 'Rahul Sharma',
        phoneNumber: pendingPhone || '+919876543210',
        email: 'rahul.sharma@example.com',
      };
      setUser(authenticatedUser);
      setIsLoggedIn(true);
      return { success: true };
    }

    return { success: false, error: 'Invalid OTP. Please enter 123456 to test.' };
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const completeOnboarding = () => {
    setOnboarded(true);
  };

  const updateProfile = (data: Partial<CustomerUser>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        onboarded,
        pendingPhone,
        login,
        verifyOtp,
        logout,
        completeOnboarding,
        updateProfile,
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
