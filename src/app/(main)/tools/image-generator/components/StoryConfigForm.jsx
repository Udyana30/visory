"use client";

export default function StoryConfigForm({ config, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Comic Configuration
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orientation
          </label>
          <select
            value={config.orientation}
            onChange={(e) => handleChange("orientation", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grid Columns
          </label>
          <input
            type="number"
            min="1"
            max="4"
            value={config.grid_cols}
            onChange={(e) => handleChange("grid_cols", parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aspect Ratio
          </label>
          <select
            value={config.ratio}
            onChange={(e) => handleChange("ratio", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="1:1">1:1 (Square)</option>
            <option value="16:9">16:9 (Widescreen)</option>
            <option value="4:3">4:3 (Standard)</option>
            <option value="3:4">3:4 (Portrait)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <select
            value={config.style}
            onChange={(e) => handleChange("style", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="manga">Manga</option>
            <option value="comic">Comic</option>
            <option value="realistic">Realistic</option>
            <option value="cartoon">Cartoon</option>
            <option value="anime">Anime</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model Type
          </label>
          <select
            value={config.model_type}
            onChange={(e) => handleChange("model_type", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="google_imagen">Google Imagen</option>
            <option value="stable_diffusion">Stable Diffusion</option>
            <option value="dalle">DALL-E</option>
          </select>
        </div>
      </div>
    </div>
  );
}