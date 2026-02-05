import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Task } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Clock,
  AlertTriangle,
  Check,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import TaskForm from '@/components/forms/TaskForm';

const TasksPage: React.FC = () => {
  const { tasks, completeTask, deleteTask } = useGame();
  const [showForm, setShowForm] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('pending');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-destructive/20', border: 'border-destructive/50', text: 'text-destructive', label: 'Alta' };
      case 'medium':
        return { bg: 'bg-neon-yellow/20', border: 'border-neon-yellow/50', text: 'text-neon-yellow', label: 'Média' };
      default:
        return { bg: 'bg-neon-green/20', border: 'border-neon-green/50', text: 'text-neon-green', label: 'Baixa' };
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status !== 'pending') return false;
    return new Date(task.dueDate) < new Date();
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
            <CheckSquare className="w-8 h-8 text-neon-magenta" />
            Minhas Tarefas
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete tarefas para ganhar XP baseado na prioridade
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
          className={filter === 'pending' ? 'bg-gradient-primary' : ''}
        >
          Pendentes ({tasks.filter(t => t.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'bg-gradient-primary' : ''}
        >
          Concluídas ({tasks.filter(t => t.status === 'completed').length})
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-gradient-primary' : ''}
        >
          Todas ({tasks.length})
        </Button>
      </div>

      {/* Tasks list */}
      {filteredTasks.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">
              {filter === 'pending' ? 'Nenhuma tarefa pendente' : 
               filter === 'completed' ? 'Nenhuma tarefa concluída' : 'Nenhuma tarefa'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'pending' 
                ? 'Você está em dia! 🎉'
                : 'Adicione tarefas para organizar seu dia'}
            </p>
            {filter !== 'completed' && (
              <Button onClick={() => setShowForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Criar Tarefa
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => {
            const priorityStyle = getPriorityStyles(task.priority);
            const overdue = isOverdue(task);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "bg-card/50 border-border transition-all",
                  task.status === 'completed' && "opacity-60",
                  overdue && "border-destructive/50"
                )}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      {/* Complete button */}
                      <button
                        onClick={() => task.status === 'pending' && completeTask(task.id)}
                        disabled={task.status === 'completed'}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                          task.status === 'completed'
                            ? "bg-neon-green border-neon-green text-background"
                            : "border-muted-foreground/30 hover:border-primary hover:bg-primary/10"
                        )}
                      >
                        {task.status === 'completed' && <Check className="w-4 h-4" />}
                      </button>

                      {/* Task info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-medium",
                            task.status === 'completed' && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            priorityStyle.bg,
                            priorityStyle.text
                          )}>
                            {priorityStyle.label}
                          </span>
                          {overdue && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Atrasada
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {task.description}
                          </p>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* XP reward */}
                      <div className="text-neon-purple font-medium">
                        +{task.xpReward} XP
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => deleteTask(task.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create task dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Adicione uma tarefa e ganhe XP ao completá-la
            </DialogDescription>
          </DialogHeader>
          <TaskForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TasksPage;
