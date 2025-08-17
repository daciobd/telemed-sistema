import { useState, useEffect } from 'react';

export const useAIFeatures = () => {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [aiConsent, setAiConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if AI consent was previously given
    const savedConsent = localStorage.getItem('ai_consent');
    if (savedConsent) {
      setAiConsent(savedConsent === 'true');
    }
  }, []);

  const grantConsent = () => {
    setAiConsent(true);
    localStorage.setItem('ai_consent', 'true');
  };

  const revokeConsent = () => {
    setAiConsent(false);
    localStorage.setItem('ai_consent', 'false');
  };

  return {
    isAIEnabled,
    aiConsent,
    grantConsent,
    revokeConsent,
    hasConsent: aiConsent === true
  };
};

export const useAIConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem('ai_consent');
    setHasConsent(savedConsent === 'true');
  }, []);

  const grantConsent = () => {
    setHasConsent(true);
    localStorage.setItem('ai_consent', 'true');
  };

  const revokeConsent = () => {
    setHasConsent(false);
    localStorage.setItem('ai_consent', 'false');
  };

  return {
    hasConsent,
    grantConsent,
    revokeConsent
  };
};