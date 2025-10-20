'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ScriptInput from '../components/ScriptInput';
import ModelSelector from '../components/ModelSelector';
import StyleSelector from '../components/StyleSelector';
import SettingsPanel from '../components/SettingsPanel';

export default function ProjectSetup({ formData, errors, onUpdate }) {
  const models = [
    { id: 'model-1', name: 'Model 1', icon: '🤖' },
    { id: 'model-2', name: 'Model 2', icon: '🎬' },
    { id: 'model-3', name: 'Model 3', icon: '✨' },
  ];

  const styles = [
    { id: 'style-1', name: 'Realistic', color: '#8b7355', icon: '🎥' },
    { id: 'style-2', name: 'Cartoon', color: '#d4d4d8', icon: '🎨' },
    { id: 'style-3', name: 'Anime', color: '#e5e5e5', icon: '📺' },
    { id: 'style-4', name: '3D', color: '#c0c0c0', icon: '🎮' },
    { id: 'style-5', name: 'Watercolor', color: '#d8d8d8', icon: '🎭' },
    { id: 'style-6', name: 'Oil Painting', color: '#e8e8e8', icon: '🖼️' },
  ];

  const characterOptions = [
    { id: 'char-1', name: 'Character 1' },
    { id: 'char-2', name: 'Character 2' },
    { id: 'char-3', name: 'Character 3' },
  ];

  const orientationOptions = [
    { id: 'portrait', label: 'Portrait', value: 'portrait' },
    { id: 'landscape', label: 'Landscape', value: 'landscape' },
    { id: 'square', label: 'Square', value: 'square' },
  ];

  const aspectRatioOptions = [
    { id: '16:9', label: '16:9', value: '16:9' },
    { id: '9:16', label: '9:16', value: '9:16' },
    { id: '1:1', label: '1:1', value: '1:1' },
    { id: '4:3', label: '4:3', value: '4:3' },
  ];

  const gridAmountOptions = [
    { id: '2', label: '2', value: '2' },
    { id: '4', label: '4', value: '4' },
    { id: '6', label: '6', value: '6' },
    { id: '9', label: '9', value: '9' },
  ];

  return (
    <div className="space-y-8">
      <ScriptInput
        projectName={formData.projectName}
        scriptDescription={formData.scriptDescription}
        projectNameError={errors.projectName}
        scriptDescriptionError={errors.scriptDescription}
        onProjectNameChange={(value) => onUpdate('projectName', value)}
        onScriptDescriptionChange={(value) => onUpdate('scriptDescription', value)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ModelSelector
            selectedModel={formData.model}
            models={models}
            error={errors.model}
            onChange={(value) => onUpdate('model', value)}
          />
        </div>

        <div>
          <StyleSelector
            selectedStyle={formData.style}
            styles={styles}
            error={errors.style}
            onChange={(value) => onUpdate('style', value)}
          />
        </div>
      </div>

      <SettingsPanel
        formData={formData}
        errors={errors}
        characterOptions={characterOptions}
        orientationOptions={orientationOptions}
        aspectRatioOptions={aspectRatioOptions}
        gridAmountOptions={gridAmountOptions}
        onCharacterChange={(value) => onUpdate('character', value)}
        onOrientationChange={(value) => onUpdate('orientation', value)}
        onAspectRatioChange={(value) => onUpdate('aspectRatio', value)}
        onGridAmountChange={(value) => onUpdate('gridAmount', value)}
      />
    </div>
  );
}