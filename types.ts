export type NavSection = 'dashboard' | 'gtd' | 'lab' | 'bio' | 'vision-board' | 'settings';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold';
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  context: 'Deep Work' | 'Errands' | 'Admin' | 'Inbox';
  status: 'pending' | 'completed' | 'archived';
  urgent: boolean;
  projectId?: string; // Optional link to a project
  createdAt?: string;
}

export interface LabEntry {
  id: string;
  title: string;
  folder: string;
  wordCount: number;
  lastModified: string;
}

export interface Monster {
  name: string;
  maxHp: number;
  currentHp: number;
}

export interface DailyMetric {
  date: string;
  sleepHours: number;
  wordsWritten: number;
  readiness: number; // 0-100
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  status: 'completed' | 'missed' | 'frozen' | 'pending';
  history: number[];
  archived?: boolean;
  dailyGoal?: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface VisionItem {
  id: string;
  url: string;
  caption?: string;
}