import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Goal } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Plus, 
  Archive, 
  Trash2,
  MoreVertical,
  Target,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import GoalForm from '@/components/forms/GoalForm';
import GoalProgressDialog from '@/components/dialogs/GoalProgressDialog';

const GoalsPage: React.FC = () => {
  const { goals, deleteGoal, archiveGoal } = useGame();
  const [showForm, setShowForm] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);
  const [filter, setFilter] = React.useState<'active' | 'completed' | 'archived'>('active');

  const filteredGoals = goals.filter(g => g.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-neon-yellow" />
            Minhas Metas
          </h1>
          <p className="text-muted-foreground mt-1">
            Defina objetivos de longo prazo e acompanhe seu progresso
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'bg-gradient-primary' : ''}
        >
          Ativas ({goals.filter(g => g.status === 'active').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'bg-gradient-primary' : ''}
        >
          Concluídas ({goals.filter(g => g.status === 'completed').length})
        </Button>
        <Button
          variant={filter === 'archived' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('archived')}
          className={filter === 'archived' ? 'bg-gradient-primary' : ''}
        >
          Arquivadas ({goals.filter(g => g.status === 'archived').length})
        </Button>
      </div>

      {/* Goals grid */}
      {filteredGoals.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">
              {filter === 'active' ? 'Nenhuma meta ativa' : 
               filter === 'completed' ? 'Nenhuma meta concluída' : 'Nenhuma meta arquivada'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'active' 
                ? 'Defina suas primeiras metas para começar!'
                : filter === 'completed'
                ? 'Continue trabalhando para alcançar suas metas'
                : 'Metas arquivadas aparecerão aqui'}
            </p>
            {filter === 'active' && (
              <Button onClick={() => setShowForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Criar Meta
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal, index) => {
            const progressPercent = Math.round((goal.currentValue / goal.targetValue) * 100);
            const reachedMilestones = goal.milestones.filter(m => m.reached).length;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={cn(
                    "bg-card/50 border-border hover:border-primary/30 transition-colors cursor-pointer group",
                    goal.status === 'completed' && "border-neon-yellow/30 bg-neon-yellow/5"
                  )}
                  onClick={() => goal.status === 'active' && setSelectedGoal(goal)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-yellow/20 to-neon-orange/20 flex items-center justify-center text-2xl border border-neon-yellow/30">
                          {goal.emoji}
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {goal.title}
                            {goal.status === 'completed' && (
                              <span className="text-neon-yellow">🏆</span>
                            )}
                          </CardTitle>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {goal.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); archiveGoal(goal.id); }}>
                            <Archive className="w-4 h-4 mr-2" />
                            {goal.status === 'archived' ? 'Restaurar' : 'Arquivar'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="font-bold text-neon-yellow">{progressPercent}%</span>
                      </div>
                      <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-neon-yellow to-neon-orange rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    {goal.milestones.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Marcos:</span>
                        </div>
                        <span className="font-medium">
                          {reachedMilestones}/{goal.milestones.length}
                        </span>
                      </div>
                    )}

                    {/* XP reward */}
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Recompensa:</span>
                      <span className="font-bold text-neon-purple">+{goal.xpReward} XP</span>
                    </div>

                    {goal.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => { e.stopPropagation(); setSelectedGoal(goal); }}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Atualizar Progresso
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create goal dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Nova Meta</DialogTitle>
            <DialogDescription>
              Defina um objetivo de longo prazo com marcos intermediários
            </DialogDescription>
          </DialogHeader>
          <GoalForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Update progress dialog */}
      {selectedGoal && (
        <GoalProgressDialog
          goal={selectedGoal}
          open={!!selectedGoal}
          onClose={() => setSelectedGoal(null)}
        />
      )}
    </motion.div>
  );
};

export default GoalsPage;
