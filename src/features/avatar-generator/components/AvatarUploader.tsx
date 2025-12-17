import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface AvatarUploaderProps {
  previewUrl?: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  previewUrl,
  onFileSelect,
  onClear,
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files?.[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  if (previewUrl) {
    return (
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group">
        <img 
          src={previewUrl} 
          alt="Avatar Preview" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <button
          onClick={onClear}
          disabled={disabled}
          className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-red-600 disabled:opacity-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        disabled={disabled}
      />
      
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
        {isDragging ? (
          <UploadCloud className="w-6 h-6 text-blue-500" />
        ) : (
          <ImageIcon className="w-6 h-6 text-gray-400" />
        )}
      </div>
      
      <p className="text-sm font-semibold text-gray-900 mb-1">
        Upload Portrait
      </p>
      <p className="text-xs text-gray-500 max-w-[200px]">
        Drag & drop or click to upload a clear face image (JPG, PNG)
      </p>
    </div>
  );
};