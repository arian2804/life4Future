import React from 'react';
import { DailyMetric, Habit, Task, LabEntry, Project, WeightEntry, VisionItem } from './types';

// Helper to generate past dates
const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const MOCK_METRICS: DailyMetric[] = Array.from({ length: 14 }).map((_, i) => ({
  date: `Day ${i + 1}`,
  sleepHours: 6 + Math.random() * 3,
  wordsWritten: Math.floor(Math.random() * 1500),
  readiness: Math.floor(60 + Math.random() * 40),
}));

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', title: 'PhD Thesis', status: 'active', color: 'bg-research' },
  { id: 'p2', title: 'Apartment Hunt', status: 'active', color: 'bg-primary' },
  { id: 'p3', title: 'Website Redesign', status: 'on-hold', color: 'bg-zinc-500' },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Review Literature for Thesis', context: 'Deep Work', status: 'pending', urgent: true, projectId: 'p1', createdAt: daysAgo(20) }, // Stale (>14 days)
  { id: '2', title: 'Email Supervisor', context: 'Admin', status: 'pending', urgent: false, projectId: 'p1', createdAt: daysAgo(1) },
  { id: '3', title: 'Update Lab Protocol', context: 'Deep Work', status: 'pending', urgent: true, createdAt: daysAgo(5) },
  { id: '4', title: 'Buy Coffee Beans', context: 'Errands', status: 'completed', urgent: false, createdAt: daysAgo(2) },
  { id: '5', title: 'Clean Dataset', context: 'Deep Work', status: 'pending', urgent: false, projectId: 'p1', createdAt: daysAgo(16) }, // Stale
  { id: '6', title: 'Schedule Viewings', context: 'Errands', status: 'pending', urgent: true, projectId: 'p2', createdAt: daysAgo(3) },
  { id: '7', title: 'Process Unsorted Ideas', context: 'Inbox', status: 'pending', urgent: false, createdAt: daysAgo(4) }, // Stale Inbox (>3 days)
];

export const MOCK_LAB_ENTRIES: LabEntry[] = [
  { id: '1', title: 'Experiment 4A: Reactivity', folder: 'Project Alpha', wordCount: 1205, lastModified: '2h ago' },
  { id: '2', title: 'Thesis Intro v2', folder: 'Thesis', wordCount: 3420, lastModified: '1d ago' },
  { id: '3', title: 'Weekly Logs', folder: 'General', wordCount: 500, lastModified: '3d ago' },
];

export const MOCK_HABITS: Habit[] = [
  { id: '1', name: 'Morning Pages', streak: 12, status: 'completed', history: [65, 70, 85, 80, 90, 100, 100], dailyGoal: '3 pages' },
  { id: '2', name: 'Meditation (10m)', streak: 45, status: 'pending', history: [100, 100, 100, 90, 100, 100, 95], dailyGoal: '10 minutes' },
  { id: '3', name: 'No Sugar', streak: 5, status: 'frozen', history: [40, 60, 80, 90, 100, 100, 100], dailyGoal: '< 10g sugar' },
  { id: '4', name: 'Read Paper', streak: 0, status: 'missed', history: [80, 60, 40, 50, 20, 10, 0], dailyGoal: '1 section' },
];

export const HEATMAP_DATA = Array.from({ length: 365 }).map((_, i) => {
  const level = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
  return { level };
});

export const MOCK_WEIGHT_DATA: WeightEntry[] = [
  { date: 'Jan 01', weight: 82.5 },
  { date: 'Jan 05', weight: 82.1 },
  { date: 'Jan 10', weight: 81.8 },
  { date: 'Jan 15', weight: 81.2 },
  { date: 'Jan 20', weight: 81.5 },
  { date: 'Jan 25', weight: 80.9 },
  { date: 'Jan 30', weight: 80.4 },
];

export const MOCK_VISION_BOARD: VisionItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', caption: 'Travel the World' },
  { id: '2', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', caption: 'Remote Workspace' },
  { id: '3', url: 'https://images.unsplash.com/photo-1480074568708-e7b720bb9f09?w=800&q=80', caption: 'Dream Home' },
  { id: '4', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', caption: 'Community & Connection' },
];