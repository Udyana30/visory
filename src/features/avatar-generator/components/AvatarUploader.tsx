import React, { useRef, useState, useEffect } from 'react';
import { Upload, LayoutGrid, Maximize2, X } from 'lucide-react';
import { ActionButton } from './shared/ActionButton';
import { useScrollLock } from '@/hooks/useScrollLock';

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
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hoveredButton, setHoveredButton] = useState<'upload' | 'template' | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useScrollLock(showPreviewModal);

  // Smooth hover animation dengan delay
  useEffect(() => {
    if (isHovering) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowOverlay(true);
      }, 300);
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setShowOverlay(false);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovering]);

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
      e.target.value = '';
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

  const handlePreviewClick = () => {
    if (currentPreview && !disabled) {
      setShowPreviewModal(true);
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
    <>
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
            <div
              className="relative h-full w-full group"
              onMouseEnter={() => !disabled && setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                src={currentPreview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay dengan smooth transition */}
              <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ease-in-out ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                <div className={`flex flex-col gap-2 w-full max-w-[160px] px-4 transition-transform duration-300 ease-out ${showOverlay ? 'translate-y-0 scale-100' : 'translate-y-2 scale-95'
                  }`}>
                  <button
                    onClick={handlePreviewClick}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/95 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 rounded-lg font-medium text-sm transition-all hover:scale-105 shadow-lg"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Preview
                  </button>
                  <ActionButton
                    icon={<Upload className="w-4 h-4" />}
                    label="Upload"
                    onClick={handleUploadClick}
                    disabled={disabled}
                    variant="blue"
                  />
                  <ActionButton
                    icon={<LayoutGrid className="w-4 h-4" />}
                    label="Templates"
                    onClick={handleTemplateClick}
                    disabled={disabled}
                    variant="purple"
                  />
                </div>
              </div>
            </div>
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

      {/* Preview Modal */}
      {showPreviewModal && currentPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setShowPreviewModal(false)}
        >
          <button
            onClick={() => setShowPreviewModal(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-300">
            <img
              src={currentPreview}
              alt="Full Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};