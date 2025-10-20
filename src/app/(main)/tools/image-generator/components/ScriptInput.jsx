'use client';

import { Sparkles, AlertCircle } from 'lucide-react';

export default function ScriptInput({
  projectName,
  scriptDescription,
  projectNameError,
  scriptDescriptionError,
  onProjectNameChange,
  onScriptDescriptionChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="project-name" className="block text-sm font-semibold text-gray-900 mb-2">
          Project Name
        </label>
        <input
          id="project-name"
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Enter your project name..."
          className={`
            w-full px-4 py-3 rounded-lg border transition-colors
            placeholder:text-gray-400 focus:outline-none focus:ring-2
            ${projectNameError
              ? 'border-red-300 focus:ring-red-200 bg-red-50'
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }
          `}
          maxLength={100}
        />
        {projectNameError && (
          <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{projectNameError}</span>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-blue-600" />
          <label htmlFor="script-desc" className="block text-sm font-semibold text-gray-900">
            AI Script Writer
          </label>
        </div>
        <textarea
          id="script-desc"
          value={scriptDescription}
          onChange={(e) => onScriptDescriptionChange(e.target.value)}
          placeholder="Enter your script, describe the idea to generate..."
          rows={6}
          className={`
            w-full px-4 py-3 rounded-lg border transition-colors resize-none
            placeholder:text-gray-400 focus:outline-none focus:ring-2
            ${scriptDescriptionError
              ? 'border-red-300 focus:ring-red-200 bg-red-50'
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }
          `}
          maxLength={5000}
        />
        <div className="flex items-center justify-between mt-2">
          {scriptDescriptionError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{scriptDescriptionError}</span>
            </div>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            {scriptDescription.length} / 5000
          </span>
        </div>
      </div>
    </div>
  );
}