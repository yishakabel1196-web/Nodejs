import { useState, useEffect } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  completedDays: number[];
}

const STREAK_STORAGE_KEY = 'daily-routes-streak';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function loadStreakData(): StreakData {
  const stored = localStorage.getItem(STREAK_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse streak data:', e);
    }
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    completedDays: []
  };
}

function saveStreakData(data: StreakData): void {
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(loadStreakData);

  useEffect(() => {
    saveStreakData(streakData);
  }, [streakData]);

  const completeDay = (day: number) => {
    const today = getToday();
    const yesterday = getYesterday();
    
    setStreakData(prev => {
      // Check if already completed today
      if (prev.lastCompletionDate === today) {
        return prev;
      }

      let newStreak = prev.currentStreak;
      
      // Check if continuing streak
      if (prev.lastCompletionDate === yesterday) {
        newStreak += 1;
      } else if (prev.lastCompletionDate !== today) {
        // Starting new streak
        newStreak = 1;
      }

      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      
      // Add day to completed days if not already there
      const completedDays = prev.completedDays.includes(day) 
        ? prev.completedDays 
        : [...prev.completedDays, day];

      return {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastCompletionDate: today,
        completedDays
      };
    });
  };

  const isCompletedToday = streakData.lastCompletionDate === getToday();

  const isDayCompleted = (day: number) => {
    return streakData.completedDays.includes(day);
  };

  const resetStreak = () => {
    setStreakData({
      currentStreak: 0,
      longestStreak: streakData.longestStreak,
      lastCompletionDate: null,
      completedDays: []
    });
  };

  return {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastCompletionDate: streakData.lastCompletionDate,
    completedDays: streakData.completedDays,
    completeDay,
    isCompletedToday,
    isDayCompleted,
    resetStreak
  };
}
