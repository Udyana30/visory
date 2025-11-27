import React, { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, X, User, Mountain } from 'lucide-react';
import { ReferenceType } from '../../../types/api/reference';

interface ReferenceUploadFormProps {
  onUpload: (file: File, type: ReferenceType) => void;
  loading: boolean;
  onCancel: () => void;
}

export const ReferenceUploadForm: React.FC<ReferenceUploadFormProps> = ({
  onUpload,
  loading,
  onCancel
}) => {
  const [type, setType] = useState<ReferenceType>('character');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile, type);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setType('character')}
          className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 transition ${
            type === 'character' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
          }`}
        >
          <User className="w-4 h-4" /> Custom Character
        </button>
        <button
          onClick={() => setType('background')}
          className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 transition ${
            type === 'background' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'
          }`}
        >
          <Mountain className="w-4 h-4" /> Custom Background
        </button>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 min-h-[300px] relative"
      >
        {previewUrl ? (
          <div className="relative w-full h-full flex justify-center">
            <img src={previewUrl} alt="Preview" className="max-h-[300px] object-contain rounded-lg shadow-sm" />
            <button 
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Click to upload image</h3>
            <p className="text-gray-500 mt-2 text-sm">PNG, JPG up to 10MB</p>
          </>
        )}
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onCancel} disabled={loading} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        <button 
          onClick={handleSubmit} 
          disabled={loading || !selectedFile} 
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Reference'}
        </button>
      </div>
    </div>
  );
};