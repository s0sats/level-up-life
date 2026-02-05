import React from 'react';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, tier, className, size = 'sm' }) => {
  const getTierStyles = () => {
    switch (tier) {
      case 'diamond':
        return 'bg-gradient-to-br from-cyan-300 to-blue-500 text-blue-900 shadow-[0_0_10px_hsl(var(--neon-cyan)/0.5)]';
      case 'platinum':
        return 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800 shadow-[0_0_10px_hsl(var(--level-platinum)/0.5)]';
      case 'gold':
        return 'bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-900 shadow-[0_0_10px_hsl(var(--neon-yellow)/0.5)]';
      case 'silver':
        return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800';
      default:
        return 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'lg':
        return 'w-10 h-10 text-sm';
      case 'md':
        return 'w-8 h-8 text-xs';
      default:
        return 'w-6 h-6 text-[10px]';
    }
  };

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center font-bold",
        getTierStyles(),
        getSizeStyles(),
        className
      )}
    >
      {level}
    </div>
  );
};

export default LevelBadge;
