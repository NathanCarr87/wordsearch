import { describe, it, expect } from 'vitest';
import { getAnimationProfile, ANIMATION_PROFILES, DEFAULT_ANIMATION_PROFILE } from '../utils/animationProfiles';

describe('Animation Profiles Utility', () => {
  it('should return correct profile for kindergarten', () => {
    const profile = getAnimationProfile('kindergarten');
    expect(profile.intensity).toBe('playful');
    expect(profile.particleAmount).toBeGreaterThan(30);
    expect(profile.showSparkles).toBe(true);
  });

  it('should return balanced profile for grade3', () => {
    const profile = getAnimationProfile('grade3');
    expect(profile.intensity).toBe('balanced');
  });

  it('should return subtle profile for grade6', () => {
    const profile = getAnimationProfile('grade6');
    expect(profile.intensity).toBe('subtle');
  });

  it('should handle grade keys with plus or mixed case', () => {
    const profile1 = getAnimationProfile('grade6+');
    const profile2 = getAnimationProfile('GRADE6');
    expect(profile1.intensity).toBe('subtle');
    expect(profile2.intensity).toBe('subtle');
  });

  it('should fall back to default profile for unknown grade keys', () => {
    const profile = getAnimationProfile('unknown_grade');
    expect(profile).toBe(DEFAULT_ANIMATION_PROFILE);
  });
});
