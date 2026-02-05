import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Goal } from '@/types/game';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Check, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalProgressDialogProps {
  goal: Goal;
  open: boolean;
  onClose: () => void;
}

const GoalProgressDialog: React.FC<GoalProgressDialogProps> = ({ goal, open, onClose }) => {
  const { updateGoalProgress } = useGame();
  const [newValue, setNewValue] = useState(goal.currentValue);

  const handleSave = () => {
    if (newValue !== goal.currentValue) {
      updateGoalProgress(goal.id, newValue);
    }
    onClose();
  };

  const progressPercent = Math.round((newValue / goal.targetValue) * 100);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{goal.emoji}</span>
            {goal.title}
          </DialogTitle>
          <DialogDescription>
            Atualize seu progresso nesta meta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current progress display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-neon-yellow">
              {newValue} <span className="text-lg text-muted-foreground">/ {goal.targetValue}</span>
            </div>
            <div className="text-sm text-muted-foreground">{goal.unit}</div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <Slider
              value={[newValue]}
              onValueChange={(values) => setNewValue(values[0])}
              max={goal.targetValue}
              min={0}
              step={1}
              className="py-4"
            />
            
            {/* Quick input */}
            <div className="flex items-center gap-2">
              <Label htmlFor="value" className="shrink-0">Valor:</Label>
              <Input
                id="value"
                type="number"
                min={0}
                max={goal.targetValue}
                value={newValue}
                onChange={(e) => setNewValue(Math.min(goal.targetValue, Math.max(0, parseInt(e.target.value) || 0)))}
                className="bg-background/50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewValue(goal.targetValue)}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Milestones preview */}
          {goal.milestones.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Marcos
              </Label>
              <div className="space-y-1">
                {goal.milestones.map((milestone) => {
                  const willReach = newValue >= milestone.value;
                  const alreadyReached = milestone.reached;
                  const newlyReached = willReach && !alreadyReached;
                  
                  return (
                    <div 
                      key={milestone.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm transition-all",
                        willReach ? "bg-neon-green/20" : "bg-muted/30",
                        newlyReached && "ring-2 ring-neon-green"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        willReach ? "bg-neon-green text-background" : "bg-muted"
                      )}>
                        {willReach && <Check className="w-3 h-3" />}
                      </div>
                      <span className="flex-1">
                        {milestone.value} {goal.unit} — {milestone.label}
                      </span>
                      {newlyReached && (
                        <span className="text-xs text-neon-green font-medium">
                          +{milestone.xpBonus} XP
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-bold text-neon-yellow">{progressPercent}%</span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-yellow to-neon-orange rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-neon-yellow to-neon-orange hover:opacity-90 text-background"
          >
            Salvar Progresso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalProgressDialog;
