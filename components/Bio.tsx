import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import { MOCK_METRICS, MOCK_HABITS, MOCK_WEIGHT_DATA } from '../constants';
import { Habit, WeightEntry } from '../types';
import { Flame, Snowflake, CheckCircle, XCircle, X, Plus, RotateCcw, AlertTriangle, Activity, BarChart2, Archive, ArchiveRestore, Target, Pencil, Save, Check, Scale, TrendingDown, TrendingUp, Minus } from 'lucide-react';

// Mini Sparkline for Table
const HabitSparkline = ({ data }: { data: number[] }) => {
  // Transform number array to object array for Recharts
  const chartData = data.map((val, i) => ({ i, val }));
  
  return (
    <div className="h-8 w-24 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="val" 
            stroke="#10B981" 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Mini Bar Chart for Table
const HabitBarChart = ({ data }: { data: number[] }) => {
  const chartData = data.map((val, i) => ({ i, val }));
  return (
    <div className="h-8 w-24 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <Bar 
            dataKey="val" 
            fill="#10B981" 
            radius={[2, 2, 0, 0]} 
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ModalProps {
  habit: Habit;
  onClose: () => void;
  onUpdate: (habit: Habit) => void;
}

const HabitDetailModal: React.FC<ModalProps> = ({ habit, onClose, onUpdate }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(habit.dailyGoal || '');

  const chartData = habit.history.map((val, i) => ({ 
    day: `Day ${i + 1}`, 
    val 
  }));

  const averageScore = Math.round(habit.history.reduce((a, b) => a + b, 0) / habit.history.length);

  const handleResetStreak = () => {
    onUpdate({ ...habit, streak: 0 });
    setShowResetConfirm(false);
  };

  const handleArchiveToggle = () => {
    onUpdate({ ...habit, archived: !habit.archived });
    onClose();
  };

  const saveGoal = () => {
    onUpdate({ ...habit, dailyGoal: goalInput });
    setIsEditingGoal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-border bg-zinc-900/50">
             <div>
                <h3 className="text-xl font-bold text-text flex items-center gap-2">
                  {habit.name}
                  {habit.archived && <span className="text-xs font-normal text-muted bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">Archived</span>}
                </h3>
                <p className="text-sm text-muted">7-Day Performance History</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-muted hover:text-text transition-colors">
                <X size={20} />
             </button>
          </div>
          
          <div className="p-6 space-y-6">
             {/* Stats Grid */}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                   <div className="text-xs text-muted uppercase tracking-wider mb-1">Current Streak</div>
                   <div className="text-2xl font-bold text-text flex items-center gap-1">
                      {habit.streak} <Flame size={18} className="text-orange-500 fill-orange-500" />
                   </div>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                   <div className="text-xs text-muted uppercase tracking-wider mb-1">Avg Score</div>
                   <div className="text-2xl font-bold text-primary">
                      {averageScore}%
                   </div>
                </div>
                 <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                   <div className="text-xs text-muted uppercase tracking-wider mb-1">Status</div>
                   <div className="text-lg font-bold capitalize text-text flex items-center gap-2">
                       {habit.status === 'completed' && <CheckCircle className="text-health" size={20} />}
                       {habit.status === 'missed' && <XCircle className="text-alert" size={20} />}
                       {habit.status === 'frozen' && <Snowflake className="text-blue-400" size={20} />}
                       {habit.status === 'pending' && <div className="w-5 h-5 rounded border-2 border-muted"></div>}
                       {habit.status !== 'pending' && habit.status}
                       {habit.status === 'pending' && "Pending"}
                   </div>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center justify-center text-center relative group">
                   <div className="text-xs text-muted uppercase tracking-wider mb-1">Daily Goal</div>
                   {isEditingGoal ? (
                       <div className="flex items-center gap-1 w-full">
                           <input 
                              type="text" 
                              value={goalInput}
                              onChange={(e) => setGoalInput(e.target.value)}
                              className="w-full bg-zinc-800 text-xs text-center border-none rounded py-1 focus:ring-1 focus:ring-primary"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                           />
                           <button onClick={saveGoal} className="text-health hover:text-emerald-400"><Save size={14} /></button>
                       </div>
                   ) : (
                       <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditingGoal(true)}>
                           <div className="text-lg font-bold text-text truncate max-w-[100px]" title={habit.dailyGoal || 'Set Goal'}>
                              {habit.dailyGoal || 'Set Goal'}
                           </div>
                           <Pencil size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                   )}
                </div>
             </div>

             {/* Chart */}
             <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-muted">Daily Completion Rate</h4>
                    {habit.dailyGoal && (
                        <div className="text-xs flex items-center gap-1 text-muted bg-zinc-800/50 px-2 py-1 rounded">
                            <Target size={12} />
                            Target: <span className="text-text font-medium">{habit.dailyGoal}</span>
                        </div>
                    )}
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                          <XAxis dataKey="day" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{ fill: '#27272A' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-surface border border-border p-2 rounded shadow-lg text-xs">
                                    <p className="text-muted mb-1">{payload[0].payload.day}</p>
                                    <p className="text-health font-bold">Score: {payload[0].value}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="val" fill="#10B981" radius={[4, 4, 0, 0]} activeBar={{ fill: '#34D399' }} />
                      </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Actions */}
             <div className="flex justify-between items-center pt-2 border-t border-border">
                <button
                    onClick={handleArchiveToggle}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted hover:text-text hover:bg-zinc-800 rounded-md transition-colors"
                >
                    {habit.archived ? (
                        <>
                            <ArchiveRestore size={14} />
                            Restore Habit
                        </>
                    ) : (
                        <>
                            <Archive size={14} />
                            Archive Habit
                        </>
                    )}
                </button>

                {!showResetConfirm ? (
                    <button 
                        onClick={() => setShowResetConfirm(true)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-alert hover:bg-alert/10 rounded-md transition-colors border border-transparent hover:border-alert/20"
                    >
                        <RotateCcw size={14} />
                        Reset Streak
                    </button>
                ) : (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 bg-alert/5 p-2 rounded-md border border-alert/20">
                        <AlertTriangle size={16} className="text-alert" />
                        <span className="text-xs font-medium text-text">Reset streak to 0?</span>
                        <div className="flex gap-2">
                           <button 
                              onClick={() => setShowResetConfirm(false)}
                              className="px-2 py-1 text-xs text-muted hover:text-text bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
                           >
                              Cancel
                           </button>
                           <button 
                              onClick={handleResetStreak}
                              className="px-2 py-1 text-xs text-white bg-alert hover:bg-red-600 rounded transition-colors font-medium shadow-sm shadow-red-900/20"
                           >
                              Confirm
                           </button>
                        </div>
                    </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

const Bio: React.FC = () => {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitGoal, setNewHabitGoal] = useState('');
  const [newHabitStatus, setNewHabitStatus] = useState<Habit['status']>('pending');
  const [trendMode, setTrendMode] = useState<'line' | 'bar'>('line');
  const [showArchived, setShowArchived] = useState(false);
  const [freezeItems, setFreezeItems] = useState(2); 

  // Weight State
  const [weightData, setWeightData] = useState<WeightEntry[]>(MOCK_WEIGHT_DATA);
  const [weightInput, setWeightInput] = useState('');

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      streak: 0,
      status: newHabitStatus,
      // Initialize with zero data for graph
      history: [0, 0, 0, 0, 0, 0, 0],
      archived: false,
      dailyGoal: newHabitGoal || undefined
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitGoal('');
    setNewHabitStatus('pending');
    setShowAddForm(false);
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
    setSelectedHabit(updatedHabit); 
  };

  const toggleHabitToday = (id: string, currentStatus: Habit['status']) => {
    if (currentStatus === 'frozen') {
        setFreezeItems(prev => prev + 1);
    }

    setHabits(prev => prev.map(h => {
        if (h.id !== id) return h;

        const isCompleting = currentStatus !== 'completed';
        const newStatus = isCompleting ? 'completed' : 'pending';
        
        let newStreak = h.streak;
        if (currentStatus === 'frozen') {
            newStreak = h.streak + 1; 
        } else if (currentStatus === 'completed') {
            newStreak = Math.max(0, h.streak - 1); 
        } else {
            newStreak = h.streak + 1; 
        }
        
        const newHistory = [...h.history];
        if (newHistory.length > 0) {
            newHistory[newHistory.length - 1] = isCompleting ? 100 : 0;
        }

        return {
            ...h,
            status: newStatus,
            streak: newStreak,
            history: newHistory
        };
    }));
  };

  const toggleFreeze = (id: string, currentStatus: Habit['status']) => {
      if (currentStatus === 'frozen') {
          // Unfreeze (Refund item, go to Pending)
          setFreezeItems(prev => prev + 1);
          setHabits(prev => prev.map(h => {
              if (h.id !== id) return h;
              return { ...h, status: 'pending' };
          }));
      } else {
          // Freeze (Consume item, go to Frozen)
          if (freezeItems > 0) {
              setFreezeItems(prev => prev - 1);
              setHabits(prev => prev.map(h => {
                  if (h.id !== id) return h;
                  
                  let newStreak = h.streak;
                  if (currentStatus === 'completed') {
                      newStreak = Math.max(0, h.streak - 1);
                  }
                  
                  const newHistory = [...h.history];
                  if (newHistory.length > 0) {
                      newHistory[newHistory.length - 1] = 0; 
                  }

                  return { ...h, status: 'frozen', streak: newStreak, history: newHistory };
              }));
          }
      }
  };

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 0) return;

    // For demo purposes, we allow multiple entries for the same "day" visually
    const today = `Feb ${new Date().getDate()}`;
    
    setWeightData(prev => [...prev, { date: today, weight: val }]);
    setWeightInput('');
  };

  const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;
  const startWeight = weightData.length > 0 ? weightData[0].weight : 0;
  const netChange = currentWeight - startWeight;
  const minWeight = weightData.length > 0 ? Math.min(...weightData.map(d => d.weight)) : 0;

  const displayedHabits = habits.filter(h => showArchived ? h.archived : !h.archived);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold font-sans flex items-center gap-2">
        <span className="text-health">Bio</span> & Quantified Self
      </h1>

      {/* Main Correlation Chart */}
      {!showArchived && (
        <div className="bg-surface border border-border rounded-lg p-6">
            <div className="mb-6">
            <h2 className="text-lg font-semibold">Sleep vs. Productivity</h2>
            <p className="text-sm text-muted">Correlating hours of sleep with daily word count output.</p>
            </div>
            
            <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_METRICS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    stroke="#71717A" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    yAxisId="left" 
                    stroke="#3B82F6" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[4, 12]}
                    label={{ value: 'Sleep (h)', angle: -90, position: 'insideLeft', fill: '#3B82F6' }}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#8B5CF6" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    label={{ value: 'Words', angle: 90, position: 'insideRight', fill: '#8B5CF6' }}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px' }}
                    itemStyle={{ color: '#E4E4E7' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sleepHours" 
                    stroke="#3B82F6" 
                    name="Sleep (hrs)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#3B82F6' }}
                />
                <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="wordsWritten" 
                    stroke="#8B5CF6" 
                    name="Words Written"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#8B5CF6' }}
                />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>
      )}

      {/* Weight Tracker Section */}
      {!showArchived && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats & Input Card */}
            <div className="bg-surface border border-border rounded-lg p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Scale size={20} className="text-health" />
                        <h2 className="text-lg font-semibold">Body Metrics</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                            <div className="text-xs text-muted uppercase tracking-wider mb-1">Current</div>
                            <div className="text-2xl font-bold text-text">{currentWeight} <span className="text-sm font-normal text-muted">kg</span></div>
                        </div>
                        <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                            <div className="text-xs text-muted uppercase tracking-wider mb-1">Lowest</div>
                            <div className="text-2xl font-bold text-text">{minWeight} <span className="text-sm font-normal text-muted">kg</span></div>
                        </div>
                        <div className="col-span-2 p-3 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-muted uppercase tracking-wider mb-1">Net Change</div>
                                <div className={`text-xl font-bold flex items-center gap-1 ${netChange <= 0 ? 'text-health' : 'text-alert'}`}>
                                    {netChange <= 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                                    {Math.abs(netChange).toFixed(1)} kg
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted mb-1">Start</div>
                                <div className="text-sm font-mono text-text">{startWeight} kg</div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleLogWeight} className="mt-auto">
                    <label className="text-xs font-medium text-muted block mb-1.5">Log Today's Weight</label>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            step="0.1" 
                            placeholder="e.g. 80.5" 
                            value={weightInput}
                            onChange={(e) => setWeightInput(e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-health placeholder-zinc-700"
                        />
                        <button 
                            type="submit"
                            disabled={!weightInput}
                            className="bg-health text-zinc-950 px-4 py-2 rounded text-sm font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Log
                        </button>
                    </div>
                </form>
            </div>

            {/* Chart Card */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weightData}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#71717A" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#71717A" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                domain={['dataMin - 1', 'dataMax + 1']}
                                unit="kg"
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px' }}
                                itemStyle={{ color: '#10B981' }}
                                formatter={(value: number) => [`${value} kg`, 'Weight']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="#10B981" 
                                fillOpacity={1} 
                                fill="url(#colorWeight)" 
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      )}

      {/* Habit Tracker */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <h2 className="text-lg font-semibold">{showArchived ? 'Archived Habits' : 'Habit Protocol'}</h2>
             {!showArchived && (
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400 text-xs font-medium">
                     <Snowflake size={12} />
                     <span>{freezeItems} Freezes</span>
                 </div>
             )}
             {showArchived && (
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-muted uppercase border border-zinc-700">
                    Archive View
                 </span>
             )}
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={() => setShowArchived(!showArchived)}
                className={`p-1.5 rounded transition-colors border border-transparent hover:border-zinc-700 ${showArchived ? 'bg-zinc-800 text-text' : 'text-muted hover:text-text hover:bg-zinc-800'}`}
                title={showArchived ? "View Active Habits" : "View Archive"}
            >
                {showArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
            </button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <button
              onClick={() => setTrendMode(prev => prev === 'line' ? 'bar' : 'line')}
              className="p-1.5 text-muted hover:text-text rounded hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
              title={`Switch to ${trendMode === 'line' ? 'Bar Chart' : 'Line Chart'} view`}
            >
                {trendMode === 'line' ? <BarChart2 size={16} /> : <Activity size={16} />}
            </button>
            {!showArchived && (
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-transparent rounded-md transition-all ${showAddForm ? 'bg-zinc-800 text-white' : 'bg-zinc-800 text-muted hover:text-white hover:bg-zinc-700'}`}
                >
                    {showAddForm ? <X size={14} /> : <Plus size={14} />}
                    <span>{showAddForm ? 'Cancel' : 'Add Habit'}</span>
                </button>
            )}
          </div>
        </div>

        {showAddForm && !showArchived && (
          <form onSubmit={handleAddHabit} className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-muted">Habit Name</label>
                <input 
                  type="text" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Drink 2L Water"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-primary placeholder-zinc-700"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted">Daily Goal <span className="text-zinc-600">(Optional)</span></label>
                <input 
                  type="text" 
                  value={newHabitGoal}
                  onChange={(e) => setNewHabitGoal(e.target.value)}
                  placeholder="e.g. 2 Liters"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-primary placeholder-zinc-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted">Initial Status</label>
                <select 
                  value={newHabitStatus}
                  onChange={(e) => setNewHabitStatus(e.target.value as Habit['status'])}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button 
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                >
                    Create Habit
                </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto min-h-[200px]">
          {displayedHabits.length > 0 ? (
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-border text-muted text-sm font-medium">
                    <th className="py-3 px-2">Habit</th>
                    <th className="py-3 px-2 text-center">Status (Today)</th>
                    <th className="py-3 px-2 text-center">Current Streak</th>
                    <th className="py-3 px-2 text-right">Trend (7d)</th>
                </tr>
                </thead>
                <tbody>
                {displayedHabits.map((habit) => (
                    <tr 
                    key={habit.id} 
                    onClick={() => setSelectedHabit(habit)}
                    className="border-b border-border/50 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                    >
                    <td className="py-3 px-2 font-medium text-text group-hover:text-primary transition-colors">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                {habit.name}
                                {habit.streak > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/20">
                                        <Flame size={10} className="fill-orange-500" />
                                        <span className="font-mono">{habit.streak}</span>
                                    </span>
                                )}
                            </div>
                            {habit.dailyGoal && (
                                <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                                    <Target size={10} />
                                    {habit.dailyGoal}
                                </div>
                            )}
                        </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleHabitToday(habit.id, habit.status);
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-primary ${
                                    habit.status === 'completed' 
                                        ? 'bg-health text-zinc-950 hover:bg-emerald-400' 
                                        : habit.status === 'missed'
                                            ? 'bg-alert/10 text-alert border border-alert/30 hover:bg-alert/20'
                                            : habit.status === 'frozen'
                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                                : 'bg-zinc-800/50 text-muted hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600'
                                }`}
                                title={habit.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
                            >
                                {habit.status === 'completed' && <Check size={18} strokeWidth={3} />}
                                {habit.status === 'missed' && <X size={18} />}
                                {habit.status === 'frozen' && <Snowflake size={18} />}
                                {habit.status === 'pending' && <Check size={18} className="opacity-0 hover:opacity-100 text-zinc-500" />}
                            </button>
                            
                            {/* Freeze Action Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFreeze(habit.id, habit.status);
                                }}
                                disabled={habit.status !== 'frozen' && freezeItems <= 0}
                                className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                                    habit.status === 'frozen'
                                        ? 'bg-blue-500 text-white'
                                        : freezeItems > 0
                                            ? 'text-zinc-600 hover:text-blue-400 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100'
                                            : 'text-zinc-800 opacity-0 group-hover:opacity-100 cursor-not-allowed'
                                }`}
                                title={habit.status === 'frozen' ? 'Unfreeze' : `Freeze (${freezeItems} left)`}
                            >
                                <Snowflake size={14} />
                            </button>
                        </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono">
                        {habit.streak}
                        {habit.streak > 0 && <Flame className="text-orange-500 fill-orange-500" size={14} />}
                        </div>
                    </td>
                    <td className="py-3 px-2">
                        <div className="flex justify-end">
                            {trendMode === 'line' ? (
                                <HabitSparkline data={habit.history} />
                            ) : (
                                <HabitBarChart data={habit.history} />
                            )}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted">
                  {showArchived ? (
                      <>
                        <Archive size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No archived habits found.</p>
                      </>
                  ) : (
                      <>
                        <Activity size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No active habits. Create one above.</p>
                      </>
                  )}
              </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedHabit && (
        <HabitDetailModal 
          habit={selectedHabit} 
          onClose={() => setSelectedHabit(null)} 
          onUpdate={handleUpdateHabit}
        />
      )}
    </div>
  );
};

export default Bio;