import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Trophy, 
  ShoppingBag,
  Users,
  Award,
  Settings,
  LogOut,
  Gamepad2,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/habits', label: 'Hábitos', icon: Target },
  { path: '/tasks', label: 'Tarefas', icon: CheckSquare },
  { path: '/goals', label: 'Metas', icon: Trophy },
  { path: '/shop', label: 'Loja', icon: ShoppingBag },
  { path: '/ranking', label: 'Ranking', icon: Award },
  { path: '/community', label: 'Comunidade', icon: Users },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card/50 border-r border-border backdrop-blur-xl z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center box-glow-purple">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-glow-purple">QuestLife</h1>
              <p className="text-xs text-muted-foreground">Level up your life</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
                  isActive 
                    ? "bg-gradient-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-primary rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10", isActive && "text-primary-foreground")} />
                <span className="relative z-10 font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-xl">
              {user?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.username}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className="w-3 h-3 text-neon-orange" />
                <span>{user?.currentStreak} dias</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-muted-foreground hover:text-foreground"
              asChild
            >
              <NavLink to="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Ajustes
              </NavLink>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
