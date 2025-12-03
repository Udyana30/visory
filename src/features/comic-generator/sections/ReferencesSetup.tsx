import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { TimelineProgress } from '../components/TimelineProgress';
import { CreateReferenceModal } from '../components/reference/modal/CreateReferenceModal';
import { ReferenceGrid } from '../components/reference/ReferenceGrid';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useReferenceActions } from '../hooks/reference/useReferenceActions';
import { CreateReferenceFormData, Reference } from '../types/domain/reference';
import { ReferenceType } from '../types/api/reference';

interface ReferencesSetupProps {
  projectId: number | null;
  userId?: number;
  references: Reference[];
  selectedReferenceIds: string[];
  currentTimelineStep: number;
  currentProgress: number;
  onRefresh: () => Promise<void>;
  onSelectReference: (id: string) => void;
  onImportLibrary: (ids: string[]) => Promise<void>;
  onUpdateExternalRefs: () => void;
  onNext: () => void;
  onStepClick: (stepIndex: number) => void;
}

export const ReferencesSetup: React.FC<ReferencesSetupProps> = ({
  projectId,
  userId = 1,
  references,
  selectedReferenceIds,
  currentTimelineStep,
  currentProgress,
  onRefresh,
  onSelectReference,
  onImportLibrary,
  onUpdateExternalRefs,
  onNext,
  onStepClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { 
    createAIReference, 
    uploadCustomReference, 
    updateReference,
    deleteReference,
    isActing, 
    error: actionError 
  } = useReferenceActions();

  const refToDelete = useMemo(() => 
    references.find(r => r.id === deleteId), 
  [references, deleteId]);

  const isOwnerDeleting = refToDelete ? Number(refToDelete.projectId) === projectId : false;

  const handleOpenCreate = () => {
    setEditingReference(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const ref = references.find(r => r.id === id);
    if (ref) {
      setEditingReference(ref);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!refToDelete || !projectId) return;

    const status = await deleteReference(refToDelete, projectId);
    
    if (status === 'deleted') {
      await onRefresh();
    } else if (status === 'detached') {
      removeFromExternalState(refToDelete.id);
      onUpdateExternalRefs(); 
    }
    
    setDeleteId(null);
  };

  const removeFromExternalState = (idToRemove: string) => {
    if (!projectId) return;
    const storageKey = `comic_project_${projectId}_external_refs`;
    const currentStored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedStored = currentStored.filter((id: string) => id !== idToRemove);
    localStorage.setItem(storageKey, JSON.stringify(updatedStored));
  };

  const handleCreate = async (data: CreateReferenceFormData) => {
    if (!projectId) return;
    const result = await createAIReference(projectId, data);
    if (result) {
      await onRefresh();
      onSelectReference(result.id);
      setIsModalOpen(false);
    }
  };

  const handleUpdate = async (id: string, data: CreateReferenceFormData) => {
    if (!projectId) return;
    
    const originalRef = references.find(r => r.id === id);
    if (!originalRef) return;

    const result = await updateReference(originalRef, data, projectId);
    
    if (result) {
      if (result.id !== id) {
        removeFromExternalState(id);
        onUpdateExternalRefs();
        onSelectReference(result.id);
      }
      
      await onRefresh();
      setIsModalOpen(false);
      setEditingReference(null);
    }
  };

  const handleUpload = async (file: File, type: ReferenceType) => {
    if (!projectId) return;
    const result = await uploadCustomReference(projectId, file, type);
    if (result) {
      await onRefresh();
      onSelectReference(result.id);
      setIsModalOpen(false);
    }
  };

  const handleImport = async (ids: string[]) => {
    await onImportLibrary(ids);
    ids.forEach(id => onSelectReference(id));
    setIsModalOpen(false);
  };

  const characters = useMemo(() => 
    references.filter(r => r.type === 'character'), 
  [references]);

  const backgrounds = useMemo(() => 
    references.filter(r => r.type === 'background'), 
  [references]);

  return (
    <>
      <div className="w-full pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="bg-white rounded-xl shadow-sm px-10 py-8 space-y-8 h-fit">
            <div className="flex items-start justify-between gap-5 border-b border-gray-100 pb-6">
              <div className="space-y-1 flex-1">
                <h2 className="text-2xl font-bold text-gray-900">References Setup</h2>
                <p className="text-gray-500 text-base">
                  Define visual assets to maintain consistency across your comic scenes.
                </p>
              </div>
              
              <button
                onClick={handleOpenCreate}
                disabled={!projectId}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg transition shadow-sm shadow-blue-200 active:scale-95 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {actionError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 animate-in fade-in">
                {actionError}
              </div>
            )}

            <div className="space-y-8">
              <ReferenceGrid
                title="Characters"
                description="Cast members for your story."
                type="character"
                items={characters}
                selectedIds={selectedReferenceIds}
                onSelect={onSelectReference}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                emptyMessage="No characters found. Create or upload one to start."
              />

              <div className="border-t border-gray-100" />

              <ReferenceGrid
                title="Backgrounds"
                description="Environments and locations."
                type="background"
                items={backgrounds}
                selectedIds={selectedReferenceIds}
                onSelect={onSelectReference}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                emptyMessage="No backgrounds found."
              />
            </div>
          </div>

          <div className="space-y-4 sticky top-6 self-start">
            <TimelineProgress
              currentProgress={currentProgress}
              currentTimelineStep={currentTimelineStep}
              onStepClick={onStepClick}
              isComicOverviewComplete={true}
            />
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-4">Selection Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Characters</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium text-xs">
                    {selectedReferenceIds.filter(id => characters.some(c => c.id === id)).length} selected
                  </span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Backgrounds</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-md font-medium text-xs">
                    {selectedReferenceIds.filter(id => backgrounds.some(b => b.id === id)).length} selected
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={selectedReferenceIds.length === 0}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedReferenceIds.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next Step
            </button>
          </div>
        </div>
      </div>

      <CreateReferenceModal
        isOpen={isModalOpen}
        editingReference={editingReference}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onUpload={handleUpload}
        onImport={handleImport}
        userId={userId}
        loading={isActing}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title={isOwnerDeleting ? "Delete Reference?" : "Remove Reference?"}
        description={isOwnerDeleting 
          ? "Are you sure you want to delete this reference permanently? This action cannot be undone."
          : "This will remove the reference from your current project. The original file will remain in your library."
        }
        confirmLabel={isOwnerDeleting ? "Delete" : "Remove"}
        variant="danger"
        isProcessing={isActing}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
};