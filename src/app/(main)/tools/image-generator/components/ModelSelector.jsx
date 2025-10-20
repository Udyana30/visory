'use client';

import { Check, AlertCircle } from 'lucide-react';

export default function ModelSelector({
  selectedModel,
  models,
  error,
  onChange,
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        Model
      </label>
      
      <div className={`
        p-6 rounded-xl border-2 transition-colors
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
      `}>
        <div className="space-y-3">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => onChange(model.id)}
              className={`
                w-full p-4 rounded-lg border-2 transition-all text-left
                flex items-center justify-between group
                ${selectedModel === model.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{model.icon}</span>
                <span className="font-medium text-gray-900">{model.name}</span>
              </div>
              {selectedModel === model.id && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}