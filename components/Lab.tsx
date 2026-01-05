import React, { useState, useEffect, useRef } from 'react';
import { FolderTree, FileText, Database, Shield, Sword, Sparkles, ChevronRight, ChevronDown, GripVertical, Beaker, Calculator, Thermometer, Eye, Edit3 } from 'lucide-react';
import { Monster } from '../types';

// --- Types & Schemas ---

type NodeType = 'project' | 'experiment' | 'file';

interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  children?: FileNode[];
  active?: boolean;
}

interface SchemaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  unit?: string;
  placeholder?: string;
}

const SCHEMAS: Record<string, SchemaField[]> = {
  'generic': [
    { key: 'tags', label: 'Tags', type: 'text', placeholder: '#research' },
    { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'In Review', 'Archived'] }
  ],
  'pcr_protocol': [
    { key: 'target_gene', label: 'Target Gene', type: 'text', placeholder: 'e.g., GAPDH' },
    { key: 'denaturation_temp', label: 'Denaturation Temp', type: 'number', unit: '°C' },
    { key: 'annealing_temp', label: 'Annealing Temp', type: 'number', unit: '°C' },
    { key: 'cycles', label: 'Cycle Count', type: 'number' },
    { key: 'polymerase', label: 'Polymerase Type', type: 'select', options: ['Taq', 'Phusion', 'Q5'] }
  ],
  'western_blot': [
    { key: 'protein', label: 'Target Protein', type: 'text' },
    { key: 'antibody_primary', label: 'Primary Antibody', type: 'text' },
    { key: 'dilution', label: 'Dilution Ratio', type: 'text', placeholder: '1:1000' },
    { key: 'exposure_time', label: 'Exposure', type: 'number', unit: 'sec' }
  ]
};

// --- Mock Data ---

const FILE_TREE: FileNode[] = [
  {
    id: 'proj-1', name: 'Thesis Project', type: 'project', children: [
      {
        id: 'exp-1', name: 'Exp 4A: Reactivity', type: 'experiment', children: [
           { id: 'f-1', name: 'Protocol_PCR_v1.md', type: 'file', active: true },
           { id: 'f-2', name: 'Results_Raw.csv', type: 'file' }
        ]
      },
      { id: 'exp-2', name: 'Exp 4B: Control', type: 'experiment', children: [] }
    ]
  },
  {
    id: 'proj-2', name: 'Lab Admin', type: 'project', children: [
      { id: 'f-3', name: 'Meeting_Notes.md', type: 'file' }
    ]
  }
];

const INITIAL_MONSTER: Monster = {
  name: "Reviewer #2",
  maxHp: 500,
  currentHp: 500
};

// --- Components ---

const TreeNode: React.FC<{ node: FileNode; level: number }> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const Icon = node.type === 'project' ? FolderTree : node.type === 'experiment' ? Beaker : FileText;
  const colorClass = node.type === 'project' ? 'text-primary' : node.type === 'experiment' ? 'text-research' : 'text-muted';

  return (
    <div>
      <div 
        className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-zinc-800/50 transition-colors ${node.active ? 'bg-zinc-800 border-l-2 border-primary' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-muted opacity-50 w-4">
          {node.children && (isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
        </span>
        <Icon size={14} className={colorClass} />
        <span className={`text-sm truncate ${node.active ? 'text-text font-medium' : 'text-zinc-400'}`}>
          {node.name}
        </span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map(child => <TreeNode key={child.id} node={child} level={level + 1} />)}
        </div>
      )}
    </div>
  );
};

