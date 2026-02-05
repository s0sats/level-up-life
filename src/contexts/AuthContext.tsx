import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/game';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'questlife_user';
const USERS_KEY = 'questlife_users';

const createNewUser = (username: string, email: string): User => ({
  id: crypto.randomUUID(),
  username,
  email,
  avatar: '🎮',
  level: 1,
  xp: 0,
  totalXp: 0,
  coins: 100,
  currentStreak: 0,
  longestStreak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  achievements: [],
  ownedItems: [],
  settings: {
    isPublic: true,
    showStreak: true,
    showLevel: true,
    showAchievements: true,
  },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Check for daily login bonus
      const today = new Date().toISOString().split('T')[0];
      if (parsedUser.lastLoginDate !== today) {
        parsedUser.lastLoginDate = today;
        parsedUser.xp += 10;
        parsedUser.totalXp += 10;
        parsedUser.coins += 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { password: string; userId: string }> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, { password: string; userId: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];
    
    if (!userRecord || userRecord.password !== password) {
      return false;
    }

    // Find user data
    const allUserData = localStorage.getItem(`questlife_userdata_${userRecord.userId}`);
    if (allUserData) {
      const userData = JSON.parse(allUserData);
      const today = new Date().toISOString().split('T')[0];
      
      // Daily login bonus
      if (userData.lastLoginDate !== today) {
        userData.lastLoginDate = today;
        userData.xp += 10;
        userData.totalXp += 10;
        userData.coins += 1;
      }
      
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(`questlife_userdata_${userRecord.userId}`, JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    
    if (users[email.toLowerCase()]) {
      return false; // User already exists
    }

    const newUser = createNewUser(username, email);
    
    users[email.toLowerCase()] = {
      password,
      userId: newUser.id,
    };

    saveUsers(users);
    localStorage.setItem(`questlife_userdata_${newUser.id}`, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);

    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    localStorage.setItem(`questlife_userdata_${user.id}`, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
