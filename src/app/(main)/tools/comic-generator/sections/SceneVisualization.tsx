import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TimelineProgress } from '../components/TimelineProgress';
import { SceneCard } from '../components//visualization/SceneCard';
import { Character } from '@/types/comic';
import { SceneVisualization as SceneVisualizationType } from '@/types/scene';
import { DEFAULT_SCENE_DATA } from '@/lib/scene';

interface SceneVisualizationProps {
  selectedCharacters: Character[];
  currentTimelineStep: number;
  scenes: SceneVisualizationType[];
  onScenesChange: (scenes: SceneVisualizationType[]) => void;
  onGenerateScenes: () => void;
  onNext: () => void;
  onStepClick: (stepIndex: number) => void;
}

export const SceneVisualization: React.FC<SceneVisualizationProps> = ({
  selectedCharacters,
  currentTimelineStep,
  scenes,
  onScenesChange,
  onGenerateScenes,
  onNext,
  onStepClick
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const currentProgress = (currentTimelineStep / 5) * 100;

  const handleAddScene = () => {
    const newScene: SceneVisualizationType = {
      id: Date.now().toString(),
      ...DEFAULT_SCENE_DATA
    };
    onScenesChange([...scenes, newScene]);
  };

  const handleSceneChange = (
    index: number,
    field: keyof SceneVisualizationType,
    value: string | string[]
  ) => {
    const updatedScenes = scenes.map((scene, i) =>
      i === index ? { ...scene, [field]: value } : scene
    );
    onScenesChange(updatedScenes);
  };

  const handleDeleteScene = (index: number) => {
    const updatedScenes = scenes.filter((_, i) => i !== index);
    onScenesChange(updatedScenes);
  };

  const handleGenerateScenes = () => {
    setIsGenerating(true);
    onGenerateScenes();
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerateAgain = () => {
    const clearedScenes = scenes.map(scene => ({
      ...scene,
      imageUrl: undefined
    }));
    onScenesChange(clearedScenes);
  };

  const hasGeneratedScenes = scenes.some(scene => scene.imageUrl);
  const canGenerate = scenes.length > 0 && scenes.every(scene => scene.prompt.trim() !== '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-bold text-gray-900">Scene Visualization</h2>
            <button
              onClick={handleAddScene}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Scene
            </button>
          </div>
          <p className="text-gray-600">
            Create and customize individual scenes for your comic. Define the visual style, mood, and composition for each panel.
          </p>
        </div>

        {isGenerating && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">Generating scenes...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          </div>
        )}

        {!isGenerating && scenes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Scenes Yet</h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first scene to begin building your comic story
              </p>
              <button
                onClick={handleAddScene}
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
              >
                Add Your First Scene
              </button>
            </div>
          </div>
        )}

        {!isGenerating && scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            characters={selectedCharacters}
            onChange={(field, value) => handleSceneChange(index, field, value)}
            onDelete={() => handleDeleteScene(index)}
          />
        ))}
      </div>

      <div className="space-y-4 sticky top-8 self-start">
        <TimelineProgress
          currentProgress={currentProgress}
          currentTimelineStep={currentTimelineStep}
          onStepClick={onStepClick}
          isComicOverviewComplete={true}
        />

        {!hasGeneratedScenes ? (
          <button
            onClick={handleGenerateScenes}
            disabled={!canGenerate || isGenerating}
            className={`w-full py-3 rounded-lg font-medium transition ${
              canGenerate && !isGenerating
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Scenes'}
          </button>
        ) : (
          <>
            <button
              onClick={onNext}
              className="w-full py-3 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
            >
              Comic Editor
            </button>
            <button
              onClick={handleGenerateAgain}
              disabled={isGenerating}
              className="w-full py-3 rounded-lg font-medium transition bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Again'}
            </button>
          </>
        )}

        {scenes.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Scenes</span>
              <span className="font-semibold text-gray-900">{scenes.length}</span>
            </div>
            {selectedCharacters.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Selected Characters:</p>
                <div className="flex gap-2">
                  {selectedCharacters.map(char => (
                    <div key={char.id} className="flex items-center gap-1.5">
                      <img
                        src={char.imageUrl}
                        alt={char.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-gray-700">{char.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};