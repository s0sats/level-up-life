import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  Habit, 
  HabitCompletion, 
  Task, 
  Goal, 
  ActivityLog,
  XP_CONFIG,
  calculateLevel,
  calculateXpProgress
} from '@/types/game';
import { toast } from 'sonner';

interface GameContextType {
  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'streak' | 'longestStreak' | 'totalCompletions' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => { xpLost: number };
  archiveHabit: (id: string) => void;
  completeHabit: (id: string) => void;
  getTodayHabits: () => Habit[];
  getHabitCompletionsToday: () => string[];

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'status' | 'createdAt' | 'xpReward'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => { xpLost: number };
  completeTask: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'currentValue' | 'status' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  updateGoalProgress: (id: string, newValue: number) => void;
  deleteGoal: (id: string) => { xpLost: number };
  archiveGoal: (id: string) => void;

  // Activity
  activityLog: ActivityLog[];

  // Stats
  getDailyStats: () => { completed: number; total: number; percentage: number };
  getMonthlyProgress: () => { date: string; percentage: number }[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  // Load data from localStorage
  useEffect(() => {
    if (user) {
      const storedHabits = localStorage.getItem(`questlife_habits_${user.id}`);
      const storedCompletions = localStorage.getItem(`questlife_completions_${user.id}`);
      const storedTasks = localStorage.getItem(`questlife_tasks_${user.id}`);
      const storedGoals = localStorage.getItem(`questlife_goals_${user.id}`);
      const storedActivity = localStorage.getItem(`questlife_activity_${user.id}`);

      if (storedHabits) setHabits(JSON.parse(storedHabits));
      if (storedCompletions) setHabitCompletions(JSON.parse(storedCompletions));
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedGoals) setGoals(JSON.parse(storedGoals));
      if (storedActivity) setActivityLog(JSON.parse(storedActivity));
    }
  }, [user]);

  // Save data to localStorage
  const saveHabits = useCallback((newHabits: Habit[]) => {
    if (user) {
      localStorage.setItem(`questlife_habits_${user.id}`, JSON.stringify(newHabits));
    }
  }, [user]);

  const saveCompletions = useCallback((newCompletions: HabitCompletion[]) => {
    if (user) {
      localStorage.setItem(`questlife_completions_${user.id}`, JSON.stringify(newCompletions));
    }
  }, [user]);

  const saveTasks = useCallback((newTasks: Task[]) => {
    if (user) {
      localStorage.setItem(`questlife_tasks_${user.id}`, JSON.stringify(newTasks));
    }
  }, [user]);

  const saveGoals = useCallback((newGoals: Goal[]) => {
    if (user) {
      localStorage.setItem(`questlife_goals_${user.id}`, JSON.stringify(newGoals));
    }
  }, [user]);

  const saveActivity = useCallback((newActivity: ActivityLog[]) => {
    if (user) {
      localStorage.setItem(`questlife_activity_${user.id}`, JSON.stringify(newActivity));
    }
  }, [user]);

