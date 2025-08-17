import { useState, useEffect } from 'react';

export interface AIFeatureFlags {
  AI_ENABLED: boolean;
  AI_SYMPTOMS_ENABLED: boolean;
  AI_ICD_SUGGESTION_ENABLED: boolean;
  AI_DRUG_INTERACTIONS_ENABLED: boolean;
}

export function useAIFeatures() {
  const [features, setFeatures] = useState<AIFeatureFlags>({
    AI_ENABLED: false,
    AI_SYMPTOMS_ENABLED: false,
    AI_ICD_SUGGESTION_ENABLED: false,
    AI_DRUG_INTERACTIONS_ENABLED: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      const response = await fetch('/api/ai-features', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const flags = await response.json();
        setFeatures(flags);
      } else {
        setError('Failed to fetch AI feature flags');
      }
    } catch (err) {
      setError('Error fetching AI features');
      console.error('Error fetching AI features:', err);
    } finally {
      setLoading(false);
    }
  };

  return { features, loading, error, refetch: fetchFeatureFlags };
}

// Hook for AI consent management
export function useAIConsent() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('ai-medical-consent');
    if (consent) {
      const consentData = JSON.parse(consent);
      // Check if consent is still valid (e.g., within 30 days)
      const consentDate = new Date(consentData.timestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (consentDate > thirtyDaysAgo) {
        setHasConsent(true);
      }
    }
  }, []);

  const giveConsent = async () => {
    try {
      const timestamp = new Date().toISOString();
      
      // Log consent on backend
      await fetch('/api/medical/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          consentType: 'AI_MEDICAL_ASSISTANCE',
          timestamp
        })
      });

      // Store consent locally
      const consentData = {
        timestamp,
        version: '1.0',
        type: 'AI_MEDICAL_ASSISTANCE'
      };
      
      localStorage.setItem('ai-medical-consent', JSON.stringify(consentData));
      setHasConsent(true);
    } catch (error) {
      console.error('Failed to log consent:', error);
      throw error;
    }
  };

  const revokeConsent = () => {
    localStorage.removeItem('ai-medical-consent');
    setHasConsent(false);
  };

  return { hasConsent, giveConsent, revokeConsent };
}