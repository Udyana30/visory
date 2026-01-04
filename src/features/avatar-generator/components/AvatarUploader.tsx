import React, { useRef, useState } from 'react';
import { Upload, LayoutGrid } from 'lucide-react';
import { ActionButton } from './shared/ActionButton';

interface AvatarUploaderProps {
  onFileSelect: (file: File) => void;
  onTemplateClick: () => void;
  disabled?: boolean;
  currentPreview?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  onFileSelect,
  onTemplateClick,
  disabled = false,
  currentPreview
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoveredButton, setHoveredButton] = useState<'upload' | 'template' | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleTemplateClick = () => {
    if (!disabled) {
      onTemplateClick();
    }
  };

  const getBackgroundClass = () => {
    if (currentPreview) return 'border-blue-200 bg-blue-50/30';
    if (hoveredButton === 'upload') return 'border-blue-400 bg-blue-50/30';
    if (hoveredButton === 'template') return 'border-purple-400 bg-purple-50/30';
    return 'border-gray-200 bg-gray-50/50';
  };

  const getTitleColor = () => {
    if (hoveredButton === 'upload') return 'text-blue-700';
    if (hoveredButton === 'template') return 'text-purple-700';
    return 'text-gray-700';
  };

  return (
    <div className="h-full w-full">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative h-full w-full border rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${getBackgroundClass()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />

        {currentPreview ? (
          <img
            src={currentPreview}
            alt="Avatar Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 gap-3">
            <div className="text-center">
              <p className={`text-sm font-semibold transition-colors duration-300 ${getTitleColor()}`}>
                Upload Image
              </p>
              <p className="text-xs text-gray-500 mt-1">Drag & drop or choose option</p>
            </div>

            <div className="flex flex-col gap-1.5 w-full max-w-[160px]">
              <ActionButton
                icon={<Upload className="w-4 h-4" />}
                label="Upload"
                onClick={handleUploadClick}
                onMouseEnter={() => setHoveredButton('upload')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={disabled}
                variant="blue"
              />
              <ActionButton
                icon={<LayoutGrid className="w-4 h-4" />}
                label="Templates"
                onClick={handleTemplateClick}
                onMouseEnter={() => setHoveredButton('template')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={disabled}
                variant="purple"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};