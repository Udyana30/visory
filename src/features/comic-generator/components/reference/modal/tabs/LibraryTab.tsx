import React, { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useUserLibrary } from '../../../../hooks/reference/useUserLibrary';
import { ReferenceSelectorCard } from '../shared/ReferenceSelectorCard';

interface Props {
  userId: number;
  onImport: (referenceIds: string[]) => void;
  onCancel: () => void;
}

export const LibraryTab: React.FC<Props> = ({ userId, onImport, onCancel }) => {
  const { libraryItems, loading, fetchLibrary } = useUserLibrary();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLibrary(userId);
  }, [userId, fetchLibrary]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredItems = libraryItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your library..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            No items found in your library.
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 pb-4">
            {filteredItems.map(item => (
              <ReferenceSelectorCard
                key={item.id}
                data={item}
                isSelected={selectedIds.includes(item.id)}
                onToggle={() => toggleSelection(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between items-center bg-white mt-auto">
        <span className="text-sm text-gray-500">
          {selectedIds.length} assets selected
        </span>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button 
            onClick={() => onImport(selectedIds)}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 disabled:opacity-50 transition-all"
          >
            Add to Project
          </button>
        </div>
      </div>
    </div>
  );
};