'use client';

import React from 'react';
import { Upload, X, Globe, Lock, Plus } from 'lucide-react';

interface CreateTemplateViewProps {
    templateName: string;
    onNameChange: (name: string) => void;
    templateFile: File | null;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    previewUrl: string | null;
    onRemovePreview: () => void;
    isPublic: boolean;
    onTogglePublic: () => void;
    isUploading: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

export const CreateTemplateView: React.FC<CreateTemplateViewProps> = ({
    templateName,
    onNameChange,
    templateFile,
    onFileSelect,
    previewUrl,
    onRemovePreview,
    isPublic,
    onTogglePublic,
    isUploading,
    onSubmit,
    onCancel,
}) => {
    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-2xl mx-auto py-10 px-20 space-y-6">
                {/* Template Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Template Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Professional Avatar, Casual Look..."
                        value={templateName}
                        onChange={(e) => onNameChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400 transition-all"
                    />
                </div>

                {/* Upload Image / Preview */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Image
                    </label>

                    {previewUrl ? (
                        /* Image Preview - Replaces Upload Area */
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <label className="cursor-pointer px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Change Image
                                    <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
                                </label>
                                <button
                                    onClick={onRemovePreview}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Upload Placeholder */
                        <label className="block w-full cursor-pointer group">
                            <div className="relative flex flex-col items-center justify-center gap-3 px-6 py-12 bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all">
                                <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                                    <Upload className="w-7 h-7 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-medium text-gray-700 block">
                                        Click to upload image
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1 block">PNG, JPG up to 10MB</span>
                                </div>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
                        </label>
                    )}
                </div>

                {/* Public Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${isPublic ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {isPublic ? 'Public Template' : 'Private Template'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {isPublic ? 'Visible to all users' : 'Only visible to you'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onTogglePublic}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isPublic ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3.5 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isUploading || !templateName || !templateFile}
                        className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Create Template
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
