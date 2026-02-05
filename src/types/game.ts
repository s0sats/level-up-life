// QuestLife Game Types

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  frame?: string;
  level: number;
  xp: number;
  totalXp: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  createdAt: string;
  achievements: string[];
  ownedItems: string[];
  activeShield?: Shield;
  settings: UserSettings;
}

export interface UserSettings {
  isPublic: boolean;
  showStreak: boolean;
  showLevel: boolean;
  showAchievements: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  emoji: string;
  days: number[]; // 0-6 (Sunday-Saturday)
  status: 'active' | 'archived';
  streak: number;
  longestStreak: number;
  totalCompletions: number;
  xpReward: number;
  createdAt: string;
  lastCompletedAt?: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  xpEarned: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'expired';
  dueDate?: string;
  xpReward: number;
  createdAt: string;
  completedAt?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  emoji: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: 'active' | 'completed' | 'archived';
  xpReward: number;
  milestones: GoalMilestone[];
  createdAt: string;
  completedAt?: string;
}

export interface GoalMilestone {
  id: string;
  value: number;
  label: string;
  reached: boolean;
  xpBonus: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'habits' | 'tasks' | 'goals' | 'streaks' | 'levels' | 'social';
  requirement: number;
  xpReward: number;
  coinReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'frame' | 'theme' | 'badge' | 'shield';
  preview: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  duration?: number; // For temporary items like shields (in hours)
}

export interface Shield {
  itemId: string;
  activatedAt: string;
  expiresAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'community';
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward;
  participants: number;
  progress?: number; // User's progress percentage
}

export interface ChallengeRequirement {
  type: 'habits' | 'tasks' | 'goals' | 'streak';
  count: number;
  description: string;
}

export interface ChallengeReward {
  xp: number;
  coins: number;
  itemId?: string;
  achievementId?: string;
}

export interface RankingEntry {
  userId: string;
  username: string;
  avatar: string;
  frame?: string;
  level: number;
  value: number; // XP, streak, etc.
  rank: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'habit_complete' | 'task_complete' | 'goal_progress' | 'goal_complete' | 
        'level_up' | 'achievement' | 'login_bonus' | 'penalty' | 'purchase';
  description: string;
  xpChange: number;
  coinChange: number;
  createdAt: string;
}

// XP Calculation constants
export const XP_CONFIG = {
  HABIT_BASE: 25,
  HABIT_STREAK_BONUS: 5, // Per streak day
  TASK_LOW: 15,
  TASK_MEDIUM: 30,
  TASK_HIGH: 50,
  GOAL_PROGRESS: 10,
  GOAL_COMPLETE_BASE: 100,
  GOAL_MILESTONE: 25,
  LOGIN_DAILY: 10,
  PENALTY_MISSED_HABIT: -10,
  PENALTY_EXPIRED_TASK: -15,
  COIN_CONVERSION_RATE: 0.1, // 10% of XP earned becomes coins
};

// Level calculation
export const calculateLevel = (totalXp: number): number => {
  // Level formula: level = floor(sqrt(totalXp / 100)) + 1
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
};

export const calculateXpForLevel = (level: number): number => {
  // XP needed to reach a level
  return Math.pow(level - 1, 2) * 100;
};

export const calculateXpProgress = (totalXp: number): { current: number; needed: number; percentage: number } => {
  const level = calculateLevel(totalXp);
  const xpForCurrentLevel = calculateXpForLevel(level);
  const xpForNextLevel = calculateXpForLevel(level + 1);
  const current = totalXp - xpForCurrentLevel;
  const needed = xpForNextLevel - xpForCurrentLevel;
  const percentage = (current / needed) * 100;
  
  return { current, needed, percentage };
};

export const getLevelTier = (level: number): 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' => {
  if (level < 10) return 'bronze';
  if (level < 25) return 'silver';
  if (level < 50) return 'gold';
  if (level < 100) return 'platinum';
  return 'diamond';
};
