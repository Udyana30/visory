"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import useComic from "@/hooks/comic/useComic";
import ComicPreview from "../components/ComicPreview";
import DialogEditor from "../components/DialogEditor";

export default function ComicFinalization({
  comicData,
  selectedStory,
  generatedImages: initialImages,
  updatedStory: initialUpdatedStory,
  onComplete,
  onBack,
  onStateChange,
}) {
  const { finalize, loading } = useComic();
  const [imageOrder, setImageOrder] = useState(initialImages);
  const [updatedStory, setUpdatedStory] = useState(initialUpdatedStory || selectedStory);
  const [outputFormat, setOutputFormat] = useState("png");
  const [finalComicUrl, setFinalComicUrl] = useState(null);

  useEffect(() => {
    if (comicData?.generated_images && initialImages.length === 0) {
      setImageOrder(comicData.generated_images);
    }
  }, [comicData, initialImages.length]);

  const handleImageReorder = (newOrder) => {
    setImageOrder(newOrder);
    onStateChange({ generatedImages: newOrder });
  };

  const handleDialogUpdate = (sceneIndex, dialogIndex, field, value) => {
    const newStory = { ...updatedStory };
    if (!newStory.scenes[sceneIndex].dialogs[dialogIndex]) return;
    newStory.scenes[sceneIndex].dialogs[dialogIndex][field] = value;
    setUpdatedStory(newStory);
    onStateChange({ updatedStory: newStory });
  };

  const handleBubbleCoordUpdate = (sceneIndex, dialogIndex, coords) => {
    const newStory = { ...updatedStory };
    if (!newStory.scenes[sceneIndex].dialogs[dialogIndex]) return;
    newStory.scenes[sceneIndex].dialogs[dialogIndex].bubble_coord = coords;
    setUpdatedStory(newStory);
    onStateChange({ updatedStory: newStory });
  };

  const handleFinalize = async () => {
    const payload = {
      image_order: imageOrder,
      updated_story: updatedStory,
      output_format: outputFormat,
    };

    try {
      const result = await finalize(comicData.comic_id, payload);
      setFinalComicUrl("/contoh_comic.pdf");
    } catch (error) {
      alert("Failed to finalize comic. Please try again.");
    }
  };

  const handleDownload = () => {
    if (finalComicUrl) {
      window.open(finalComicUrl, "_blank");
    }
  };

  const handleCreateNew = () => {
    setFinalComicUrl(null);
    onComplete();
  };

  if (finalComicUrl) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Your Comic is Ready!
          </h3>
          <p className="text-gray-600">
            Your comic has been successfully generated.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="w-full overflow-auto" style={{ maxHeight: '70vh' }}>
            <iframe
              src={finalComicUrl}
              className="w-full border-0 rounded-lg"
              style={{ height: '70vh', minHeight: '500px' }}
              title="Comic Preview"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Comic</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Create New Comic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Story Selection</span>
      </button>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comic Preview
        </h3>
        <ComicPreview
          images={imageOrder}
          story={updatedStory}
          onImageReorder={handleImageReorder}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Dialogs & Speech Bubbles
        </h3>
        <DialogEditor
          story={updatedStory}
          onDialogUpdate={handleDialogUpdate}
          onBubbleCoordUpdate={handleBubbleCoordUpdate}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Format
        </label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
        >
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <button
        onClick={handleFinalize}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Finalizing Comic...</span>
          </>
        ) : (
          <span>Finalize Comic</span>
        )}
      </button>
    </div>
  );
}