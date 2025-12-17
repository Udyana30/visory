import React, { useRef } from 'react';
import { Mic, Upload, X, FileAudio } from 'lucide-react';

interface AudioInputProps {
  fileName?: string;
  audioUrl?: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const AudioInput: React.FC<AudioInputProps> = ({
  fileName,
  audioUrl,
  onFileSelect,
  onClear,
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (fileName || audioUrl) {
    return (
      <div className="flex flex-col h-full bg-blue-50/30 border border-blue-200 rounded-xl p-3 items-center justify-center text-center gap-2 relative group">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
          <FileAudio className="w-5 h-5" />
        </div>
        <div className="min-w-0 w-full px-1">
          <p className="text-xs font-semibold text-gray-900 truncate">{fileName}</p>
          <p className="text-[9px] text-gray-500 font-medium mt-0.5">Ready</p>
        </div>
        <button
          onClick={onClear}
          disabled={disabled}
          className="absolute top-1.5 right-1.5 p-1 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        disabled={disabled}
      />
      
      <button
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
      >
        <Upload className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
        <span className="text-[11px] font-semibold text-gray-700 group-hover:text-blue-700">Upload</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <span className="relative bg-white px-1.5 text-[9px] font-bold text-gray-400 uppercase">OR</span>
      </div>

      <button
        disabled={true} 
        className="flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
      >
        <Mic className="w-4 h-4" />
        <span className="text-[11px] font-medium">Record</span>
      </button>
    </div>
  );
};