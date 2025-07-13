import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface OnboardingState {
  isWelcomeModalVisible: boolean;
  isTourActive: boolean;
  hasCompletedOnboarding: boolean;
  currentStep: number;
}

export function useOnboarding() {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isWelcomeModalVisible: false,
    isTourActive: false,
    hasCompletedOnboarding: false,
    currentStep: 0,
  });

  useEffect(() => {
    if (user && !user.hasCompletedOnboarding) {
      // Check localStorage to avoid showing multiple times in same session
      const hasSeenWelcome = localStorage.getItem(`welcome-seen-${user.id}`);
      
      if (!hasSeenWelcome) {
        setOnboardingState(prev => ({
          ...prev,
          isWelcomeModalVisible: true,
          hasCompletedOnboarding: false,
        }));
      }
    } else if (user?.hasCompletedOnboarding) {
      setOnboardingState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
      }));
    }
  }, [user]);

  const startTour = () => {
    localStorage.setItem(`welcome-seen-${user?.id}`, 'true');
    setOnboardingState(prev => ({
      ...prev,
      isWelcomeModalVisible: false,
      isTourActive: true,
    }));
  };

  const skipWelcome = () => {
    localStorage.setItem(`welcome-seen-${user?.id}`, 'true');
    setOnboardingState(prev => ({
      ...prev,
      isWelcomeModalVisible: false,
    }));
  };

  const completeTour = async () => {
    setOnboardingState(prev => ({
      ...prev,
      isTourActive: false,
      hasCompletedOnboarding: true,
    }));

    // Mark onboarding as completed in the backend
    if (user) {
      try {
        await fetch('/api/users/complete-onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch (error) {
        console.error('Failed to update onboarding status:', error);
      }
    }
  };

  const skipTour = () => {
    setOnboardingState(prev => ({
      ...prev,
      isTourActive: false,
    }));
  };

  const resetOnboarding = () => {
    if (user) {
      localStorage.removeItem(`welcome-seen-${user.id}`);
    }
    setOnboardingState({
      isWelcomeModalVisible: true,
      isTourActive: false,
      hasCompletedOnboarding: false,
      currentStep: 0,
    });
  };

  return {
    ...onboardingState,
    startTour,
    skipWelcome,
    completeTour,
    skipTour,
    resetOnboarding,
    userType: user?.role as 'doctor' | 'patient' | undefined,
    userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : undefined,
  };
}