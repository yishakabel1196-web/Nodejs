import { useState, useEffect, useCallback } from 'react';

interface Progress {
  completedLessons: string[]; // format: "courseId/lessonId"
}

const STORAGE_KEY = 'nodejs-learning-progress';

function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return { completedLessons: [] };
}

function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markComplete = useCallback((courseId: string, lessonId: string) => {
    const key = `${courseId}/${lessonId}`;
    setProgress(prev => {
      if (prev.completedLessons.includes(key)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, key]
      };
    });
  }, []);

  const isCompleted = useCallback((courseId: string, lessonId: string): boolean => {
    return progress.completedLessons.includes(`${courseId}/${lessonId}`);
  }, [progress.completedLessons]);

  const getCourseProgress = useCallback((courseId: string, totalLessons: number): number => {
    const completed = progress.completedLessons.filter(key => key.startsWith(courseId + '/')).length;
    return Math.round((completed / totalLessons) * 100);
  }, [progress.completedLessons]);

  const getTotalProgress = useCallback((totalLessons: number): number => {
    return Math.round((progress.completedLessons.length / totalLessons) * 100);
  }, [progress.completedLessons]);

  const resetProgress = useCallback(() => {
    setProgress({ completedLessons: [] });
  }, []);

  return {
    progress,
    markComplete,
    isCompleted,
    getCourseProgress,
    getTotalProgress,
    resetProgress
  };
}
