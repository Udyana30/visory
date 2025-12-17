import React, { useState } from 'react';
import { Sparkles, AlertCircle, Settings2 } from 'lucide-react';
import { AvatarUploader } from '../components/AvatarUploader';
import { AudioInput } from '../components/AudioInput';
import { ParameterSettings } from '../components/ParameterSettings';
import { QualityPresetSelector } from '../components/QualityPresetSelector';
import { useAvatarActions } from '../hooks/useAvatarActions';
import { useFileUpload } from '../hooks/useFileUpload';
import { CreateAvatarPayload, AvatarParameters } from '../types/domain/project';
import { DEFAULT_AVATAR_PARAMS, DEFAULT_AVATAR_PROMPT } from '../constants/defaults';

interface CreateAvatarSectionProps {
  onSuccess: () => void;
}

export const CreateAvatarSection: React.FC<CreateAvatarSectionProps> = ({ onSuccess }) => {
  const { createAvatar, isCreating: isSubmitting, error: submitError } = useAvatarActions();
  const { uploadFile, isUploading, error: uploadError } = useFileUpload();
  
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState(DEFAULT_AVATAR_PROMPT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [params, setParams] = useState<AvatarParameters>(DEFAULT_AVATAR_PARAMS);

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleAudioSelect = (file: File) => {
    setAudioFile(file);
  };

  const handleParamChange = (key: keyof AvatarParameters, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handlePresetSelect = (newParams: Partial<AvatarParameters>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const handleSubmit = async () => {
    if (!imageFile || !audioFile || !title.trim()) return;

    try {
      const imageUrl = await uploadFile(imageFile);
      if (!imageUrl) return;

      const audioUrl = await uploadFile(audioFile);
      if (!audioUrl) return;

      const payload: CreateAvatarPayload = {
        title: title.trim(),
        prompt: prompt.trim() || DEFAULT_AVATAR_PROMPT,
        imageUrl, 
        audioUrl,
        parameters: params
      };

      const result = await createAvatar(payload);
      
      if (result) {
        setTitle('');
        setPrompt(DEFAULT_AVATAR_PROMPT);
        setImageFile(null);
        setAudioFile(null);
        setPreviewUrl(undefined);
        setParams(DEFAULT_AVATAR_PARAMS);
        onSuccess();
      }
    } catch (error) {
      console.error("Process failed", error);
    }
  };

  const isReady = imageFile && audioFile && title.trim().length > 0;
  const isBusy = isSubmitting || isUploading;
  const error = submitError || uploadError;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x divide-gray-100 min-h-[500px]">
        
        <div className="xl:col-span-8 flex flex-col h-full">
          <div className="p-6 pb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">PROJECT DETAIL</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-0.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isBusy}
                  placeholder="My New Avatar..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-0.5">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isBusy}
                  rows={2}
                  placeholder="Describe the facial expressions..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm text-gray-900 placeholder-gray-400 bg-white resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-100"></div>

          <div className="p-6 pt-4 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[300px]">
              
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Source Image</span>
                <div className="flex-1">
                  <AvatarUploader 
                    previewUrl={previewUrl}
                    onFileSelect={handleImageSelect}
                    onClear={() => {
                      setImageFile(null);
                      setPreviewUrl(undefined);
                    }}
                    disabled={isBusy}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Voice Input</span>
                <div className="flex-1">
                  <AudioInput 
                    fileName={audioFile?.name}
                    onFileSelect={handleAudioSelect}
                    onClear={() => setAudioFile(null)}
                    disabled={isBusy}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Quality Preset</span>
                <div className="flex-1 border border-gray-200 rounded-2xl p-3 bg-gray-50/30 overflow-hidden">
                  <QualityPresetSelector 
                    currentParams={params}
                    onSelect={handlePresetSelect}
                    disabled={isBusy}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="xl:col-span-4 bg-white flex flex-col h-full min-h-[500px]">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900">ADVANCED SETTING</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <ParameterSettings 
              settings={params}
              onChange={handleParamChange}
              disabled={isBusy}
            />
          </div>

          <div className="p-5 border-t border-gray-100 space-y-3 bg-white mt-auto">
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium truncate">{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isReady || isBusy}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              {isBusy ? (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  {isUploading ? 'Uploading...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  GENERATE VIDEO
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};