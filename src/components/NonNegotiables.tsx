
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Pencil, X, LockKeyhole, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

const NonNegotiables = () => {
  const { tasks, tasksLocked, addTask, removeTask, completeTask, lockTasks } = useApp();
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleNext = () => {
    if (!tasksLocked) {
      lockTasks();
    }
    navigate('/journal');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <div className="glass-panel p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-8 text-center">
          {tasksLocked ? (
            <span>Your non-negotiables for today</span>
          ) : (
            <span>What are your 3 non-negotiables today?</span>
          )}
        </h1>

        {!tasksLocked && tasks.length < 3 && (
          <form onSubmit={handleAddTask} className="mb-8">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a non-negotiable task"
                className="bg-dark-accent border-white/10 focus:border-neon"
                maxLength={50}
              />
              <Button 
                type="submit" 
                variant="outline" 
                size="icon" 
                className="shrink-0 bg-dark-accent border-white/10 hover:bg-neon/20"
              >
                <Plus className="h-4 w-4 text-neon" />
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4 mb-8">
          {tasks.length === 0 && !tasksLocked ? (
            <div className="text-center py-8 text-gray-400">
              <p>Add up to 3 must-do tasks for today</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-4 rounded-md border ${
                  task.completed 
                    ? 'border-neon/30 bg-neon/5' 
                    : 'border-white/10 bg-dark-accent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-6 w-6 p-0 ${
                      task.completed 
                        ? 'bg-neon text-black' 
                        : 'bg-transparent border border-white/20'
                    }`}
                    onClick={() => completeTask(task.id)}
                    disabled={false}
                  >
                    {task.completed && <Check className="h-3 w-3" />}
                  </Button>
                  
                  <span className={`${task.completed ? 'line-through opacity-70' : ''}`}>
                    {task.text}
                  </span>
                </div>
                
                {!tasksLocked && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-gray-400 hover:text-white hover:bg-destructive/20"
                    onClick={() => removeTask(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          {!tasksLocked ? (
            <Button 
              className="w-full bg-black border border-neon text-neon hover:bg-neon/10"
              disabled={tasks.length === 0}
              onClick={lockTasks}
            >
              <LockKeyhole className="mr-2 h-4 w-4" />
              Save & Lock In
            </Button>
          ) : (
            <Button 
              className="w-full bg-black border border-white/20 text-white hover:bg-white/5"
              onClick={handleNext}
            >
              Continue to Journal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {!tasksLocked && tasks.length > 0 && (
            <Button 
              variant="ghost" 
              className="w-full text-gray-400 hover:text-white"
              onClick={handleNext}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Later
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">
          {tasksLocked ? 
            "These priorities are locked in. Make them happen." : 
            "You cannot hide from this. These are your priorities today."
          }
        </p>
      </div>
    </div>
  );
};

// Add Plus icon since it's not imported from lucide-react
const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default NonNegotiables;