  const addActivityLog = useCallback((type: ActivityLog['type'], description: string, xpChange: number, coinChange: number = 0) => {
    if (!user) return;
    
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      userId: user.id,
      type,
      description,
      xpChange,
      coinChange,
      createdAt: new Date().toISOString(),
    };

    setActivityLog(prev => {
      const updated = [newLog, ...prev].slice(0, 100); // Keep last 100 entries
      saveActivity(updated);
      return updated;
    });
  }, [user, saveActivity]);

  const gainXP = useCallback((amount: number, source: string) => {
    if (!user || amount === 0) return;

    const newTotalXp = user.totalXp + amount;
    const newXp = user.xp + amount;
    const oldLevel = user.level;
    const newLevel = calculateLevel(newTotalXp);
    const coinsEarned = Math.floor(amount * XP_CONFIG.COIN_CONVERSION_RATE);

    updateUser({
      xp: newXp,
      totalXp: newTotalXp,
      level: newLevel,
      coins: user.coins + coinsEarned,
    });

    if (amount > 0) {
      toast.success(`+${amount} XP`, {
        description: source,
        duration: 2000,
      });
    }

    if (newLevel > oldLevel) {
      toast.success(`🎉 Level Up!`, {
        description: `Você alcançou o nível ${newLevel}!`,
        duration: 5000,
      });
      addActivityLog('level_up', `Subiu para o nível ${newLevel}`, 0, 0);
    }
  }, [user, updateUser, addActivityLog]);

  // HABITS
  const addHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'streak' | 'longestStreak' | 'totalCompletions' | 'createdAt'>) => {
    if (!user) return;

    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      userId: user.id,
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      createdAt: new Date().toISOString(),
    };

    setHabits(prev => {
      const updated = [...prev, newHabit];
      saveHabits(updated);
      return updated;
    });

    toast.success('Hábito criado!', { description: newHabit.name });
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, ...updates } : h);
      saveHabits(updated);
      return updated;
    });
  };

  const deleteHabit = (id: string): { xpLost: number } => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return { xpLost: 0 };

    const xpLost = habit.totalCompletions * habit.xpReward;
    
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id);
      saveHabits(updated);
      return updated;
    });

    if (xpLost > 0 && user) {
      updateUser({
        totalXp: Math.max(0, user.totalXp - xpLost),
        xp: Math.max(0, user.xp - xpLost),
        level: calculateLevel(Math.max(0, user.totalXp - xpLost)),
      });
      addActivityLog('penalty', `Hábito "${habit.name}" excluído`, -xpLost);
    }

    return { xpLost };
  };

  const archiveHabit = (id: string) => {
    updateHabit(id, { status: 'archived' });
    toast.info('Hábito arquivado');
  };

  const completeHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit || !user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already completed today
    const alreadyCompleted = habitCompletions.some(
      c => c.habitId === id && c.completedAt.startsWith(today)
    );
    if (alreadyCompleted) return;

    // Calculate streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const completedYesterday = habitCompletions.some(
      c => c.habitId === id && c.completedAt.startsWith(yesterday)
    );
    
    const newStreak = completedYesterday ? habit.streak + 1 : 1;
    const streakBonus = Math.min(newStreak * XP_CONFIG.HABIT_STREAK_BONUS, 50); // Cap at 50
    const totalXpEarned = habit.xpReward + streakBonus;

    // Create completion record
    const completion: HabitCompletion = {
      id: crypto.randomUUID(),
      habitId: id,
      userId: user.id,
      completedAt: new Date().toISOString(),
      xpEarned: totalXpEarned,
    };

    setHabitCompletions(prev => {
      const updated = [...prev, completion];
      saveCompletions(updated);
      return updated;
    });

    // Update habit
    updateHabit(id, {
      streak: newStreak,
      longestStreak: Math.max(habit.longestStreak, newStreak),
      totalCompletions: habit.totalCompletions + 1,
      lastCompletedAt: new Date().toISOString(),
    });

    // Update user streak
    const userNewStreak = user.currentStreak + 1;
    updateUser({
      currentStreak: userNewStreak,
      longestStreak: Math.max(user.longestStreak, userNewStreak),
    });

    gainXP(totalXpEarned, `${habit.emoji} ${habit.name} (+${streakBonus} streak bonus)`);
    addActivityLog('habit_complete', `Completou "${habit.name}"`, totalXpEarned, Math.floor(totalXpEarned * 0.1));
  };

  const getTodayHabits = (): Habit[] => {
    const today = new Date().getDay();
    return habits.filter(h => h.status === 'active' && h.days.includes(today));
  };

  const getHabitCompletionsToday = (): string[] => {
    const today = new Date().toISOString().split('T')[0];
    return habitCompletions
      .filter(c => c.completedAt.startsWith(today))
      .map(c => c.habitId);
  };

  // TASKS
  const addTask = (taskData: Omit<Task, 'id' | 'userId' | 'status' | 'createdAt' | 'xpReward'>) => {
    if (!user) return;

    const xpReward = taskData.priority === 'high' ? XP_CONFIG.TASK_HIGH :
                     taskData.priority === 'medium' ? XP_CONFIG.TASK_MEDIUM : XP_CONFIG.TASK_LOW;

    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      userId: user.id,
      status: 'pending',
      xpReward,
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => {
      const updated = [...prev, newTask];
      saveTasks(updated);
      return updated;
    });

    toast.success('Tarefa criada!', { description: newTask.title });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      saveTasks(updated);
      return updated;
    });
  };

  const deleteTask = (id: string): { xpLost: number } => {
    const task = tasks.find(t => t.id === id);
    if (!task) return { xpLost: 0 };

    const xpLost = task.status === 'completed' ? task.xpReward : 0;

    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTasks(updated);
      return updated;
    });

    if (xpLost > 0 && user) {
      updateUser({
        totalXp: Math.max(0, user.totalXp - xpLost),
        xp: Math.max(0, user.xp - xpLost),
        level: calculateLevel(Math.max(0, user.totalXp - xpLost)),
      });
      addActivityLog('penalty', `Tarefa "${task.title}" excluída`, -xpLost);
    }

    return { xpLost };
  };

  const completeTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.status !== 'pending') return;

    updateTask(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    gainXP(task.xpReward, `✅ ${task.title}`);
    addActivityLog('task_complete', `Completou "${task.title}"`, task.xpReward, Math.floor(task.xpReward * 0.1));
  };

  // GOALS
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'currentValue' | 'status' | 'createdAt'>) => {
    if (!user) return;

    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      userId: user.id,
      currentValue: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setGoals(prev => {
      const updated = [...prev, newGoal];
      saveGoals(updated);
      return updated;
    });

    toast.success('Meta criada!', { description: newGoal.title });
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => {
      const updated = prev.map(g => g.id === id ? { ...g, ...updates } : g);
      saveGoals(updated);
      return updated;
    });
  };

  const updateGoalProgress = (id: string, newValue: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal || goal.status !== 'active') return;

    const oldValue = goal.currentValue;
    const clampedValue = Math.min(newValue, goal.targetValue);

    // Check milestones
    const newlyReachedMilestones = goal.milestones.filter(
      m => !m.reached && clampedValue >= m.value && oldValue < m.value
    );

    let xpEarned = 0;
    
    if (newValue > oldValue) {
      xpEarned += XP_CONFIG.GOAL_PROGRESS;
    }

    // Mark milestones as reached
    const updatedMilestones = goal.milestones.map(m => ({
      ...m,
      reached: m.reached || clampedValue >= m.value,
    }));

    newlyReachedMilestones.forEach(m => {
      xpEarned += m.xpBonus;
      toast.success(`🎯 Marco alcançado!`, { description: m.label });
    });

    const isComplete = clampedValue >= goal.targetValue;

    updateGoal(id, {
      currentValue: clampedValue,
      milestones: updatedMilestones,
      status: isComplete ? 'completed' : 'active',
      completedAt: isComplete ? new Date().toISOString() : undefined,
    });

    if (isComplete) {
      xpEarned += goal.xpReward;
      toast.success(`🏆 Meta concluída!`, { description: goal.title });
      addActivityLog('goal_complete', `Completou meta "${goal.title}"`, xpEarned, Math.floor(xpEarned * 0.1));
    } else if (xpEarned > 0) {
      addActivityLog('goal_progress', `Progresso em "${goal.title}"`, xpEarned, 0);
    }

    if (xpEarned > 0) {
      gainXP(xpEarned, `${goal.emoji} ${goal.title}`);
    }
  };

  const deleteGoal = (id: string): { xpLost: number } => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return { xpLost: 0 };

    // Calculate XP earned from this goal
    const progressXp = Math.floor((goal.currentValue / goal.targetValue) * XP_CONFIG.GOAL_PROGRESS * 10);
    const milestoneXp = goal.milestones.filter(m => m.reached).reduce((sum, m) => sum + m.xpBonus, 0);
    const completionXp = goal.status === 'completed' ? goal.xpReward : 0;
    const xpLost = progressXp + milestoneXp + completionXp;

    setGoals(prev => {
      const updated = prev.filter(g => g.id !== id);
      saveGoals(updated);
      return updated;
    });

    if (xpLost > 0 && user) {
      updateUser({
        totalXp: Math.max(0, user.totalXp - xpLost),
        xp: Math.max(0, user.xp - xpLost),
        level: calculateLevel(Math.max(0, user.totalXp - xpLost)),
      });
      addActivityLog('penalty', `Meta "${goal.title}" excluída`, -xpLost);
    }

    return { xpLost };
  };

  const archiveGoal = (id: string) => {
    updateGoal(id, { status: 'archived' });
    toast.info('Meta arquivada');
  };

  // STATS
  const getDailyStats = () => {
    const todayHabits = getTodayHabits();
    const completedToday = getHabitCompletionsToday();
    const completed = todayHabits.filter(h => completedToday.includes(h.id)).length;
    const total = todayHabits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const getMonthlyProgress = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const progress: { date: string; percentage: number }[] = [];

    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      const habitsForDay = habits.filter(h => h.status === 'active' && h.days.includes(dayOfWeek));
      const completionsForDay = habitCompletions.filter(c => c.completedAt.startsWith(dateStr));
      
      const total = habitsForDay.length;
      const completed = habitsForDay.filter(h => 
        completionsForDay.some(c => c.habitId === h.id)
      ).length;

      progress.push({
        date: dateStr,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }

    return progress;
  };

  return (
    <GameContext.Provider value={{
      habits,
      addHabit,
      updateHabit,
      deleteHabit,
      archiveHabit,
      completeHabit,
      getTodayHabits,
      getHabitCompletionsToday,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      completeTask,
      goals,
      addGoal,
      updateGoal,
      updateGoalProgress,
      deleteGoal,
      archiveGoal,
      activityLog,
      getDailyStats,
      getMonthlyProgress,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
