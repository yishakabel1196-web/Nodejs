import { useState, useEffect } from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (progress: BadgeProgress) => boolean;
}

export interface BadgeProgress {
  completedDays: number[];
  currentStreak: number;
  longestStreak: number;
}

const BADGES_STORAGE_KEY = 'daily-routes-badges';

export const ALL_BADGES: Badge[] = [
  // Streak badges
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: (progress) => progress.longestStreak >= 7
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🔥🔥',
    requirement: (progress) => progress.longestStreak >= 30
  },
  {
    id: 'streak-100',
    name: 'Century Coder',
    description: 'Maintain a 100-day streak',
    icon: '🔥🔥🔥',
    requirement: (progress) => progress.longestStreak >= 100
  },

  // Achievement badges
  {
    id: 'first-route',
    name: 'First Route',
    description: 'Complete your first challenge',
    icon: '🎯',
    requirement: (progress) => progress.completedDays.length >= 1
  },
  {
    id: 'ten-routes',
    name: '10 Routes',
    description: 'Complete 10 challenges',
    icon: '🎯🎯',
    requirement: (progress) => progress.completedDays.length >= 10
  },
  {
    id: 'blog-complete',
    name: 'Blog Platform Complete',
    description: 'Complete all 30 challenges',
    icon: '🏆',
    requirement: (progress) => progress.completedDays.length >= 30
  },

  // Skill badges
  {
    id: 'crud-master',
    name: 'CRUD Master',
    description: 'Complete all CRUD challenges (Days 1-5)',
    icon: '💪',
    requirement: (progress) => {
      const crudDays = [1, 2, 3, 4, 5];
      return crudDays.every(day => progress.completedDays.includes(day));
    }
  },
  {
    id: 'validation-expert',
    name: 'Validation Expert',
    description: 'Complete challenges 11-15 (validation focus)',
    icon: '✓',
    requirement: (progress) => {
      const validationDays = [11, 12, 13, 14, 15];
      return validationDays.every(day => progress.completedDays.includes(day));
    }
  },
  {
    id: 'error-handling-pro',
    name: 'Error Handling Pro',
    description: 'Complete challenges 16-20 (error handling focus)',
    icon: '🛡️',
    requirement: (progress) => {
      const errorDays = [16, 17, 18, 19, 20];
      return errorDays.every(day => progress.completedDays.includes(day));
    }
  }
];

function loadEarnedBadges(): string[] {
  const stored = localStorage.getItem(BADGES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse badges:', e);
    }
  }
  return [];
}

function saveEarnedBadges(badges: string[]): void {
  localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
}

export function useBadges() {
  const [earnedBadges, setEarnedBadges] = useState<string[]>(loadEarnedBadges);

  useEffect(() => {
    saveEarnedBadges(earnedBadges);
  }, [earnedBadges]);

  const checkAndAwardBadges = (progress: BadgeProgress): string[] => {
    const newlyEarned: string[] = [];

    ALL_BADGES.forEach(badge => {
      if (!earnedBadges.includes(badge.id) && badge.requirement(progress)) {
        newlyEarned.push(badge.id);
      }
    });

    if (newlyEarned.length > 0) {
      setEarnedBadges(prev => [...prev, ...newlyEarned]);
    }

    return newlyEarned;
  };

  const hasBadge = (badgeId: string): boolean => {
    return earnedBadges.includes(badgeId);
  };

  const getEarnedBadgeDetails = (): Badge[] => {
    return ALL_BADGES.filter(badge => earnedBadges.includes(badge.id));
  };

  const getAllBadgeDetails = (): Array<Badge & { earned: boolean }> => {
    return ALL_BADGES.map(badge => ({
      ...badge,
      earned: earnedBadges.includes(badge.id)
    }));
  };

  const resetBadges = () => {
    setEarnedBadges([]);
  };

  return {
    earnedBadges,
    checkAndAwardBadges,
    hasBadge,
    getEarnedBadgeDetails,
    getAllBadgeDetails,
    resetBadges
  };
}
