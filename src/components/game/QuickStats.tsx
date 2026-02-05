import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickStatsProps {
  dailyProgress: number;
  habitsCompleted: number;
  habitsTotal: number;
  pendingTasks: number;
  activeGoals: number;
  totalXp: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  dailyProgress,
  habitsCompleted,
  habitsTotal,
  pendingTasks,
  activeGoals,
  totalXp,
}) => {
  const stats = [
    {
      label: 'Hábitos Hoje',
      value: `${habitsCompleted}/${habitsTotal}`,
      icon: Target,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan/10',
      borderColor: 'border-neon-cyan/30',
    },
    {
      label: 'Tarefas Pendentes',
      value: pendingTasks.toString(),
      icon: CheckCircle2,
      color: 'text-neon-magenta',
      bgColor: 'bg-neon-magenta/10',
      borderColor: 'border-neon-magenta/30',
    },
    {
      label: 'Metas Ativas',
      value: activeGoals.toString(),
      icon: Star,
      color: 'text-neon-yellow',
      bgColor: 'bg-neon-yellow/10',
      borderColor: 'border-neon-yellow/30',
    },
    {
      label: 'XP Total',
      value: totalXp.toLocaleString(),
      icon: Zap,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      borderColor: 'border-neon-purple/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "p-4 rounded-xl border backdrop-blur-sm",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
