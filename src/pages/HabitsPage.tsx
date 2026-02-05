import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Habit } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Plus, 
  Archive, 
  Trash2, 
  Flame,
  Calendar,
  MoreVertical,
  Edit
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import HabitForm from '@/components/forms/HabitForm';

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const HabitsPage: React.FC = () => {
  const { habits, deleteHabit, archiveHabit } = useGame();
  const [showForm, setShowForm] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ habit: Habit; xpLost: number } | null>(null);
  const [filter, setFilter] = React.useState<'active' | 'archived'>('active');

  const filteredHabits = habits.filter(h => h.status === filter);

  const handleDelete = (habit: Habit) => {
    const xpLost = habit.totalCompletions * habit.xpReward;
    setDeleteConfirm({ habit, xpLost });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteHabit(deleteConfirm.habit.id);
      setDeleteConfirm(null);
    }
  };

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
            <Target className="w-8 h-8 text-neon-cyan" />
            Meus Hábitos
          </h1>
          <p className="text-muted-foreground mt-1">
            Construa sua rotina e ganhe XP diariamente
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Hábito
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
          Ativos ({habits.filter(h => h.status === 'active').length})
        </Button>
        <Button
          variant={filter === 'archived' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('archived')}
          className={filter === 'archived' ? 'bg-gradient-primary' : ''}
        >
          Arquivados ({habits.filter(h => h.status === 'archived').length})
        </Button>
      </div>

      {/* Habits grid */}
      {filteredHabits.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">
              {filter === 'active' ? 'Nenhum hábito ativo' : 'Nenhum hábito arquivado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'active' 
                ? 'Crie seu primeiro hábito para começar a ganhar XP!'
                : 'Hábitos arquivados aparecerão aqui'}
            </p>
            {filter === 'active' && (
              <Button onClick={() => setShowForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Criar Hábito
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center text-2xl">
                        {habit.emoji}
                      </div>
                      <div>
                        <CardTitle className="text-base">{habit.name}</CardTitle>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {habit.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => archiveHabit(habit.id)}>
                          <Archive className="w-4 h-4 mr-2" />
                          {habit.status === 'active' ? 'Arquivar' : 'Restaurar'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(habit)}
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
                  {/* Days of week */}
                  <div className="flex gap-1">
                    {daysOfWeek.map((day, i) => (
                      <div
                        key={day}
                        className={cn(
                          "flex-1 text-center py-1 rounded text-xs font-medium",
                          habit.days.includes(i)
                            ? "bg-neon-cyan/20 text-neon-cyan"
                            : "bg-muted/30 text-muted-foreground"
                        )}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-neon-orange" />
                        <span className="font-bold">{habit.streak}</span>
                        <span className="text-muted-foreground">streak</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{habit.totalCompletions}x</span>
                      </div>
                    </div>
                    <div className="text-neon-purple font-medium">
                      +{habit.xpReward} XP
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create habit dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Hábito</DialogTitle>
            <DialogDescription>
              Defina um hábito para praticar regularmente e ganhar XP
            </DialogDescription>
          </DialogHeader>
          <HabitForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir Hábito</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                Você está prestes a excluir o hábito "{deleteConfirm?.habit.name}".
              </p>
              {deleteConfirm && deleteConfirm.xpLost > 0 && (
                <p className="text-destructive font-medium">
                  ⚠️ Isso removerá {deleteConfirm.xpLost} XP que você ganhou com este hábito.
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Dica: Você pode arquivar o hábito para manter seu XP e histórico.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                if (deleteConfirm) {
                  archiveHabit(deleteConfirm.habit.id);
                  setDeleteConfirm(null);
                }
              }}
            >
              <Archive className="w-4 h-4 mr-2" />
              Arquivar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir (-{deleteConfirm?.xpLost} XP)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default HabitsPage;
