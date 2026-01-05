import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { MOCK_VISION_BOARD } from '../constants';
import { VisionItem } from '../types';

const VisionBoard: React.FC = () => {
  const [items, setItems] = useState<VisionItem[]>(MOCK_VISION_BOARD);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setItems([{ id: Date.now().toString(), url: newUrl, caption: newCaption }, ...items]);
    setNewUrl('');
    setNewCaption('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold font-sans flex items-center gap-2">
             <span className="text-purple-400">Vision</span> Board
           </h1>
           <p className="text-sm text-muted">Visualize your dreams and aspirations.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-surface border border-border rounded-lg p-4 animate-in slide-in-from-top-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Caption (optional)"
                className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              />
           </div>
           <div className="mt-3 flex justify-end">
              <button type="submit" className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-blue-600">
                 Add to Board
              </button>
           </div>
        </form>
      )}

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {items.map((item) => (
           <div key={item.id} className="relative group break-inside-avoid rounded-xl overflow-hidden bg-zinc-900 border border-border shadow-sm hover:shadow-xl transition-all duration-300">
              <img src={item.url} alt={item.caption} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                 {item.caption && <p className="text-white font-medium text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.caption}</p>}
                 <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove"
                 >
                    <Trash2 size={14} />
                 </button>
              </div>
           </div>
        ))}
      </div>

      {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted border-2 border-dashed border-border rounded-xl">
             <ImageIcon size={48} className="mb-4 opacity-20" />
             <p>Your board is empty.</p>
             <button onClick={() => setIsAdding(true)} className="text-primary hover:underline mt-2">Add your first dream</button>
          </div>
      )}
    </div>
  );
};

export default VisionBoard;