import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { GoalMilestone, XP_CONFIG } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalFormProps {
  onClose: () => void;
}

const emojis = ['🏆', '🎯', '💰', '📚', '💪', '🏃', '🧘', '🎨', '💻', '🌟', '🚀', '🔥', '💎', '👑', '🏅', '🎓'];

const GoalForm: React.FC<GoalFormProps> = ({ onClose }) => {
  const { addGoal } = useGame();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    emoji: '🏆',
    targetValue: 100,
    unit: 'unidades',
    xpReward: 100,
  });
  const [milestones, setMilestones] = useState<Omit<GoalMilestone, 'id' | 'reached'>[]>([]);
  const [newMilestone, setNewMilestone] = useState({ value: 0, label: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;
    if (formData.targetValue <= 0) return;

    const finalMilestones: GoalMilestone[] = milestones.map((m, i) => ({
      id: crypto.randomUUID(),
      value: m.value,
      label: m.label,
      reached: false,
      xpBonus: XP_CONFIG.GOAL_MILESTONE,
    }));

    addGoal({
      title: formData.title,
      description: formData.description || undefined,
      emoji: formData.emoji,
      targetValue: formData.targetValue,
      unit: formData.unit,
      xpReward: formData.xpReward,
      milestones: finalMilestones,
    });

    onClose();
  };

  const addMilestone = () => {
    if (!newMilestone.label.trim() || newMilestone.value <= 0) return;
    if (newMilestone.value >= formData.targetValue) return;

    setMilestones(prev => [...prev, { ...newMilestone, xpBonus: XP_CONFIG.GOAL_MILESTONE }].sort((a, b) => a.value - b.value));
    setNewMilestone({ value: 0, label: '' });
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
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
                  ? "bg-gradient-to-br from-neon-yellow/30 to-neon-orange/30 ring-2 ring-neon-yellow ring-offset-2 ring-offset-background"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título da Meta *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ex: Ler 50 livros"
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
          placeholder="Detalhes sobre a meta..."
          className="bg-background/50 resize-none"
          rows={2}
        />
      </div>

      {/* Target value and unit */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetValue">Valor Alvo *</Label>
          <Input
            id="targetValue"
            type="number"
            min={1}
            value={formData.targetValue}
            onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unidade</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
            placeholder="Ex: livros, km, horas"
            className="bg-background/50"
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <Label>Marcos Intermediários (opcional)</Label>
        
        {milestones.length > 0 && (
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm"
              >
                <span className="font-medium text-neon-yellow">{milestone.value} {formData.unit}</span>
                <span className="flex-1 text-muted-foreground">— {milestone.label}</span>
                <span className="text-xs text-neon-purple">+{XP_CONFIG.GOAL_MILESTONE} XP</span>
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Valor"
            value={newMilestone.value || ''}
            onChange={(e) => setNewMilestone(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
            className="bg-background/50 w-24"
          />
          <Input
            placeholder="Descrição do marco"
            value={newMilestone.label}
            onChange={(e) => setNewMilestone(prev => ({ ...prev, label: e.target.value }))}
            className="bg-background/50 flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addMilestone}
            disabled={!newMilestone.label.trim() || newMilestone.value <= 0}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* XP Reward preview */}
      <div className="p-4 rounded-xl bg-neon-yellow/10 border border-neon-yellow/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Recompensa ao concluir:</span>
          <span className="text-lg font-bold text-neon-yellow">+{formData.xpReward} XP</span>
        </div>
        {milestones.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">+ Bônus de marcos:</span>
            <span className="text-neon-purple">+{milestones.length * XP_CONFIG.GOAL_MILESTONE} XP</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end sticky bottom-0 bg-card pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-neon-yellow to-neon-orange hover:opacity-90 text-background"
          disabled={!formData.title.trim() || formData.targetValue <= 0}
        >
          Criar Meta
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
