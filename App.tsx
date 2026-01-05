import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Lab from './components/Lab';
import Bio from './components/Bio';
import GTD from './components/GTD';
import VisionBoard from './components/VisionBoard';
import CommandPalette from './components/CommandPalette';
import { NavSection } from './types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavSection>('dashboard');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);

  // Global Keyboard Shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'lab':
        return <Lab />;
      case 'bio':
        return <Bio />;
      case 'gtd':
        return <GTD />;
      case 'vision-board':
        return <VisionBoard />;
      case 'settings':
         return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
               <h1 className="text-2xl font-bold">Settings</h1>
               
               <div className="bg-surface border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                     <Settings size={18} /> Integrations
                  </h2>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 border border-border rounded bg-zinc-950/50">
                        <div>
                           <div className="font-medium">Apple Health (via Bridge)</div>
                           <div className="text-xs text-emerald-500">Connected • Last sync 5m ago</div>
                        </div>
                        <button className="text-xs bg-zinc-800 px-3 py-1 rounded">Configure</button>
                     </div>
                     <div className="flex items-center justify-between p-3 border border-border rounded bg-zinc-950/50">
                        <div>
                           <div className="font-medium">Oura Cloud API</div>
                           <div className="text-xs text-muted">Not connected</div>
                        </div>
                        <button className="text-xs bg-primary/20 text-primary px-3 py-1 rounded">Connect</button>
                     </div>
                  </div>
               </div>
            </div>
         );
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onCmdK={() => setIsCmdKOpen(true)}
      >
        {renderContent()}
      </Layout>

      <CommandPalette 
        isOpen={isCmdKOpen} 
        onClose={() => setIsCmdKOpen(false)} 
      />
    </>
  );
};

export default App;