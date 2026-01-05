import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Activity, Moon, ListTodo, PenTool } from 'lucide-react';
import { MOCK_TASKS, MOCK_LAB_ENTRIES } from '../constants';
import Heatmap from './Heatmap';

// Micro Sparkline Component
const Sparkline = ({ data, color, dataKey }: { data: any[], color: string, dataKey: string }) => (
  <div className="h-10 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const KPICard = ({ title, value, icon: Icon, color, subtext, data, dataKey }: any) => (
  <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className={color} />
        <span className="text-sm text-muted font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-text">{value}</div>
      <div className="text-xs text-muted mt-1">{subtext}</div>
    </div>
    {data && <Sparkline data={data} color={color === 'text-primary' ? '#3B82F6' : color === 'text-health' ? '#10B981' : '#8B5CF6'} dataKey={dataKey} />}
  </div>
);

const Dashboard: React.FC = () => {
  // Mock trend data
  const trendData = Array.from({ length: 7 }, (_, i) => ({ val: Math.random() * 100 }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold font-sans">Command Center</h1>

      {/* KPI Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Sleep" 
          value="7h 12m" 
          subtext="Avg this week" 
          icon={Moon} 
          color="text-primary" 
          data={trendData} 
          dataKey="val" 
        />
        <KPICard 
          title="Readiness" 
          value="82%" 
          subtext="High recovery" 
          icon={Activity} 
          color="text-health" 
          data={trendData} 
          dataKey="val" 
        />
        <KPICard 
          title="Critical Tasks" 
          value="2" 
          subtext="Pending today" 
          icon={ListTodo} 
          color="text-alert" 
        />
        <KPICard 
          title="Writing" 
          value="350" 
          subtext="Goal: 500 words" 
          icon={PenTool} 
          color="text-research" 
          data={trendData} 
          dataKey="val" 
        />
      </div>

      {/* Consistency Zone */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Consistency Graph</h2>
          <span className="text-xs font-mono text-muted bg-zinc-800 px-2 py-1 rounded">2026 YTD</span>
        </div>
        <Heatmap />
      </div>

      {/* Context Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Actions */}
        <div className="bg-surface border border-border rounded-lg p-6 h-full">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ListTodo size={18} className="text-primary" />
            Next Actions
          </h2>
          <div className="space-y-3">
            {MOCK_TASKS.filter(t => t.status === 'pending').map(task => (
              <div key={task.id} className="group flex items-center justify-between p-3 rounded-md hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-sm border ${task.urgent ? 'border-alert bg-alert/10' : 'border-muted'} flex items-center justify-center cursor-pointer`}>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text">{task.title}</div>
                    <div className="text-xs text-muted flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {task.context}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Status */}
        <div className="bg-surface border border-border rounded-lg p-6 h-full">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PenTool size={18} className="text-research" />
            Lab Status
          </h2>
          <div className="space-y-3">
            {MOCK_LAB_ENTRIES.map(entry => (
              <div key={entry.id} className="flex flex-col p-3 rounded-md bg-zinc-950 border border-border">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold font-mono text-text">{entry.title}</span>
                  <span className="text-xs text-muted font-mono">{entry.lastModified}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-muted">{entry.folder}</span>
                  <span className="text-xs font-mono text-research">{entry.wordCount} words</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;