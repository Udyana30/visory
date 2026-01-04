import React, { useRef, useState } from 'react';
import { Upload, X, Music } from 'lucide-react';

interface FileUploadZoneProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    acceptedFormats: string[];
    maxSizeMB: number;
    label: string;
    disabled?: boolean;
    error?: string | null;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    file,
    onFileChange,
    acceptedFormats,
    maxSizeMB,
    label,
    disabled = false,
    error
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        // Validate file type
        if (!acceptedFormats.includes(selectedFile.type)) {
            alert(`Format file tidak didukung. Gunakan: ${acceptedFormats.join(', ')}`);
            return;
        }

        // Validate file size
        const fileSizeMB = selectedFile.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            alert(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB`);
            return;
        }

        onFileChange(selectedFile);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleClear = () => {
        onFileChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        const mb = bytes / (1024 * 1024);
        return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(2)} MB`;
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
            </label>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && !file && inputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50/50'}
                    ${error ? 'border-red-300 bg-red-50/30' : ''}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={acceptedFormats.join(',')}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className="hidden"
                />

                {file ? (
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            disabled={disabled}
                            className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Klik untuk upload atau drag & drop
                        </p>
                        <p className="text-xs text-gray-500">
                            Format: WAV, MP3, M4A (Max {maxSizeMB}MB)
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-600 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};
