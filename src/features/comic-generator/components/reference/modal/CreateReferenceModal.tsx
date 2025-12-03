import React, { useState, useEffect } from 'react';
import { X, Sparkles, UploadCloud, Library, Edit } from 'lucide-react';
import { ReferenceType } from '../../../types/api/reference';
import { CreateReferenceFormData, Reference } from '../../../types/domain/reference';
import { GenerateTab } from './tabs/GenerateTab';
import { UploadTab } from './tabs/UploadTab';
import { LibraryTab } from './tabs/LibraryTab';

interface CreateReferenceModalProps {
  isOpen: boolean;
  editingReference?: Reference | null;
  onClose: () => void;
  onCreate: (data: CreateReferenceFormData) => Promise<void>;
  onUpdate?: (id: string, data: CreateReferenceFormData) => Promise<void>;
  onUpload: (file: File, type: ReferenceType) => Promise<void>;
  onImport?: (ids: string[]) => Promise<void>;
  userId?: number;
  loading?: boolean;
}

type TabType = 'generate' | 'upload' | 'library';

export const CreateReferenceModal: React.FC<CreateReferenceModalProps> = ({
  isOpen,
  editingReference,
  onClose,
  onCreate,
  onUpdate,
  onUpload,
  onImport,
  userId = 0,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('generate');

  useEffect(() => {
    if (isOpen) {
      if (editingReference) {
        setActiveTab(editingReference.source === 'upload' ? 'upload' : 'generate');
      } else {
        setActiveTab('generate');
      }
    }
  }, [isOpen, editingReference]);

  if (!isOpen) return null;

  const handleClose = () => !loading && onClose();

  const handleFormSubmit = async (data: CreateReferenceFormData) => {
    if (editingReference && onUpdate) {
      await onUpdate(editingReference.id, data);
    } else {
      await onCreate(data);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <GenerateTab 
            initialData={editingReference || undefined}
            onCreate={handleFormSubmit} 
            onCancel={handleClose} 
            loading={loading} 
          />
        );
      case 'upload':
        return (
          <UploadTab 
            onUpload={onUpload} 
            onCancel={handleClose} 
            loading={loading} 
          />
        );
      case 'library':
        return (
          <LibraryTab 
            userId={userId} 
            onImport={onImport || (async ()=>{})} 
            onCancel={handleClose} 
          />
        );
      default: return null;
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      disabled={!!editingReference}
      className={`relative px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${
        activeTab === id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {activeTab === id && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 border-b border-gray-100 flex justify-between items-center shrink-0 h-16">
          <div className="flex h-full">
            {editingReference ? (
              <div className="flex items-center gap-2 text-gray-900 font-semibold px-2">
                <Edit className="w-4 h-4 text-blue-600" />
                <span>Edit {editingReference.name}</span>
              </div>
            ) : (
              <>
                <TabButton id="generate" label="AI Generator" icon={Sparkles} />
                <TabButton id="upload" label="Upload" icon={UploadCloud} />
                <TabButton id="library" label="My Library" icon={Library} />
              </>
            )}
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};