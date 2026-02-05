import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak, className }) => {
  const getStreakColor = () => {
    if (streak >= 30) return 'text-neon-cyan';
    if (streak >= 14) return 'text-neon-magenta';
    if (streak >= 7) return 'text-neon-purple';
    if (streak >= 3) return 'text-neon-orange';
    return 'text-muted-foreground';
  };

  const getFlameIntensity = () => {
    if (streak >= 30) return 3;
    if (streak >= 14) return 2;
    if (streak >= 7) return 1;
    return 0;
  };

  const intensity = getFlameIntensity();

  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border", className)}>
      <div className="relative">
        {/* Base flame */}
        <motion.div
          animate={streak > 0 ? { 
            scale: [1, 1.1, 1],
            rotate: [-5, 5, -5]
          } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Flame className={cn("w-6 h-6", getStreakColor(), streak > 0 && "animate-fire")} />
        </motion.div>
        
        {/* Additional flames for high streaks */}
        {intensity >= 1 && (
          <motion.div
            className="absolute -top-1 -left-1"
            animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            <Flame className="w-4 h-4 text-neon-orange opacity-60" />
          </motion.div>
        )}
        {intensity >= 2 && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ scale: [0.7, 0.9, 0.7], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 0.35, repeat: Infinity }}
          >
            <Flame className="w-4 h-4 text-neon-yellow opacity-50" />
          </motion.div>
        )}
        {intensity >= 3 && (
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            animate={{ scale: [0.6, 0.8, 0.6], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <Flame className="w-3 h-3 text-neon-cyan opacity-40" />
          </motion.div>
        )}
      </div>
      
      <div className="flex flex-col">
        <span className={cn("font-bold text-lg leading-none", getStreakColor())}>
          {streak}
        </span>
        <span className="text-xs text-muted-foreground">
          {streak === 1 ? 'dia' : 'dias'}
        </span>
      </div>
    </div>
  );
};

export default StreakCounter;
