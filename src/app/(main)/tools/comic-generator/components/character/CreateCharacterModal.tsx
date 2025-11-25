import React, { useState, useRef, ChangeEvent } from 'react';
import { X, UploadCloud, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GENDERS, AGE_CATEGORIES } from '@/app/(main)/tools/comic-generator/lib/comic';

interface CreateCharacterModalProps {
  isOpen: boolean;
  projectId: number | null;
  onClose: () => void;
  onCreate: (characterData: {
    name: string;
    prompt: string;
    clothingPrompt: string;
    negativePrompt: string;
  }) => Promise<void>;
  onUpload: (file: File) => Promise<void>;
  loading?: boolean;
}

const STYLES = ['Realistic', 'Anime', 'Cartoon', 'Old Comic'];
type TabType = 'generate' | 'upload';

export const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({
  isOpen,
  projectId,
  onClose,
  onCreate,
  onUpload,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState(GENDERS[0]);
  const [age, setAge] = useState(AGE_CATEGORIES[2]);
  const [style, setStyle] = useState('Realistic');
  const [appearancePrompt, setAppearancePrompt] = useState('');
  const [clothingPrompt, setClothingPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setName('');
    setGender(GENDERS[0]);
    setAge(AGE_CATEGORIES[2]);
    setStyle('Realistic');
    setAppearancePrompt('');
    setClothingPrompt('');
    setNegativePrompt('');
    
    if (previewFileUrl) URL.revokeObjectURL(previewFileUrl);
    setSelectedFile(null);
    setPreviewFileUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewFileUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewFileUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!projectId) return;

    if (activeTab === 'generate') {
        if (!name) {
             alert('Please fill character name.');
             return;
        }
        const prompt = `A ${age.toLowerCase()} ${gender.toLowerCase()} ${appearancePrompt}`.trim();
        await onCreate({
            name,
            prompt,
            clothingPrompt,
            negativePrompt: negativePrompt || 'blurry, low quality, cropped, extra limbs'
        });
    } else {
        if (!selectedFile) {
            alert('Please select an image file.');
            return;
        }
        await onUpload(selectedFile);
    }
    
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Create Character</h2>
          <button 
            onClick={handleClose} 
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            disabled={loading}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="px-6 pt-4 flex gap-4 border-b border-gray-200">
            <button
                onClick={() => setActiveTab('generate')}
                className={`pb-3 px-2 flex items-center gap-2 font-medium transition-all relative ${
                    activeTab === 'generate' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Sparkles className="w-4 h-4" />
                AI Generation
                {activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"/>}
            </button>
            <button
                onClick={() => setActiveTab('upload')}
                className={`pb-3 px-2 flex items-center gap-2 font-medium transition-all relative ${
                    activeTab === 'upload' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <ImageIcon className="w-4 h-4" />
                Custom Upload
                {activeTab === 'upload' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"/>}
            </button>
        </div>

        <div className="p-8">
            {activeTab === 'generate' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                        <label className="block text-base font-semibold text-gray-800 mb-2">
                            Character Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                            placeholder="Enter character name"
                            disabled={loading}
                        />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-semibold text-gray-800 mb-2">Gender</label>
                            <select 
                            value={gender} 
                            onChange={e => setGender(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition appearance-none bg-white text-gray-800"
                            disabled={loading}
                            >
                            {GENDERS.map(g => (<option key={g} value={g}>{g}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-gray-800 mb-2">Age</label>
                            <select 
                            value={age} 
                            onChange={e => setAge(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition appearance-none bg-white text-gray-800"
                            disabled={loading}
                            >
                            {AGE_CATEGORIES.map(a => (<option key={a} value={a}>{a}</option>))}
                            </select>
                        </div>
                        </div>

                        <div>
                        <label className="block text-base font-semibold text-gray-800 mb-2">Style</label>
                        <div className="grid grid-cols-4 gap-2">
                            {STYLES.map(s => (
                            <button 
                                key={s} 
                                onClick={() => setStyle(s)} 
                                className={`p-2 rounded-lg border-2 transition ${
                                style === s ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                }`}
                                disabled={loading}
                            >
                                <div className="w-full h-16 bg-gray-200 rounded-md mb-2"></div>
                                <span className="text-sm font-medium text-gray-700">{s}</span>
                            </button>
                            ))}
                        </div>
                        </div>

                        <div>
                        <label className="block text-base font-semibold text-gray-800 mb-2">
                            Appearance Prompt <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            value={appearancePrompt} 
                            onChange={e => setAppearancePrompt(e.target.value)} 
                            rows={3} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                            placeholder="e.g., brave knight standing under moonlight with sword drawn"
                            disabled={loading}
                        />
                        </div>

                        <div>
                        <label className="block text-base font-semibold text-gray-800 mb-2">
                            Clothing Prompt <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            value={clothingPrompt} 
                            onChange={e => setClothingPrompt(e.target.value)} 
                            rows={3} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                            placeholder="e.g., dark armor with intricate engravings, dark cape flowing behind"
                            disabled={loading}
                        />
                        </div>

                        <div>
                        <label className="block text-base font-semibold text-gray-800 mb-2">
                            Negative Prompt <span className="text-gray-500 font-normal">(Optional)</span>
                        </label>
                        <textarea 
                            value={negativePrompt} 
                            onChange={e => setNegativePrompt(e.target.value)} 
                            rows={2} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                            placeholder="e.g., blurry, low quality, cropped, extra limbs"
                            disabled={loading}
                        />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="block text-base font-semibold text-gray-800 mb-2">Character Preview</span>
                        <div className="flex-grow bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                            <p className="text-gray-600">Generating character...</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Preview will appear here after creation</p>
                        )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition min-h-[300px]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewFileUrl ? (
                             <div className="relative w-full h-full flex justify-center">
                                <img src={previewFileUrl} alt="Preview" className="max-h-[300px] object-contain rounded-lg shadow-sm" />
                                <button 
                                    onClick={(e) => { e.stopPropagation(); resetForm(); }}
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
                                <h3 className="text-lg font-semibold text-gray-900">Click or drag image to upload</h3>
                                <p className="text-gray-500 mt-2 text-sm">Supports PNG, JPG (Max 10MB)</p>
                            </>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                        />
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                             ℹ️ Information
                        </h4>
                        <p className="text-sm text-blue-700">
                            Upload a clear image of your character. This image will be used as a direct reference for your comic scenes using our Nano Banana engine.
                        </p>
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white z-10 mt-auto">
          <button 
            onClick={handleClose}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-10 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={
                loading || 
                (activeTab === 'generate' && (!name || !appearancePrompt || !clothingPrompt)) ||
                (activeTab === 'upload' && !selectedFile)
            }
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? (activeTab === 'generate' ? 'Creating...' : 'Uploading...') : (activeTab === 'generate' ? 'Create Character' : 'Upload Character')}
          </button>
        </div>
      </div>
    </div>
  );
};