import React, { useState, useRef, ChangeEvent } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { Character } from '@/types/comic';
import { GENDERS, AGE_CATEGORIES } from '@/lib/comic';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (characterData: Omit<Character, 'id' | 'imageUrl'>, files: File[]) => void;
}

const STYLES = ['Realistic', 'Anime', 'Cartoon', 'Old Comic'];

export const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(GENDERS[0]);
  const [age, setAge] = useState(AGE_CATEGORIES[2]);
  const [style, setStyle] = useState('Realistic');
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    
    const removedUrl = newPreviewUrls.splice(index, 1)[0];
    newFiles.splice(index, 1);
    
    URL.revokeObjectURL(removedUrl);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setName('');
    setGender(GENDERS[0]);
    setAge(AGE_CATEGORIES[2]);
    setStyle('Realistic');
    setPrompt('');
    
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = () => {
    if (!name) {
      alert('Please fill all required fields.');
      return;
    }
    onCreate({ name, gender, age, style, appearancePrompt: prompt }, files);
    handleClose();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newFileUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setPreviewUrls(prevUrls => [...prevUrls, ...newFileUrls]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Create Character</h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">Character Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-800"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition appearance-none bg-white text-gray-800">
                  {GENDERS.map(g => (<option key={g} value={g}>{g}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">Age</label>
                <select value={age} onChange={e => setAge(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition appearance-none bg-white text-gray-800">
                  {AGE_CATEGORIES.map(a => (<option key={a} value={a}>{a}</option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">Style</label>
              <div className="grid grid-cols-4 gap-2">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setStyle(s)} className={`p-2 rounded-lg border-2 ${style === s ? 'border-blue-600' : 'border-gray-200'}`}>
                    <div className="w-full h-16 bg-gray-200 rounded-md mb-2"></div>
                    <span className="text-sm font-medium text-gray-700">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">Upload References <span className="text-gray-500 font-normal">(Optional)</span></label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg"
                multiple
              />
              
              {previewUrls.length === 0 ? (
                <label
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span>Click or drag to upload</span>
                </label>
              ) : (
                <div className="w-full p-3 border-2 border-gray-300 rounded-xl min-h-[140px] flex flex-wrap gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                      <img src={url} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  <label
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition flex-shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-6 h-6 mb-1" />
                    <span className="text-xs text-center">Upload more</span>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">Appearance Prompt</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-800"></textarea>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="block text-base font-semibold text-gray-800 mb-2">Character Preview</span>
            <div className="flex-grow bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Preview will appear here</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="py-3 px-4 rounded-lg border border-gray-300 font-semibold text-gray-800 hover:bg-gray-50 transition">History Generate</button>
              <button className="py-3 px-4 rounded-lg border border-gray-300 font-semibold text-gray-800 hover:bg-gray-50 transition">Preview Character</button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end sticky bottom-0 bg-white z-10">
          <button onClick={handleCreate} className="px-10 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Create Character
          </button>
        </div>
      </div>
    </div>
  );
};