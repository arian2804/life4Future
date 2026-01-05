import React, { useEffect, useState } from 'react';
import { Search, Plus, FlaskConical, Moon, CheckSquare, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  // Trap focus and handle escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface border border-zinc-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search size={20} className="text-muted" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-text ml-3 placeholder-muted font-sans text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="text-muted hover:text-text"><X size={18} /></button>
        </div>

        <div className="py-2">
          <div className="px-4 py-2 text-xs font-bold text-muted uppercase tracking-wider">Suggested</div>
          <div className="space-y-1 px-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-md transition-colors group">
               <Plus size={16} className="text-muted group-hover:text-primary" />
               New Experiment
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-md transition-colors group">
               <CheckSquare size={16} className="text-muted group-hover:text-primary" />
               Quick Task Capture
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-md transition-colors group">
               <Moon size={16} className="text-muted group-hover:text-primary" />
               Log Sleep Data
            </button>
             <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-md transition-colors group">
               <FlaskConical size={16} className="text-muted group-hover:text-primary" />
               Go to Lab Notebook
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-md transition-colors group">
               <ImageIcon size={16} className="text-muted group-hover:text-primary" />
               View Vision Board
            </button>
          </div>
          
          <div className="px-4 py-2 mt-2 text-xs font-mono text-zinc-600 border-t border-border/50">
             Press ↵ to select
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;