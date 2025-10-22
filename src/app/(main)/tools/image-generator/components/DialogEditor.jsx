"use client";

import { useState } from "react";
import { MessageSquare, Type } from "lucide-react";

export default function DialogEditor({ story, onDialogUpdate, onBubbleCoordUpdate }) {
  const [expandedScenes, setExpandedScenes] = useState([0]);

  const toggleScene = (sceneIndex) => {
    setExpandedScenes((prev) =>
      prev.includes(sceneIndex)
        ? prev.filter((i) => i !== sceneIndex)
        : [...prev, sceneIndex]
    );
  };

  return (
    <div className="space-y-4">
      {story?.scenes?.map((scene, sceneIndex) => (
        <div
          key={sceneIndex}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleScene(sceneIndex)}
            className="w-full bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">
                Scene {scene.scene_num}
              </span>
              <span className="text-sm text-gray-600">
                {scene.dialogs?.length || 0} dialogs
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                expandedScenes.includes(sceneIndex) ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {expandedScenes.includes(sceneIndex) && (
            <div className="p-4 space-y-4 bg-white">
              {scene.dialogs?.map((dialog, dialogIndex) => (
                <div
                  key={dialogIndex}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Type className="w-4 h-4 text-gray-600" />
                      {dialog.type === "character" ? (
                        <span className="text-sm font-semibold text-gray-900">
                          {dialog.character_name}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-600 italic">
                          Narration
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {dialog.type}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dialog Text
                    </label>
                    <textarea
                      value={dialog.text}
                      onChange={(e) =>
                        onDialogUpdate(sceneIndex, dialogIndex, "text", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                      rows={2}
                    />
                  </div>

                  {dialog.type === "character" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bubble X Position
                        </label>
                        <input
                          type="number"
                          value={dialog.bubble_coord?.x || 0}
                          onChange={(e) =>
                            onBubbleCoordUpdate(sceneIndex, dialogIndex, {
                              ...dialog.bubble_coord,
                              x: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bubble Y Position
                        </label>
                        <input
                          type="number"
                          value={dialog.bubble_coord?.y || 0}
                          onChange={(e) =>
                            onBubbleCoordUpdate(sceneIndex, dialogIndex, {
                              ...dialog.bubble_coord,
                              y: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bubble Width
                        </label>
                        <input
                          type="number"
                          value={dialog.bubble_coord?.width || 200}
                          onChange={(e) =>
                            onBubbleCoordUpdate(sceneIndex, dialogIndex, {
                              ...dialog.bubble_coord,
                              width: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bubble Height
                        </label>
                        <input
                          type="number"
                          value={dialog.bubble_coord?.height || 80}
                          onChange={(e) =>
                            onBubbleCoordUpdate(sceneIndex, dialogIndex, {
                              ...dialog.bubble_coord,
                              height: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}