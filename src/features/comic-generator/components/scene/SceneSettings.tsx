import React from 'react';
import { SceneVisualization } from '../../types/domain/scene';
import { 
  ASPECT_RATIOS, SHOT_TYPES, SHOT_SIZES, SHOT_ANGLES, 
  LIGHTING_OPTIONS, MOOD_OPTIONS, COMPOSITION_OPTIONS 
} from '../../constants/scene';

interface SceneSettingsProps {
  scene: SceneVisualization;
  onChange: (field: keyof SceneVisualization, value: string) => void;
  disabled?: boolean;
}

export const SceneSettings: React.FC<SceneSettingsProps> = ({ scene, onChange, disabled }) => {
  const renderSelect = (label: string, field: keyof SceneVisualization, options: string[]) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={scene[field] as string}
        onChange={(e) => onChange(field, e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {renderSelect('Aspect Ratio', 'aspectRatio', ASPECT_RATIOS)}
      {renderSelect('Shot Type', 'shotType', SHOT_TYPES)}
      {renderSelect('Shot Size', 'shotSize', SHOT_SIZES)}
      {renderSelect('Shot Angle', 'shotAngle', SHOT_ANGLES)}
      {renderSelect('Lighting', 'lighting', LIGHTING_OPTIONS)}
      {renderSelect('Mood', 'mood', MOOD_OPTIONS)}
      
      <div className="col-span-2">
        {renderSelect('Composition', 'composition', COMPOSITION_OPTIONS)}
      </div>
    </div>
  );
};