const DynamicForm: React.FC<{ schemaType: string }> = ({ schemaType }) => {
  const fields = SCHEMAS[schemaType] || SCHEMAS['generic'];

  return (
    <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
      {fields.map(field => (
        <div key={field.key} className="space-y-1.5">
          <label className="text-xs font-medium text-muted uppercase tracking-wider flex justify-between">
             {field.label}
             {field.unit && <span className="text-zinc-600 normal-case">({field.unit})</span>}
          </label>
          
          {field.type === 'select' ? (
             <select className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-text focus:border-research focus:outline-none focus:ring-1 focus:ring-research/50 transition-all">
                {field.options?.map(opt => <option key={opt}>{opt}</option>)}
             </select>
          ) : (
            <div className="relative">
              <input 
                type={field.type} 
                placeholder={field.placeholder}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-text focus:border-research focus:outline-none focus:ring-1 focus:ring-research/50 transition-all"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Lab: React.FC = () => {
  // Layout State
  const [leftWidth, setLeftWidth] = useState(240);
  const [rightWidth, setRightWidth] = useState(300);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Content State
  const [content, setContent] = useState<string>("# Protocol: PCR Amplification\n\nObjective: Amplify the GAPDH gene.\n\n$$ E = mc^2 $$\n\n1. Prepare the mix.\n2. Run the cycler.");
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [entryType, setEntryType] = useState('pcr_protocol');
  
  // Battle State
  const [wordCount, setWordCount] = useState(0);
  const [monster, setMonster] = useState<Monster>(INITIAL_MONSTER);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Resizing Logic ---
  const startResizeLeft = () => setIsResizingLeft(true);
  const startResizeRight = () => setIsResizingRight(true);
  const stopResize = () => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (isResizingLeft) {
       const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
       if (newWidth > 150 && newWidth < 400) setLeftWidth(newWidth);
    }
    if (isResizingRight) {
       const newWidth = containerRef.current.getBoundingClientRect().right - e.clientX;
       if (newWidth > 200 && newWidth < 500) setRightWidth(newWidth);
    }
  };

  // --- Battle Logic ---
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const diff = words - wordCount;
    if (diff > 0) {
      setMonster(prev => ({ ...prev, currentHp: Math.max(0, prev.currentHp - diff) }));
    }
    setWordCount(words);
    if (monster.currentHp <= 0 && !showConfetti) setShowConfetti(true);
  }, [content]);

  const hpPercentage = (monster.currentHp / monster.maxHp) * 100;
  let barColor = 'bg-health';
  if (hpPercentage < 50) barColor = 'bg-yellow-500';
  if (hpPercentage < 20) barColor = 'bg-alert';

  return (
    <div 
      className="h-[calc(100vh-2rem)] flex flex-col animate-in fade-in duration-500 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
      ref={containerRef}
    >
      
      {/* 1. Top Bar: Battle Mode */}
      <div className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 z-20">
         <div className="flex items-center gap-4 w-1/3">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-alert/30">
                  <Sword size={16} className="text-alert" />
               </div>
               <div>
                  <div className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
                     {monster.name}
                     {monster.currentHp === 0 && <span className="text-yellow-400 text-[10px]">DEFEATED!</span>}
                  </div>
                  <div className="text-[10px] text-muted font-mono">Lvl 5 • HP {monster.currentHp}/{monster.maxHp}</div>
               </div>
            </div>
         </div>

         <div className="flex-1 max-w-lg mx-4">
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
               <div className={`h-full ${barColor} transition-all duration-300 ease-out`} style={{ width: `${hpPercentage}%` }}></div>
            </div>
         </div>

         <div className="w-1/3 flex justify-end items-center gap-3">
            <div className="flex bg-zinc-900 rounded-md p-0.5 border border-zinc-800">
               <button 
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'edit' ? 'bg-zinc-700 text-white' : 'text-muted hover:text-text'}`}
               >
                  <Edit3 size={12} className="inline mr-1" /> Edit
               </button>
               <button 
                   onClick={() => setViewMode('preview')}
                   className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'preview' ? 'bg-zinc-700 text-white' : 'text-muted hover:text-text'}`}
               >
                  <Eye size={12} className="inline mr-1" /> Preview
               </button>
            </div>
         </div>
      </div>

      {/* 2. Main Layout: Resizable Panels */}
      <div className="flex-1 flex overflow-hidden relative">
         
         {/* LEFT PANEL: Explorer */}
         <div style={{ width: leftWidth }} className="bg-background border-r border-border flex flex-col shrink-0">
            <div className="p-3 text-xs font-bold text-muted uppercase tracking-wider border-b border-border/50 flex justify-between items-center">
               <span>Explorer</span>
               <span className="text-[10px] bg-zinc-800 px-1 rounded text-zinc-400">git: main</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
               {FILE_TREE.map((node) => <TreeNode key={node.id} node={node} level={0} />)}
            </div>
         </div>

         {/* Handle Left */}
         <div 
            className="w-1 bg-transparent hover:bg-primary/50 cursor-col-resize z-10 flex items-center justify-center group -ml-0.5"
            onMouseDown={startResizeLeft}
         >
            <div className="h-8 w-1 bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>

         {/* CENTER PANEL: Editor */}
         <div className="flex-1 bg-background flex flex-col min-w-0 relative">
            {viewMode === 'edit' ? (
                <textarea 
                   className="flex-1 w-full h-full bg-background text-text p-8 resize-none focus:outline-none font-mono text-sm leading-relaxed selection:bg-primary/30"
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   spellCheck={false}
                />
            ) : (
                <div className="flex-1 w-full h-full bg-zinc-900/30 text-text p-8 overflow-y-auto prose prose-invert max-w-none">
                    {/* Simulated Markdown & LaTeX Rendering */}
                    {content.split('\n').map((line, i) => {
                        if (line.trim().startsWith('$$')) {
                            return (
                                <div key={i} className="my-4 p-4 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-research font-serif text-lg">
                                    <Calculator size={16} className="mr-2 opacity-50" />
                                    {line.replace(/\$\$/g, '')}
                                </div>
                            );
                        }
                        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mb-4">{line.replace('# ', '')}</h1>;
                        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mb-3 mt-6 text-primary">{line.replace('## ', '')}</h2>;
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i} className="mb-2 text-zinc-300">{line}</p>;
                    })}
                </div>
            )}
            
            {showConfetti && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <div className="bg-surface/95 border border-yellow-500/50 p-6 rounded-xl shadow-2xl backdrop-blur-sm text-center animate-bounce">
                     <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                     <h3 className="text-xl font-bold text-text">Victory!</h3>
                     <p className="text-muted text-sm mb-4">Reviewer #2 has been silenced.</p>
                     <button 
                        onClick={() => { setShowConfetti(false); setMonster(INITIAL_MONSTER); }}
                        className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-blue-600 pointer-events-auto"
                     >
                        New Battle
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* Handle Right */}
         <div 
            className="w-1 bg-transparent hover:bg-research/50 cursor-col-resize z-10 flex items-center justify-center group -mr-0.5"
            onMouseDown={startResizeRight}
         >
            <div className="h-8 w-1 bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>

         {/* RIGHT PANEL: Inspector */}
         <div style={{ width: rightWidth }} className="bg-surface border-l border-border flex flex-col shrink-0">
            <div className="p-3 border-b border-border flex items-center gap-2 bg-zinc-900/50">
               <Database size={14} className="text-research" />
               <span className="text-xs font-bold text-text uppercase">Data Inspector</span>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
               {/* Note Type Selector */}
               <div className="p-3 bg-zinc-900 rounded border border-zinc-800">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2 block">Entry Type Schema</label>
                  <div className="flex items-center gap-2 text-sm text-white">
                      <select 
                        value={entryType}
                        onChange={(e) => setEntryType(e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded p-1.5 focus:border-research focus:outline-none"
                      >
                          <option value="generic">Generic Note</option>
                          <option value="pcr_protocol">PCR Protocol</option>
                          <option value="western_blot">Western Blot</option>
                      </select>
                  </div>
               </div>

               {/* Dynamic Form */}
               <DynamicForm schemaType={entryType} />

               {/* Status Indicator */}
               <div className="pt-4 border-t border-border mt-auto">
                   <div className="flex items-center gap-2 text-xs text-muted font-mono">
                       <Shield size={12} className="text-emerald-500" />
                       Schema Validation: PASS
                   </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default Lab;