import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gamepad2, Zap, Trophy, Target, Flame, Eye, EyeOff } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let success: boolean;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Email ou senha incorretos');
        }
      } else {
        if (!formData.username.trim()) {
          setError('Nome de usuário é obrigatório');
          setIsLoading(false);
          return;
        }
        success = await register(formData.username, formData.email, formData.password);
        if (!success) {
          setError('Este email já está cadastrado');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    }

    setIsLoading(false);
  };

  const features = [
    { icon: Target, label: 'Hábitos', color: 'text-neon-cyan' },
    { icon: Trophy, label: 'Conquistas', color: 'text-neon-yellow' },
    { icon: Flame, label: 'Streaks', color: 'text-neon-orange' },
    { icon: Zap, label: 'XP & Níveis', color: 'text-neon-purple' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--neon-purple) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-4 box-glow-purple"
          >
            <Gamepad2 className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-glow-purple mb-2">
            QuestLife
          </h1>
          <p className="text-muted-foreground">
            Transforme seus hábitos em uma aventura épica
          </p>
        </div>

        {/* Features pills */}
        <div className="flex justify-center gap-2 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <feature.icon className={`w-4 h-4 ${feature.color}`} />
              <span className="text-xs font-medium">{feature.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Auth card */}
        <motion.div
          layout
          className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 box-glow-purple"
        >
          {/* Tab switcher */}
          <div className="flex mb-6 p-1 bg-muted/50 rounded-lg">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-gradient-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-gradient-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="SeuNickGamer"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-background/50 border-border focus:border-primary focus:ring-primary"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-background/50 border-border focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-background/50 border-border focus:border-primary focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-6"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : isLogin ? (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Começar Aventura
                </>
              ) : (
                <>
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Criar Personagem
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Demo notice */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          🎮 Versão Demo — Dados salvos localmente
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
