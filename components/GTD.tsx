import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  CheckSquare, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Folder, 
  Flag, 
  MoreHorizontal, 
  Trash2, 
  Tag, 
  Briefcase,
  Sparkles,
  Archive,
  ArrowRight,
  X
} from 'lucide-react';
import { MOCK_TASKS, MOCK_PROJECTS } from '../constants';
import { Task, Project } from '../types';

type ViewMode = 'inbox' | 'next' | 'urgent' | 'completed' | 'archived' | string;

interface HygieneSuggestion {
  id: string;
  taskId: string;
  type: 'stale_inbox' | 'obsolete_task';
  message: string;
  daysOld: number;
}

const GTD: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeView, setActiveView] = useState<ViewMode>('next');
  
  // Hygiene State
  const [suggestions, setSuggestions] = useState<HygieneSuggestion[]>([]);
  const [showHygienePanel, setShowHygienePanel] = useState(true);

  // Quick Add State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskContext, setNewTaskContext] = useState<Task['context']>('Deep Work');
  const [newTaskUrgent, setNewTaskUrgent] = useState(false);
  
  // Project Add State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // --- Automated Hygiene Logic ---
  useEffect(() => {
    const runHygieneCheck = () => {
      const newSuggestions: HygieneSuggestion[] = [];
      const now = new Date();

      tasks.forEach(task => {
        if (task.status !== 'pending') return;

        const created = new Date(task.createdAt || now);
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        // Check 1: Inbox items sitting too long (Active Flow)
        if (task.context === 'Inbox' && diffDays > 3) {
          newSuggestions.push({
            id: `h-inbox-${task.id}`,
            taskId: task.id,
            type: 'stale_inbox',
            message: `Stuck in Inbox for ${diffDays} days. Process or Archive?`,
            daysOld: diffDays
          });
        }

        // Check 2: Stale pending tasks (Obsolete detection)
        if (task.context !== 'Inbox' && diffDays > 14) {
           newSuggestions.push({
            id: `h-stale-${task.id}`,
            taskId: task.id,
            type: 'obsolete_task',
            message: `Task inactive for ${diffDays} days. Is this still relevant?`,
            daysOld: diffDays
          });
        }
      });

      // Sort by age
      newSuggestions.sort((a, b) => b.daysOld - a.daysOld);
      setSuggestions(newSuggestions);
    };

    runHygieneCheck();
  }, [tasks]);

  const handleHygieneAction = (suggestion: HygieneSuggestion, action: 'archive' | 'dismiss') => {
      if (action === 'archive') {
          handleArchiveTask(suggestion.taskId);
      }
      // Remove suggestion from local state
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  // --- Filtering Logic ---
  const getFilteredTasks = () => {
    switch (activeView) {
      case 'inbox':
        return tasks.filter(t => t.context === 'Inbox' && t.status === 'pending');
      case 'next':
        return tasks.filter(t => t.status === 'pending');
      case 'urgent':
        return tasks.filter(t => t.urgent && t.status === 'pending');
      case 'completed':
        return tasks.filter(t => t.status === 'completed');
      case 'archived':
        return tasks.filter(t => t.status === 'archived');
      default:
        // Filter by Project ID
        return tasks.filter(t => t.projectId === activeView && t.status !== 'archived');
    }
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'inbox': return 'Inbox';
      case 'next': return 'Next Actions';
      case 'urgent': return 'Urgent / Important';
      case 'completed': return 'Logbook';
      case 'archived': return 'Archives';
      default: 
        return projects.find(p => p.id === activeView)?.title || 'Project';
    }
  };

  // --- Actions ---
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } 
        : t
    ));
  };

  const handleArchiveTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'archived' } : t
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const projectId = MOCK_PROJECTS.find(p => p.id === activeView)?.id;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      context: activeView === 'inbox' ? 'Inbox' : newTaskContext,
      status: 'pending',
      urgent: newTaskUrgent,
      projectId: projectId, // If currently viewing a project, assign to it
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskUrgent(false);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProject: Project = {
      id: `p-${Date.now()}`,
      title: newProjectTitle,
      status: 'active',
      color: 'bg-zinc-500'
    };

    setProjects([...projects, newProject]);
    setNewProjectTitle('');
    setIsAddingProject(false);
  };

  const getProjectProgress = (pid: string) => {
    const projectTasks = tasks.filter(t => t.projectId === pid && t.status !== 'archived');
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] animate-in fade-in duration-500">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-4 space-y-1">
          <button 
            onClick={() => setActiveView('inbox')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeView === 'inbox' ? 'bg-zinc-800 text-text font-medium' : 'text-muted hover:bg-zinc-800/50 hover:text-text'}`}
          >
            <Inbox size={16} /> Inbox
          </button>
          <button 
            onClick={() => setActiveView('next')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeView === 'next' ? 'bg-zinc-800 text-text font-medium' : 'text-muted hover:bg-zinc-800/50 hover:text-text'}`}
          >
            <CheckSquare size={16} /> Next Actions
          </button>
          <button 
            onClick={() => setActiveView('urgent')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeView === 'urgent' ? 'bg-zinc-800 text-text font-medium' : 'text-muted hover:bg-zinc-800/50 hover:text-text'}`}
          >
            <Flag size={16} className="text-alert" /> Urgent
          </button>
           <button 
            onClick={() => setActiveView('completed')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeView === 'completed' ? 'bg-zinc-800 text-text font-medium' : 'text-muted hover:bg-zinc-800/50 hover:text-text'}`}
          >
            <CheckCircle2 size={16} /> Logbook
          </button>
           <button 
            onClick={() => setActiveView('archived')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeView === 'archived' ? 'bg-zinc-800 text-text font-medium' : 'text-muted hover:bg-zinc-800/50 hover:text-text'}`}
          >
            <Archive size={16} /> Archives
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Projects</span>
            <button onClick={() => setIsAddingProject(!isAddingProject)} className="text-muted hover:text-primary transition-colors">
              <Plus size={14} />
            </button>
          </div>

          {isAddingProject && (
            <form onSubmit={handleAddProject} className="mb-3 animate-in slide-in-from-top-1">
              <input 
                autoFocus
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Project name..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-text focus:border-primary focus:outline-none placeholder-zinc-700"
                onBlur={() => !newProjectTitle && setIsAddingProject(false)}
              />
            </form>
          )}

          <div className="space-y-0.5">
            {projects.map(project => {
              const isActive = activeView === project.id;
              const progress = getProjectProgress(project.id);
              return (
                <button
                  key={project.id}
                  onClick={() => setActiveView(project.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${project.color || 'bg-zinc-500'}`}></div>
                    <span className={`truncate ${isActive ? 'text-text' : 'text-muted group-hover:text-text'}`}>{project.title}</span>
                  </div>
                  {progress > 0 && progress < 100 && (
                     <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden ml-2">
                        <div className="h-full bg-zinc-600" style={{ width: `${progress}%` }}></div>
                     </div>
                  )}
                  {progress === 100 && <CheckCircle2 size={12} className="text-health ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        
        {/* Hygiene Alert Panel */}
        {suggestions.length > 0 && showHygienePanel && (
           <div className="px-8 pt-6 pb-2">
              <div className="bg-surface/50 border border-research/20 rounded-lg p-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-research/10 flex items-center justify-center border border-research/20">
                             <Sparkles size={16} className="text-research" />
                          </div>
                          <div>
                             <h3 className="text-sm font-bold text-text">System Hygiene</h3>
                             <p className="text-xs text-muted">Active Flow Optimization detected {suggestions.length} potential actions.</p>
                          </div>
                      </div>
                      <button onClick={() => setShowHygienePanel(false)} className="text-muted hover:text-text">
                          <X size={16} />
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      {suggestions.slice(0, 4).map(s => {
                          const taskTitle = tasks.find(t => t.id === s.taskId)?.title || 'Unknown Task';
                          return (
                              <div key={s.id} className="flex items-center justify-between bg-zinc-950 p-2.5 rounded border border-zinc-800">
                                  <div className="min-w-0 pr-4">
                                      <div className="text-xs font-medium text-text truncate">"{taskTitle}"</div>
                                      <div className="text-[10px] text-muted flex items-center gap-1">
                                          {s.type === 'stale_inbox' ? <Inbox size={10} className="text-alert" /> : <Archive size={10} className="text-orange-400" />}
                                          {s.message}
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                      <button 
                                          onClick={() => handleHygieneAction(s, 'dismiss')}
                                          className="text-[10px] text-muted hover:text-text px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                                      >
                                          Keep
                                      </button>
                                      <button 
                                          onClick={() => handleHygieneAction(s, 'archive')}
                                          className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-text px-2 py-1 rounded border border-zinc-700 transition-colors flex items-center gap-1"
                                      >
                                          <Archive size={10} />
                                          Archive
                                      </button>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
           </div>
        )}

        {/* Header */}
        <header className="px-8 py-6 border-b border-border bg-background">
          <h1 className="text-2xl font-bold font-sans text-text mb-1">{getPageTitle()}</h1>
          <p className="text-sm text-muted">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} remaining
          </p>
        </header>

        {/* Task Input */}
        <div className="px-8 py-4 bg-background">
           <form onSubmit={handleAddTask} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
              <Plus size={20} className="text-muted" />
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={activeView === 'inbox' ? "Capture a thought..." : `Add task to ${getPageTitle()}...`}
                className="flex-1 bg-transparent border-none outline-none text-text placeholder-zinc-600"
              />
              
              <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
                 <button 
                    type="button"
                    onClick={() => setNewTaskUrgent(!newTaskUrgent)}
                    className={`p-1.5 rounded hover:bg-zinc-800 transition-colors ${newTaskUrgent ? 'text-alert bg-alert/10' : 'text-muted'}`}
                    title="Toggle Urgent"
                 >
                    <Flag size={16} className={newTaskUrgent ? "fill-alert" : ""} />
                 </button>
                 
                 {activeView !== 'inbox' && (
                   <select 
                      value={newTaskContext}
                      onChange={(e) => setNewTaskContext(e.target.value as any)}
                      className="bg-zinc-950 text-xs text-muted border border-zinc-800 rounded px-2 py-1.5 focus:outline-none hover:border-zinc-700 cursor-pointer"
                   >
                      <option value="Deep Work">Deep Work</option>
                      <option value="Errands">Errands</option>
                      <option value="Admin">Admin</option>
                   </select>
                 )}
              </div>
           </form>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
           {filteredTasks.length > 0 ? (
             <div className="space-y-2">
                {filteredTasks.map(task => {
                   const isCompleted = task.status === 'completed';
                   const isArchived = task.status === 'archived';
                   
                   return (
                     <div 
                        key={task.id}
                        className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                           isCompleted || isArchived
                              ? 'bg-zinc-900/30 border-transparent opacity-60 hover:opacity-100' 
                              : 'bg-surface border-border hover:border-zinc-700 hover:shadow-sm'
                        }`}
                     >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                           <button 
                              onClick={() => handleToggleTask(task.id)}
                              disabled={isArchived}
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                 isCompleted 
                                    ? 'bg-primary border-primary text-white' 
                                    : isArchived
                                        ? 'bg-zinc-800 border-zinc-700 text-muted'
                                        : 'border-muted hover:border-primary text-transparent'
                              }`}
                           >
                              {isCompleted && <CheckCircle2 size={14} />}
                              {isArchived && <Archive size={12} />}
                           </button>
                           
                           <div className="flex flex-col min-w-0">
                              <span className={`text-sm font-medium truncate ${isCompleted || isArchived ? 'text-muted line-through decoration-zinc-700' : 'text-text'}`}>
                                 {task.title}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                    task.context === 'Deep Work' ? 'bg-research/10 text-research border-research/20' :
                                    task.context === 'Errands' ? 'bg-primary/10 text-primary border-primary/20' :
                                    task.context === 'Inbox' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                                 }`}>
                                    {task.context}
                                 </span>
                                 {task.projectId && activeView !== task.projectId && (
                                    <span className="flex items-center gap-1 text-[10px] text-muted">
                                       <Briefcase size={10} />
                                       {projects.find(p => p.id === task.projectId)?.title}
                                    </span>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 pl-4">
                           {task.urgent && !isCompleted && !isArchived && (
                              <div className="flex items-center gap-1 text-xs font-medium text-alert bg-alert/5 px-2 py-1 rounded-full border border-alert/10">
                                 <Flag size={12} className="fill-alert" />
                                 <span>Urgent</span>
                              </div>
                           )}
                           
                           {!isArchived && (
                               <button 
                                onClick={() => handleArchiveTask(task.id)}
                                title="Archive"
                                className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-zinc-800 rounded"
                               >
                                <Archive size={16} />
                               </button>
                           )}

                           <button 
                              onClick={() => handleDeleteTask(task.id)}
                              title="Delete Permanently"
                              className="text-zinc-700 hover:text-alert opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-zinc-800 rounded"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                   );
                })}
             </div>
           ) : (
             <div className="h-64 flex flex-col items-center justify-center text-muted">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                   <CheckSquare size={32} className="opacity-20" />
                </div>
                <p className="text-sm">No tasks found in {getPageTitle()}.</p>
                <p className="text-xs text-zinc-600 mt-1">Press Enter in the bar above to add one.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default GTD;