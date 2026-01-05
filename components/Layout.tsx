import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, FlaskConical, Activity, Settings, ChevronLeft, ChevronRight, Search, Image as ImageIcon } from 'lucide-react';
import { NavSection } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavSection;
  onTabChange: (tab: NavSection) => void;
  onCmdK: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onCmdK }) => {
  const [collapsed, setCollapsed] = useState(false);

  const NavItem = ({ id, icon: Icon, label, colorClass }: { id: NavSection, icon: any, label: string, colorClass?: string }) => (
    <button
      onClick={() => onTabChange(id)}
      className={`w-full flex items-center gap-3 p-2 rounded-md transition-all duration-200 group
        ${activeTab === id ? 'bg-zinc-800 text-white' : 'text-muted hover:text-text hover:bg-zinc-800/50'}
        ${collapsed ? 'justify-center' : ''}
      `}
      title={collapsed ? label : undefined}
    >
      <Icon size={20} className={`${activeTab === id ? colorClass || 'text-primary' : 'text-muted group-hover:text-zinc-300'}`} />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${collapsed ? 'w-16' : 'w-64'} bg-surface border-r border-border transition-all duration-300 flex flex-col relative z-20`}
      >
        <div className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-research shrink-0"></div>
            {!collapsed && <span className="font-bold tracking-tight text-lg whitespace-nowrap">OmniTrack</span>}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Command Center" />
          <NavItem id="gtd" icon={CheckSquare} label="GTD" />
          <NavItem id="lab" icon={FlaskConical} label="Lab" colorClass="text-research" />
          <NavItem id="bio" icon={Activity} label="Bio" colorClass="text-health" />
          <NavItem id="vision-board" icon={ImageIcon} label="Vision Board" colorClass="text-purple-400" />
        </nav>

        <div className="p-3 border-t border-border">
          <NavItem id="settings" icon={Settings} label="Settings" />
        </div>

        {/* Sync Status Footer */}
        {!collapsed && (
          <div className="p-4 text-xs font-mono text-zinc-600 border-t border-border bg-zinc-950/30">
             <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Sync: OK</span>
             </div>
             <div>HealthKit: 5m ago</div>
          </div>
        )}

        {/* Collapse Toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-border hover:bg-primary hover:text-white text-muted p-1 rounded-full border border-zinc-950 transition-colors shadow-sm"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
         {/* Top Bar for Mobile/Global Actions */}
         <div className="h-14 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Breadcrumbs / Title */}
            <div className="text-sm font-medium text-muted uppercase tracking-wider">
               {activeTab.replace('-', ' ')}
            </div>

            {/* Global Search Trigger */}
            <button 
               onClick={onCmdK}
               className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-muted hover:border-zinc-700 hover:text-text transition-colors"
            >
               <Search size={14} />
               <span>Search...</span>
               <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 rounded border border-zinc-700 text-zinc-400">⌘K</kbd>
            </button>
         </div>

         {/* Scrollable Content Area */}
         <div className="flex-1 overflow-y-auto p-6 bg-background relative">
            {children}
         </div>
      </main>
    </div>
  );
};

export default Layout;