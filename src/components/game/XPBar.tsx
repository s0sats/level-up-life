import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface XPBarProps {
  current: number;
  needed: number;
  level: number;
  percentage: number;
  className?: string;
}

const XPBar: React.FC<XPBarProps> = ({ current, needed, level, percentage, className }) => {
  return (
    <div className={cn("bg-card/50 rounded-xl p-4 border border-border backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-lg">Nível {level}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {current.toLocaleString()} / {needed.toLocaleString()} XP
        </span>
      </div>
      
      <div className="relative h-4 bg-xp-bg rounded-full overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="h-full bg-gradient-to-r from-neon-purple to-neon-magenta blur-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Main bar */}
        <motion.div
          className="relative h-full bg-gradient-to-r from-neon-purple via-neon-magenta to-neon-cyan rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
          
          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>
        
        {/* Level markers */}
        <div className="absolute inset-0 flex items-center">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute w-0.5 h-full bg-background/30"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">0%</span>
        <span className="text-xs text-neon-cyan font-medium">
          {Math.round(percentage)}% para o próximo nível
        </span>
        <span className="text-xs text-muted-foreground">100%</span>
      </div>
    </div>
  );
};

export default XPBar;
