import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage';

const router = Router();

// Complete onboarding endpoint
const completeOnboardingSchema = z.object({
  userId: z.string(),
});

router.post('/users/complete-onboarding', async (req, res) => {
  try {
    const { userId } = completeOnboardingSchema.parse(req.body);

    // Update user onboarding status
    await storage.updateUserOnboarding(userId, {
      hasCompletedOnboarding: true,
      onboardingStep: 0,
    });

    res.json({ 
      success: true, 
      message: 'Onboarding completed successfully' 
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to complete onboarding' 
    });
  }
});

// Update onboarding step
const updateStepSchema = z.object({
  userId: z.string(),
  step: z.number(),
});

router.post('/users/update-onboarding-step', async (req, res) => {
  try {
    const { userId, step } = updateStepSchema.parse(req.body);

    await storage.updateUserOnboarding(userId, {
      onboardingStep: step,
    });

    res.json({ 
      success: true, 
      message: 'Onboarding step updated' 
    });
  } catch (error) {
    console.error('Error updating onboarding step:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update onboarding step' 
    });
  }
});

// Reset onboarding
router.post('/users/reset-onboarding', async (req, res) => {
  try {
    const { userId } = completeOnboardingSchema.parse(req.body);

    await storage.updateUserOnboarding(userId, {
      hasCompletedOnboarding: false,
      onboardingStep: 0,
    });

    res.json({ 
      success: true, 
      message: 'Onboarding reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting onboarding:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset onboarding' 
    });
  }
});

export default router;