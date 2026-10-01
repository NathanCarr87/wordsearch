/**
 * Configurable animation profiles based on educational grade levels.
 * Controls interaction feedback intensity, particle counts, scales, and timing
 * to ensure visuals scale seamlessly from Kindergarten to Collegiate levels.
 */

export const ANIMATION_PROFILES = {
  kindergarten: {
    intensity: 'playful',
    shakeIntensity: 6, // max horizontal px offset
    shakeDuration: 220, // ms
    particleAmount: 35,
    popScale: 1.2,
    wordListScale: 1.15,
    celebrationParticleCount: 120,
    celebrationSpread: 80,
    colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'],
    showSparkles: true,
  },
  grade1: {
    intensity: 'playful',
    shakeIntensity: 5,
    shakeDuration: 200,
    particleAmount: 30,
    popScale: 1.18,
    wordListScale: 1.12,
    celebrationParticleCount: 100,
    celebrationSpread: 75,
    colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'],
    showSparkles: true,
  },
  grade2: {
    intensity: 'playful',
    shakeIntensity: 5,
    shakeDuration: 200,
    particleAmount: 25,
    popScale: 1.15,
    wordListScale: 1.10,
    celebrationParticleCount: 90,
    celebrationSpread: 70,
    colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'],
    showSparkles: true,
  },
  grade3: {
    intensity: 'balanced',
    shakeIntensity: 4,
    shakeDuration: 180,
    particleAmount: 20,
    popScale: 1.12,
    wordListScale: 1.08,
    celebrationParticleCount: 70,
    celebrationSpread: 65,
    colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
    showSparkles: true,
  },
  grade4: {
    intensity: 'balanced',
    shakeIntensity: 4,
    shakeDuration: 180,
    particleAmount: 18,
    popScale: 1.10,
    wordListScale: 1.07,
    celebrationParticleCount: 60,
    celebrationSpread: 60,
    colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
    showSparkles: true,
  },
  grade5: {
    intensity: 'balanced',
    shakeIntensity: 3.5,
    shakeDuration: 160,
    particleAmount: 15,
    popScale: 1.08,
    wordListScale: 1.06,
    celebrationParticleCount: 50,
    celebrationSpread: 55,
    colors: ['#4f46e5', '#059669', '#d97706', '#2563eb'],
    showSparkles: false,
  },
  grade6: {
    intensity: 'subtle',
    shakeIntensity: 3,
    shakeDuration: 150,
    particleAmount: 12,
    popScale: 1.06,
    wordListScale: 1.05,
    celebrationParticleCount: 40,
    celebrationSpread: 50,
    colors: ['#4f46e5', '#059669', '#2563eb', '#64748b'],
    showSparkles: false,
  },
  college: {
    intensity: 'subtle',
    shakeIntensity: 2.5,
    shakeDuration: 140,
    particleAmount: 8,
    popScale: 1.05,
    wordListScale: 1.04,
    celebrationParticleCount: 30,
    celebrationSpread: 45,
    colors: ['#6366f1', '#0ea5e9', '#64748b'],
    showSparkles: false,
  }
};

export const DEFAULT_ANIMATION_PROFILE = ANIMATION_PROFILES.grade3;

/**
 * Returns the corresponding animation profile for a given grade key.
 * Falls back cleanly to DEFAULT_ANIMATION_PROFILE if key is unknown.
 */
export function getAnimationProfile(gradeKey) {
  if (!gradeKey) return DEFAULT_ANIMATION_PROFILE;

  // Handle keys like 'grade6' or 'grade6+'
  const normalizedKey = String(gradeKey).toLowerCase().replace(/\+/g, '').trim();

  return ANIMATION_PROFILES[normalizedKey] || DEFAULT_ANIMATION_PROFILE;
}
