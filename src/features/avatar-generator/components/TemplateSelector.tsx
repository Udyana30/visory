import React, { useState, useEffect } from 'react';
import { LayoutGrid, Upload, X, Plus, Image as ImageIcon, User } from 'lucide-react';
import { useAvatarTemplates } from '../hooks/useAvatarTemplates';
import { AvatarTemplate } from '../types/domain/template';
import { useAuth } from '@/hooks/useAuth';
import { TemplateCard } from './TemplateCard';
import { TemplateSkeleton } from './TemplateSkeleton';

interface TemplateSelectorProps {
    onSelect: (template: AvatarTemplate) => void;
    selectedId?: string;
    disabled?: boolean;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, selectedId, disabled }) => {
    const { user } = useAuth();
    const { templates, userTemplates, isLoading, fetchTemplates, createTemplate, deleteTemplate } = useAvatarTemplates(user?.id);

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
    const [isUploading, setIsUploading] = useState(false);

    // New Template Form State
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newTemplateFile, setNewTemplateFile] = useState<File | null>(null);
    const [newTemplatePreview, setNewTemplatePreview] = useState<string | null>(null);

    useEffect(() => {
        // Prefetch templates on mount to improve UX
        fetchTemplates();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewTemplateFile(file);
            setNewTemplatePreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!newTemplateName || !newTemplateFile) return;
        setIsUploading(true);
        try {
            await createTemplate(newTemplateName, newTemplateFile);
            // Reset form
            setNewTemplateName('');
            setNewTemplateFile(null);
            setNewTemplatePreview(null);
            setActiveTab('mine'); // Switch to my templates to see the new one
        } catch (error) {
            console.error(error);
            alert("Failed to create template");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this template?')) {
            try {
                await deleteTemplate(id);
            } catch (error) {
                alert("Failed to delete");
            }
        }
    };

    const displayedTemplates = activeTab === 'all' ? templates : userTemplates;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                disabled={disabled}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center border border-blue-200"
            >
                <LayoutGrid className="w-4 h-4" />
                Choose from Templates
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Avatar Templates</h2>
                                <p className="text-sm text-gray-500">Select a pre-made avatar or upload your own template.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs & Content */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Sidebar / Tabs */}
                            <div className="w-48 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'all'
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                    All Templates
                                </button>
                                <button
                                    onClick={() => setActiveTab('mine')}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'mine'
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                    My Templates
                                </button>

                                <div className="mt-auto pt-4 border-t border-gray-200">
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <h4 className="text-xs font-bold text-blue-800 mb-2">Create Template</h4>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={newTemplateName}
                                                onChange={(e) => setNewTemplateName(e.target.value)}
                                                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <label className="block w-full cursor-pointer group">
                                                <div className="flex items-center justify-center gap-2 px-2 py-1.5 bg-white border border-blue-200 border-dashed rounded-lg text-xs text-blue-600 group-hover:bg-blue-50 transition-colors">
                                                    <Upload className="w-3 h-3" />
                                                    {newTemplateFile ? 'File Selected' : 'Upload Image'}
                                                </div>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                                            </label>
                                            {newTemplatePreview && (
                                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                                    <img src={newTemplatePreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <button
                                                onClick={handleUpload}
                                                disabled={isUploading || !newTemplateName || !newTemplateFile}
                                                className="w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
                                            >
                                                {isUploading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-3 h-3" />}
                                                Save Template
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div className="flex-1 overflow-y-auto p-6 bg-white">
                                {displayedTemplates.length === 0 && !isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No templates found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {displayedTemplates.map((template) => (
                                            <TemplateCard
                                                key={template.avatar_id}
                                                template={template}
                                                isSelected={selectedId === template.avatar_id}
                                                onSelect={(t) => {
                                                    onSelect(t);
                                                    setIsOpen(false);
                                                }}
                                                onDelete={activeTab === 'mine' ? handleDelete : undefined}
                                                isOwner={activeTab === 'mine'}
                                            />
                                        ))}

                                        {/* Loading Skeletons */}
                                        {isLoading && (
                                            <>
                                                <TemplateSkeleton />
                                                <TemplateSkeleton />
                                                <TemplateSkeleton />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
