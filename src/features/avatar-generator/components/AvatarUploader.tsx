import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface AvatarUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  currentPreview?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ 
  onFileSelect, 
  disabled = false,
  currentPreview
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="h-full w-full">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative group cursor-pointer h-full w-full
          border-dashed rounded-xl overflow-hidden
          transition-all duration-200 ease-in-out flex flex-col
          ${currentPreview ? 'border-2 border-blue-200 bg-blue-50/30' : 'border border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
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
          <>
            <img 
              src={currentPreview} 
              alt="Avatar Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full">
                <Upload className="w-3 h-3" /> Change
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full p-4 gap-2">
            <div className="p-2.5 bg-white rounded-full shadow-sm ring-1 ring-gray-100 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-600 group-hover:text-blue-700">Upload Image</p>
              <p className="text-[9px] text-gray-400 mt-0.5">Drag & drop or click</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};