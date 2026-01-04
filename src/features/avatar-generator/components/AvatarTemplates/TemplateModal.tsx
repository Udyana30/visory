'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAvatarTemplates } from '../../hooks/template/useAvatarTemplates';
import { useCreateTemplateForm } from '../../hooks/template/useCreateTemplateForm';
import { useTemplateLibrary } from '../../hooks/template/useTemplateLibrary';
import { AvatarTemplate } from '../../types/domain/template';
import { useAuth } from '@/hooks/useAuth';
import { useScrollLock } from '@/hooks/useScrollLock';
import { TemplateLibraryView } from './TemplateLibraryView';
import { CreateTemplateView } from './CreateTemplateView';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: AvatarTemplate) => void;
    selectedId?: string;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedId
}) => {
    useScrollLock(isOpen);
    const { user } = useAuth();

    // Data fetching hook
    const {
        templates,
        userTemplates,
        isLoading,
        fetchTemplates,
        createTemplate,
        deleteTemplate
    } = useAvatarTemplates(user?.id);

    // View state
    const [view, setView] = useState<'library' | 'create'>('library');
    const [isUploading, setIsUploading] = useState(false);

    // Form state hook
    const formHook = useCreateTemplateForm();

    // Library state hook
    const libraryHook = useTemplateLibrary(templates, userTemplates);

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
            setView('library');
        }
    }, [isOpen, fetchTemplates]);

    // Handlers
    const handleSubmit = async () => {
        if (!formHook.isValid) return;

        setIsUploading(true);
        try {
            await createTemplate(
                formHook.formData.name,
                formHook.formData.file!,
                formHook.formData.isPublic
            );
            formHook.reset();
            setView('library');
            libraryHook.setActiveTab('mine');
        } catch (error) {
            console.error(error);
            alert("Failed to create template");
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        formHook.reset();
        setView('library');
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

    const handleTemplateSelect = (template: AvatarTemplate) => {
        onSelect(template);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[750px] flex flex-col overflow-hidden border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Static, No Changes */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Avatar Templates</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {view === 'library' ? 'Choose a template to get started' : 'Create your custom template'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area - View Switching */}
                <div className="flex-1 min-h-0 flex flex-col bg-gray-50">
                    {view === 'library' ? (
                        <TemplateLibraryView
                            activeTab={libraryHook.activeTab}
                            onTabChange={libraryHook.setActiveTab}
                            searchQuery={libraryHook.searchQuery}
                            onSearchChange={libraryHook.setSearchQuery}
                            filteredTemplates={libraryHook.filteredTemplates}
                            isLoading={isLoading}
                            selectedId={selectedId}
                            onSelect={handleTemplateSelect}
                            onDelete={handleDelete}
                            onCreateNew={() => setView('create')}
                        />
                    ) : (
                        <CreateTemplateView
                            templateName={formHook.formData.name}
                            onNameChange={formHook.setName}
                            templateFile={formHook.formData.file}
                            onFileSelect={formHook.handleFileSelect}
                            previewUrl={formHook.formData.preview}
                            onRemovePreview={formHook.removePreview}
                            isPublic={formHook.formData.isPublic}
                            onTogglePublic={formHook.togglePublic}
                            isUploading={isUploading}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
