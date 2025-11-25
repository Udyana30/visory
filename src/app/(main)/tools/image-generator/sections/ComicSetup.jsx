"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import useComic from "@/hooks/comic/useComic";

export default function ComicSetup({ initialData, onComplete, onFormChange }) {
  const { createComicInit, loading } = useComic();
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onFormChange(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createComicInit(formData);
      onComplete(result);
    } catch (error) {
      alert("Failed to generate stories. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Script</span>
          <button
            type="button"
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Script Writer</span>
          </button>
        </label>
        <textarea
          value={formData.prompt}
          onChange={(e) => handleInputChange("prompt", e.target.value)}
          placeholder="Enter your script, describe the idea to generate..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
          rows={8}
          required
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Settings</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            Comic
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Scenes
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.num_scenes}
              onChange={(e) =>
                handleInputChange("num_scenes", parseInt(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Characters
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.num_characters}
              onChange={(e) =>
                handleInputChange("num_characters", parseInt(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="english">English</option>
              <option value="indonesian">Indonesian</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 mt-8">
              <input
                type="checkbox"
                checked={formData.with_dialog}
                onChange={(e) =>
                  handleInputChange("with_dialog", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Include Dialog
              </span>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.prompt.trim()}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Stories...</span>
          </>
        ) : (
          <span>Generate Stories</span>
        )}
      </button>
    </form>
  );
}