import React, { useRef, useState } from 'react';
import { UploadCloud, X, ImageIcon } from 'lucide-react';

interface Props {
  onUpload: (file: File) => void;
  onCancel: () => void;
  loading: boolean;
}

export const ReferenceUploadForm: React.FC<Props> = ({ onUpload, onCancel, loading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div 
        onClick={() => inputRef.current?.click()}
        className={`group relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[300px] ${
          preview ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
        }`}
      >
        {preview ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <img src={preview} alt="Preview" className="max-h-[280px] object-contain rounded-lg shadow-sm" />
            <button 
              onClick={clearFile}
              className="absolute -top-4 -right-4 p-2 bg-white text-red-500 shadow-md rounded-full hover:bg-red-50 border border-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Click or drag image here</h3>
              <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG up to 10MB</p>
            </div>
          </div>
        )}
        <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={loading} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
          Cancel
        </button>
        <button 
          onClick={() => file && onUpload(file)}
          disabled={loading || !file}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 disabled:opacity-50 transition-all"
        >
          {loading ? (
            'Uploading...'
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              Upload Reference
            </>
          )}
        </button>
      </div>
    </div>
  );
};