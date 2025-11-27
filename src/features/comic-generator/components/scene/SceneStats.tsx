import React from 'react';
import { Reference } from '../../types/domain/reference';
import { SceneVisualization } from '../../types/domain/scene';

interface SceneStatsProps {
  scenes: SceneVisualization[];
  activeReferences: Reference[];
}

export const SceneStats: React.FC<SceneStatsProps> = ({ scenes, activeReferences }) => {
  const generatedCount = scenes.filter(s => s.imageUrl).length;
  const activeCharacters = activeReferences.filter(r => r.type === 'character');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 font-medium">Total Scenes</span>
        <span className="text-gray-900 font-bold">{scenes.length}</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-600 font-medium">Generated</span>
        <span className="text-gray-900 font-bold">{generatedCount}</span>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Active Characters
        </h4>
        
        {activeCharacters.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No characters selected</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeCharacters.map(char => (
              <div key={char.id} className="flex items-center gap-3">
                <img 
                  src={char.imageUrl} 
                  alt={char.name} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{char.name}</p>
                  <p className="text-xs text-gray-500">
                    {char.isCustom ? 'Custom Upload' : 'AI Generated'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};