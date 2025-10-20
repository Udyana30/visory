'use client';

import { Check, AlertCircle } from 'lucide-react';

export default function StyleSelector({
  selectedStyle,
  styles,
  error,
  onChange,
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        Styles
      </label>

      <div className={`
        p-4 rounded-xl border-2 transition-colors
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
      `}>
        <div className="grid grid-cols-3 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => onChange(style.id)}
              className={`
                relative group aspect-square rounded-lg border-2 transition-all
                flex items-center justify-center flex-col gap-1
                ${selectedStyle === style.id
                  ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              style={{
                backgroundColor: style.color,
              }}
              title={style.name}
            >
              <span className="text-xl">{style.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center px-1 hidden group-hover:block">
                {style.name}
              </span>

              {selectedStyle === style.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" strokeWidth={3} />
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