import React, { useRef, useState } from 'react';
import { Upload, Music } from 'lucide-react';

interface VoiceChangerFormProps {
    selectedFile: File | null;
    onFileChange: (file: File | null) => void;
}

export const VoiceChangerForm: React.FC<VoiceChangerFormProps> = ({
    selectedFile,
    onFileChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('audio/')) {
                setLocalError('Please upload a valid audio file');
                return;
            }
            onFileChange(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setLocalError(null);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith('audio/')) {
                setLocalError('Please upload a valid audio file');
                return;
            }
            onFileChange(file);
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-900 ml-1">Source Audio</label>
            <div
                className={`p-6 border-2 border-dashed rounded-xl transition-colors ${selectedFile ? 'border-blue-500/50 bg-blue-50/30' : 'border-gray-200 hover:border-blue-400/50 bg-white'
                    }`}
                onDragOver={(e: React.DragEvent) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[140px]">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="audio/*"
                        className="hidden"
                    />

                    <div className={`p-4 rounded-full transition-all duration-300 ${selectedFile ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                        {selectedFile ? <Music className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">
                            {selectedFile ? selectedFile.name : 'Upload Source Audio'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            {selectedFile
                                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                                : 'Drag & drop an audio file here, or click to browse'
                            }
                        </p>
                    </div>

                    {!selectedFile && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Browse Files
                        </button>
                    )}

                    {selectedFile && (
                        <button
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onFileChange(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Remove File
                        </button>
                    )}
                </div>
            </div>
            {localError && (
                <p className="text-sm text-red-600 ml-1">{localError}</p>
            )}
        </div>
    );
};
