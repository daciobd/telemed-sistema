import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  specialty?: string;
  licenseNumber?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for demo mode via URL params
    const urlParams = new URLSearchParams(window.location.search);
    const consultationId = urlParams.get('consultationId');
    
    if (consultationId === 'demo') {
      // Mock user for demo mode
      setUser({
        id: 'demo-user',
        email: 'demo@telemed.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'patient'
      });
    } else {
      // Check for real authentication
      // In a real app, this would call an API
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login for demo purposes
    if (email === 'demo@telemed.com') {
      setUser({
        id: 'demo-user',
        email: 'demo@telemed.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'patient'
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
}