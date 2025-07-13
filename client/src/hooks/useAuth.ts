import { useState, useEffect } from 'react';

// Mock auth hook for demonstration
// In a real implementation, this would connect to your authentication system
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'patient' | 'doctor' | 'admin';
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const mockUser: User = {
      id: 'demo-patient-1',
      email: 'demo@patient.com',
      firstName: 'João',
      lastName: 'Silva',
      role: 'patient',
      hasCompletedOnboarding: false, // Set to false to trigger onboarding
      onboardingStep: 0,
    };

    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const logout = () => {
    setUser(null);
    // In real implementation, clear tokens, etc.
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}