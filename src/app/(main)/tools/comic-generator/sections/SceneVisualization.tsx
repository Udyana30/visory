import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TimelineProgress } from '../components/TimelineProgress';
import { SceneCard } from '../components/visualization/SceneCard';
import { Character } from '@/types/comic';
import { SceneVisualization as SceneVisualizationType } from '@/types/scene';
import { DEFAULT_SCENE_DATA } from '@/lib/scene';
import { useComicProject } from '@/hooks/useComic';
import { 
  getAspectRatioValue, 
  getShotTypeValue,
  getShotSizeValue,
  getShotAngleValue,
  getLightingValue,
  getMoodValue,
  getCompositionValue,
  parseCharacterMentions 
} from '@/lib/sceneUtils';

interface SceneVisualizationProps {
  selectedCharacters: Character[];
  currentTimelineStep: number;
  scenes: SceneVisualizationType[];
  projectId: number | null;
  onScenesChange: (scenes: SceneVisualizationType[]) => void;
  onNext: () => void;
  onStepClick: (stepIndex: number) => void;
}

export const SceneVisualization: React.FC<SceneVisualizationProps> = ({
  selectedCharacters,
  currentTimelineStep,
  scenes,
  projectId,
  onScenesChange,
  onNext,
  onStepClick
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSceneIds, setGeneratingSceneIds] = useState<Set<string>>(new Set());
  const { createScene, loading, error } = useComicProject();
  
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

  const generateSingleScene = async (scene: SceneVisualizationType, index: number) => {
    if (!projectId) {
      alert('Project ID is required to generate scene');
      return;
    }

    if (!scene.prompt.trim()) {
      alert('Scene description is required');
      return;
    }

    setGeneratingSceneIds(prev => new Set(prev).add(scene.id));

    try {
      const characterIds = scene.characters
        .map(charId => {
          const char = selectedCharacters.find(c => c.id === charId);
          return char ? parseInt(char.id) : null;
        })
        .filter((id): id is number => id !== null);

      const formattedPrompt = parseCharacterMentions(scene.prompt, scene.characters);

      const sceneData = {
        character_ids: characterIds,
        background_id: null,
        aspect_ratio: getAspectRatioValue(scene.aspectRatio),
        shot_type: getShotTypeValue(scene.shotType),
        shot_size: getShotSizeValue(scene.shotSize),
        shot_angle: getShotAngleValue(scene.shotAngle),
        lighting: getLightingValue(scene.lighting),
        mood: getMoodValue(scene.mood),
        composition: getCompositionValue(scene.composition),
        prompt: formattedPrompt,
        negative_prompt: 'blurry, low quality, distorted',
        project_id: projectId
      };

      if (sceneData.character_ids.length === 0) {
        delete (sceneData as any).character_ids;
      }

      console.log('📤 Sending scene data:', sceneData);

      const response = await createScene(sceneData);

      if (response) {
        const updatedScenes = scenes.map((s, i) =>
          i === index ? { ...s, imageUrl: response.image_url } : s
        );
        onScenesChange(updatedScenes);
      }
    } catch (err) {
      console.error('Failed to generate scene:', err);
    } finally {
      setGeneratingSceneIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(scene.id);
        return newSet;
      });
    }
  };

  const handleGenerateScenes = async () => {
    if (!projectId) {
      alert('Project ID is required to generate scenes');
      return;
    }

    const invalidScenes = scenes.filter(scene => !scene.prompt.trim());
    if (invalidScenes.length > 0) {
      alert('All scenes must have a description');
      return;
    }

    setIsGenerating(true);

    for (const [index, scene] of scenes.entries()) {
      await generateSingleScene(scene, index);
    }

    setIsGenerating(false);
  };

  const handleGenerateAgain = async () => {
    const clearedScenes = scenes.map(scene => ({
      ...scene,
      imageUrl: undefined
    }));
    onScenesChange(clearedScenes);
    await handleGenerateScenes();
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Error:</p>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
          </div>
        )}

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

        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            characters={selectedCharacters}
            isGenerating={generatingSceneIds.has(scene.id)}
            onChange={(field, value) => handleSceneChange(index, field, value)}
            onDelete={() => handleDeleteScene(index)}
            onGenerate={() => generateSingleScene(scene, index)}
            projectId={projectId}
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
            disabled={!canGenerate || isGenerating || !projectId}
            className={`w-full py-3 rounded-lg font-medium transition ${
              canGenerate && !isGenerating && projectId
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate All Scenes'}
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
              disabled={isGenerating || !projectId}
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
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Generated</span>
              <span className="font-semibold text-gray-900">
                {scenes.filter(s => s.imageUrl).length}
              </span>
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