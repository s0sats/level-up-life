import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { XP_CONFIG } from '@/types/game';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onClose: () => void;
}

const priorities = [
  { value: 'low' as const, label: 'Baixa', xp: XP_CONFIG.TASK_LOW, color: 'text-neon-green', bg: 'bg-neon-green/20' },
  { value: 'medium' as const, label: 'Média', xp: XP_CONFIG.TASK_MEDIUM, color: 'text-neon-yellow', bg: 'bg-neon-yellow/20' },
  { value: 'high' as const, label: 'Alta', xp: XP_CONFIG.TASK_HIGH, color: 'text-destructive', bg: 'bg-destructive/20' },
];

const TaskForm: React.FC<TaskFormProps> = ({ onClose }) => {
  const { addTask } = useGame();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    addTask({
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
    });

    onClose();
  };

  const selectedPriority = priorities.find(p => p.value === formData.priority)!;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título da Tarefa *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ex: Enviar relatório"
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
          placeholder="Detalhes sobre a tarefa..."
          className="bg-background/50 resize-none"
          rows={2}
        />
      </div>

      {/* Priority */}
      <div className="space-y-3">
        <Label>Prioridade</Label>
        <div className="grid grid-cols-3 gap-2">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
              className={cn(
                "p-3 rounded-xl text-center transition-all border",
                formData.priority === priority.value
                  ? `${priority.bg} ${priority.color} border-current`
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border-transparent"
              )}
            >
              <div className="font-medium">{priority.label}</div>
              <div className="text-xs opacity-80">+{priority.xp} XP</div>
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate">Data de Vencimento (opcional)</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          min={new Date().toISOString().split('T')[0]}
          className="bg-background/50"
        />
      </div>

      {/* XP Reward preview */}
      <div className={cn("p-4 rounded-xl border", selectedPriority.bg, `border-${selectedPriority.color}/30`)}>
        <div className="flex items-center justify-between">
          <span className="text-sm">Recompensa por conclusão:</span>
          <span className={cn("text-lg font-bold", selectedPriority.color)}>+{selectedPriority.xp} XP</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-primary hover:opacity-90"
          disabled={!formData.title.trim()}
        >
          Criar Tarefa
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
