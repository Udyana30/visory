"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import useComic from "@/hooks/useComic";
import StoryCard from "../components/StoryCard";
import StoryConfigForm from "../components/StoryConfigForm";

export default function ComicStorySelection({
  comicData,
  selectedStoryIndex: initialSelectedIndex,
  imageReferences: initialImageReferences,
  config: initialConfig,
  onStorySelected,
  onBack,
  onStateChange,
}) {
  const { selectStory, uploadRefs, loading } = useComic();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(initialSelectedIndex);
  const [imageReferences, setImageReferences] = useState(initialImageReferences);
  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    if (initialSelectedIndex !== null && initialSelectedIndex !== selectedStoryIndex) {
      setSelectedStoryIndex(initialSelectedIndex);
    }
  }, [initialSelectedIndex]);

  useEffect(() => {
    if (initialImageReferences?.length > 0 && imageReferences.length === 0) {
      setImageReferences(initialImageReferences);
    }
  }, [initialImageReferences]);

  const handleStorySelect = (index) => {
    setSelectedStoryIndex(index);
    onStateChange({ selectedStoryIndex: index });
  };

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    onStateChange({ config: newConfig });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const result = await uploadRefs(formData);
      const newImageReferences = result.files || [];
      setImageReferences(newImageReferences);
      onStateChange({ imageReferences: newImageReferences });
    } catch (error) {
      alert("Failed to upload reference images. Please try again.");
    }
  };

  const handleSelectStory = async () => {
    if (selectedStoryIndex === null) {
      alert("Please select a story first.");
      return;
    }

    if (!comicData?.story_suggestions?.[selectedStoryIndex]) {
      alert("Selected story not found.");
      return;
    }

    const selectedStory = comicData.story_suggestions[selectedStoryIndex];
    const payload = {
      chosen_story: selectedStory,
      image_references: imageReferences.map((ref, idx) => ({
        character_num: idx + 1,
        character_name: selectedStory.scenes[0]?.dialogs?.[idx]?.character_name || `Character ${idx + 1}`,
        image_url: ref.public_url,
      })),
      ...config,
    };

    try {
      const result = await selectStory(comicData.comic_id, payload);
      onStorySelected(selectedStory, selectedStoryIndex, result);
    } catch (error) {
      alert("Failed to select story. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Setup</span>
      </button>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Your Story
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {comicData?.story_suggestions?.map((story, index) => (
            <StoryCard
              key={index}
              story={story}
              isSelected={selectedStoryIndex === index}
              onSelect={() => handleStorySelect(index)}
            />
          ))}
        </div>
      </div>

      {selectedStoryIndex !== null && (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Character References (Optional)
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload character reference images
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG up to 10MB
                </span>
              </label>
            </div>

            {imageReferences.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {imageReferences.map((ref, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <img
                      src={ref.public_url}
                      alt={ref.filename}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      Character {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <StoryConfigForm config={config} onChange={handleConfigChange} />

          <button
            onClick={handleSelectStory}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Comic Images...</span>
              </>
            ) : (
              <span>Generate Comic Images</span>
            )}
          </button>
        </>
      )}
    </div>
  );
}