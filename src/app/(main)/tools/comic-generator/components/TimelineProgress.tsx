import React from 'react';
import { TIMELINE_STEPS } from '@/lib/comic';

interface TimelineProgressProps {
  currentProgress: number;
  currentTimelineStep: number;
  onStepClick: (stepIndex: number) => void;
  isComicOverviewComplete: boolean;
}

export const TimelineProgress: React.FC<TimelineProgressProps> = ({
  currentProgress,
  currentTimelineStep,
  onStepClick,
  isComicOverviewComplete
}) => {
  const canAccessStep = (index: number) => {
    if (index === 0) return true;
    return isComicOverviewComplete;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Your progress in</span>
          <span className="text-sm font-semibold text-blue-600">{currentProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline Progress</h3>
      
      <div className="space-y-3">
        {TIMELINE_STEPS.map((step, index) => {
          const isCurrent = index === currentTimelineStep;
          const canAccess = canAccessStep(index);

          return (
            <div
              key={index}
              onClick={() => canAccess ? onStepClick(index) : undefined}
              role="button"
              tabIndex={canAccess ? 0 : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isCurrent
                  ? 'bg-blue-600 text-white cursor-default'
                  : canAccess
                  ? 'border border-gray-200 text-gray-400 cursor-pointer hover:border-gray-500 hover:bg-gray-50'
                  : 'border border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span className={isCurrent || canAccess ? 'font-medium' : ''}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};