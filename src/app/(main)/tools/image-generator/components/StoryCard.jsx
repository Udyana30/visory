"use client";

export default function StoryCard({ story, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {story.title}
          </h4>
          <p className="text-sm text-gray-600">{story.summary}</p>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected
              ? "border-blue-600 bg-blue-600"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {story.scenes?.map((scene, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Scene {scene.scene_num}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{scene.description}</p>
            
            {scene.dialogs && scene.dialogs.length > 0 && (
              <div className="space-y-2">
                {scene.dialogs.map((dialog, dialogIdx) => (
                  <div
                    key={dialogIdx}
                    className="bg-gray-50 rounded p-3 border-l-2 border-blue-400"
                  >
                    {dialog.type === "character" ? (
                      <>
                        <div className="text-xs font-semibold text-gray-700 mb-1">
                          {dialog.character_name}
                        </div>
                        <div className="text-sm text-gray-800">
                          "{dialog.text}"
                        </div>
                      </>
                    ) : (
                      <div className="text-sm italic text-gray-600">
                        {dialog.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}