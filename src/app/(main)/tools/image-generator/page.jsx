'use client';

import { useState } from 'react';
import ImagePromptForm from './sections/PromptForm';
import ImageResultDisplay from './sections/ResultDisplay';

export default function ImageGeneratorPage() {
  const [formData, setFormData] = useState({
    prompt: '',
    theme: 'Photorealistic',
    aspectRatio: '1:1',
    referenceImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const response = await imageGeneratorService.generateImage(formData);
      setGeneratedImages(response.images);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <ImagePromptForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleGenerate}
          isLoading={isLoading}
        />
      </div>
      <div className="h-full">
        <ImageResultDisplay
          isLoading={isLoading}
          error={error}
          images={generatedImages}
        />
      </div>
    </div>
  );
}
