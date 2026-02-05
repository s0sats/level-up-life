import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface HabitFormProps {
  onClose: () => void;
}

const emojis = ['🎯', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎨', '🎸', '💻', '🌱', '🧹', '💰', '🙏'];
const daysOfWeek = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
];

const HabitForm: React.FC<HabitFormProps> = ({ onClose }) => {
  const { addHabit } = useGame();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emoji: '🎯',
    days: [1, 2, 3, 4, 5] as number[], // Default: weekdays
    xpReward: 25,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    if (formData.days.length === 0) return;

    addHabit({
      name: formData.name,
      description: formData.description || undefined,
      emoji: formData.emoji,
      days: formData.days,
      status: 'active',
      xpReward: formData.xpReward,
    });

    onClose();
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }));
  };

  const selectAllDays = () => {
    setFormData(prev => ({ ...prev, days: [0, 1, 2, 3, 4, 5, 6] }));
  };

  const selectWeekdays = () => {
    setFormData(prev => ({ ...prev, days: [1, 2, 3, 4, 5] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Emoji selector */}
      <div className="space-y-2">
        <Label>Ícone</Label>
        <div className="grid grid-cols-8 gap-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, emoji }))}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                formData.emoji === emoji
                  ? "bg-gradient-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Hábito *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Ler 30 minutos"
          required
          className="bg-background/50"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Detalhes sobre o hábito..."
          className="bg-background/50 resize-none"
          rows={2}
        />
      </div>

      {/* Days of week */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Dias da Semana *</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectWeekdays}
              className="text-xs text-neon-cyan hover:underline"
            >
              Dias úteis
            </button>
            <button
              type="button"
              onClick={selectAllDays}
              className="text-xs text-neon-cyan hover:underline"
            >
              Todos
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                formData.days.includes(day.value)
                  ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
        {formData.days.length === 0 && (
          <p className="text-xs text-destructive">Selecione pelo menos um dia</p>
        )}
      </div>

      {/* XP Reward preview */}
      <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
        <div className="flex items-center justify-between">
          <span className="text-sm">Recompensa por conclusão:</span>
          <span className="text-lg font-bold text-neon-purple">+{formData.xpReward} XP</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Bônus de streak: até +50 XP extras por dia consecutivo
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-primary hover:opacity-90"
          disabled={!formData.name.trim() || formData.days.length === 0}
        >
          Criar Hábito
        </Button>
      </div>
    </form>
  );
};

export default HabitForm;
