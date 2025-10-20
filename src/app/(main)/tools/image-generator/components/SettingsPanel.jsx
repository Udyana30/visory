'use client';

import { AlertCircle } from 'lucide-react';

export default function SettingsPanel({
  formData,
  errors,
  characterOptions,
  orientationOptions,
  aspectRatioOptions,
  gridAmountOptions,
  onCharacterChange,
  onOrientationChange,
  onAspectRatioChange,
  onGridAmountChange,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-blue-600 rounded-full" />
        <h3 className="text-sm font-semibold text-gray-900">Comic</h3>
      </div>

      <div className="border-2 border-gray-300 rounded-xl p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orientation */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Orientation
            </label>
            <div className="space-y-2">
              {orientationOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onOrientationChange(option.value)}
                  className={`
                    w-full px-4 py-3 rounded-lg border-2 transition-all text-left
                    ${formData.orientation === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Character */}
          <div className="space-y-3">
            <label htmlFor="character" className="block text-sm font-semibold text-gray-900">
              Character
            </label>
            <select
              id="character"
              value={formData.character}
              onChange={(e) => onCharacterChange(e.target.value)}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors
                focus:outline-none focus:ring-2 appearance-none bg-white cursor-pointer
                ${errors.character
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }
              `}
            >
              <option value="">Select a character...</option>
              {characterOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.character && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{errors.character}</span>
              </div>
            )}
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {aspectRatioOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onAspectRatioChange(option.value)}
                  className={`
                    px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
                    ${formData.aspectRatio === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Amount */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Grid Amount
            </label>
            <div className="grid grid-cols-2 gap-2">
              {gridAmountOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onGridAmountChange(option.value)}
                  className={`
                    px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
                    ${formData.gridAmount === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}