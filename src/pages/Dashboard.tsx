import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { calculateXpProgress, getLevelTier } from '@/types/game';
import { 
  Flame, 
  Target, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import XPBar from '@/components/game/XPBar';
import StreakCounter from '@/components/game/StreakCounter';
import LevelBadge from '@/components/game/LevelBadge';
import HabitCard from '@/components/game/HabitCard';
import QuickStats from '@/components/game/QuickStats';
import ProgressChart from '@/components/game/ProgressChart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTodayHabits, getHabitCompletionsToday, getDailyStats, tasks, goals } = useGame();

  if (!user) return null;

  const todayHabits = getTodayHabits();
  const completedToday = getHabitCompletionsToday();
  const dailyStats = getDailyStats();
  const xpProgress = calculateXpProgress(user.totalXp);
  const levelTier = getLevelTier(user.level);

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const activeGoals = goals.filter(g => g.status === 'active').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header with user stats */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl box-glow-purple">
              {user.avatar}
            </div>
            <LevelBadge level={user.level} tier={levelTier} className="absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Olá, {user.username}! 👋</h1>
            <p className="text-muted-foreground">Vamos conquistar o dia de hoje!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <StreakCounter streak={user.currentStreak} />
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
            <span className="text-xl">🪙</span>
            <span className="font-bold text-neon-yellow">{user.coins}</span>
          </div>
        </div>
      </motion.div>

      {/* XP Bar */}
      <motion.div variants={itemVariants}>
        <XPBar 
          current={xpProgress.current} 
          needed={xpProgress.needed} 
          level={user.level}
          percentage={xpProgress.percentage}
        />
      </motion.div>

      {/* Quick Stats Cards */}
      <motion.div variants={itemVariants}>
        <QuickStats 
          dailyProgress={dailyStats.percentage}
          habitsCompleted={dailyStats.completed}
          habitsTotal={dailyStats.total}
          pendingTasks={pendingTasks}
          activeGoals={activeGoals}
          totalXp={user.totalXp}
        />
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-cyan" />
                Hábitos de Hoje
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {dailyStats.completed}/{dailyStats.total} concluídos
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayHabits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum hábito para hoje</p>
                  <p className="text-sm">Crie novos hábitos para começar sua jornada!</p>
                </div>
              ) : (
                todayHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={completedToday.includes(habit.id)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Side panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Daily Progress Ring */}
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5 text-neon-green" />
                Progresso Diário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 352' }}
                      animate={{ 
                        strokeDasharray: `${(dailyStats.percentage / 100) * 352} 352` 
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
                        <stop offset="100%" stopColor="hsl(var(--neon-purple))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{dailyStats.percentage}%</span>
                    <span className="text-xs text-muted-foreground">concluído</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks Preview */}
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="w-5 h-5 text-neon-magenta" />
                Tarefas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingTasks === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Todas as tarefas concluídas! 🎉
                </p>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{pendingTasks} tarefas</span>
                  <span className="text-xs text-neon-magenta">Ver todas →</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Goals Preview */}
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="w-5 h-5 text-neon-yellow" />
                Metas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeGoals === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Defina suas primeiras metas!
                </p>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{activeGoals} metas em andamento</span>
                  <span className="text-xs text-neon-yellow">Ver todas →</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <motion.div variants={itemVariants}>
        <ProgressChart />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
