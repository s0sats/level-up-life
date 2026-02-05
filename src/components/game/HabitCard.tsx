import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Habit } from '@/types/game';
import { Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted }) => {
  const { completeHabit } = useGame();

  const handleComplete = () => {
    if (!isCompleted) {
      completeHabit(habit.id);
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
        isCompleted 
          ? "bg-neon-green/10 border-neon-green/30" 
          : "bg-card/80 border-border hover:border-primary/50"
      )}
      onClick={handleComplete}
    >
      {/* Completion button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
          isCompleted
            ? "bg-neon-green border-neon-green text-background"
            : "border-muted-foreground/30 hover:border-primary hover:bg-primary/10"
        )}
        disabled={isCompleted}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <Check className="w-5 h-5" />
          </motion.div>
        ) : null}
      </motion.button>

      {/* Habit info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">{habit.emoji}</span>
          <span className={cn(
            "font-medium truncate",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {habit.name}
          </span>
        </div>
        {habit.description && (
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {habit.description}
          </p>
        )}
      </div>

      {/* Streak indicator */}
      {habit.streak > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-orange/20 text-neon-orange">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-bold">{habit.streak}</span>
        </div>
      )}

      {/* XP reward */}
      <div className="text-sm text-neon-purple font-medium">
        +{habit.xpReward} XP
      </div>
    </motion.div>
  );
};

export default HabitCard;
