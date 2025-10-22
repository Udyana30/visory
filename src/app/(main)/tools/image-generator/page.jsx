"use client";

import { useCallback } from "react";
import { Bell } from 'lucide-react';
import ComicSetup from "./sections/ComicSetup";
import ProfileDropdown from "@/components/ui/ProfileDropdown";
import ComicStorySelection from "./sections/ComicStorySelection";
import ComicFinalization from "./sections/ComicFinalization";
import useComicState from "./hooks/useComicState";

export default function ComicGeneratorPage() {
  const { state, updateState, resetState } = useComicState();

  const handleSetupComplete = useCallback((data) => {
    updateState({
      comicData: data,
      currentStep: 2,
    });
  }, [updateState]);

  const handleStorySelected = useCallback((story, storyIndex, generatedData) => {
    const updatedComicData = {
      ...state.comicData,
      generated_images: generatedData.generated_images || [],
      image_references: generatedData.image_references || [],
      status: generatedData.status,
    };
    
    updateState({
      selectedStory: story,
      selectedStoryIndex: storyIndex,
      comicData: updatedComicData,
      generatedImages: generatedData.generated_images || [],
      updatedStory: story,
      currentStep: 3,
    });
  }, [updateState, state.comicData]);

  const handleBackToSetup = useCallback(() => {
    updateState({ currentStep: 1 });
  }, [updateState]);

  const handleBackToSelection = useCallback(() => {
    updateState({ 
      currentStep: 2,
    });
  }, [updateState]);

  const handleFinalizationComplete = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleFormChange = useCallback((formData) => {
    updateState({ formData });
  }, [updateState]);

  const handleStateChange = useCallback((updates) => {
    updateState(updates);
  }, [updateState]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Desktop Layout */}
          <div className="hidden md:block mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 flex-1">
                <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap">
                  Image Generator
                </h1>
                <div className="h-8 w-px bg-gray-400"></div>
                <p className="text-sm text-gray-700">
                  Turn your ideas into visuals. From lifelike scenes to <br />
                  creative comic art, make anything you imagine.
                </p>
              </div>
              <div className="flex items-center gap-3 ml-6">
                <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <ProfileDropdown />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden mb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Image Generator
              </h1>
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <ProfileDropdown />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Turn your ideas into visuals. From lifelike scenes to creative comic art, make anything you imagine.
            </p>
          </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {state.currentStep === 1 && "Project Setup"}
                {state.currentStep === 2 && "Story Selection"}
                {state.currentStep === 3 && "Finalization"}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`flex-1 h-2 rounded-full ${
                  state.currentStep >= 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`flex-1 h-2 rounded-full ${
                  state.currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`flex-1 h-2 rounded-full ${
                  state.currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            </div>
          </div>

          {state.currentStep === 1 && (
            <ComicSetup
              initialData={state.formData}
              onComplete={handleSetupComplete}
              onFormChange={handleFormChange}
            />
          )}

          {state.currentStep === 2 && state.comicData && (
            <ComicStorySelection
              key="story-selection"
              comicData={state.comicData}
              selectedStoryIndex={state.selectedStoryIndex}
              imageReferences={state.imageReferences}
              config={state.config}
              onStorySelected={handleStorySelected}
              onBack={handleBackToSetup}
              onStateChange={handleStateChange}
            />
          )}

          {state.currentStep === 3 && state.comicData && state.selectedStory && (
            <ComicFinalization
              key="finalization"
              comicData={state.comicData}
              selectedStory={state.selectedStory}
              generatedImages={state.generatedImages}
              updatedStory={state.updatedStory}
              onComplete={handleFinalizationComplete}
              onBack={handleBackToSelection}
              onStateChange={handleStateChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}