"use client";

import { useState } from "react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";

export default function ComicPreview({ images, story, onImageReorder }) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onImageReorder(newImages);
    setDraggedIndex(null);
  };

  const moveImage = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onImageReorder(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Drag and drop to reorder scenes
      </div>

      <div className="space-y-4">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`border-2 rounded-lg overflow-hidden transition-all ${
              draggedIndex === index
                ? "border-blue-600 opacity-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <span className="font-semibold text-gray-900">
                  Scene {index + 1}
                </span>
                {story?.scenes?.[index] && (
                  <span className="text-sm text-gray-600">
                    {story.scenes[index].description.substring(0, 60)}...
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => moveImage(index, "up")}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveImage(index, "down")}
                  disabled={index === images.length - 1}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <img
                src={imageUrl}
                alt={`Scene ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}