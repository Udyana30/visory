import React, { useState } from 'react';
import { Sparkles, AlertCircle, Settings2 } from 'lucide-react';
import { AvatarUploader } from '../components/AvatarUploader';
import { AudioInput } from '../components/AudioInput';
import { ParameterSettings } from '../components/ParameterSettings';
import { QualityPresetSelector } from '../components/QualityPresetSelector';
import { TemplateSelector } from '../components/TemplateSelector';
import { useAvatarActions } from '../hooks/useAvatarActions';
import { useFileUpload } from '../hooks/useFileUpload';
import { AvatarParameters } from '../types/domain/project';
import { DEFAULT_AVATAR_PARAMS, DEFAULT_AVATAR_PROMPT } from '../constants/defaults';
import { useAuth } from '@/hooks/useAuth';

interface CreateAvatarSectionProps {
  onSuccess: () => void;
}

export const CreateAvatarSection: React.FC<CreateAvatarSectionProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { createAvatar, isCreating, error: submitError } = useAvatarActions();
  const { uploadFile, deleteFile, isUploading, error: uploadError } = useFileUpload();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState(DEFAULT_AVATAR_PROMPT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [params, setParams] = useState<AvatarParameters>(DEFAULT_AVATAR_PARAMS);

  const [audioFile1, setAudioFile1] = useState<File | null>(null);
  const [audioFile2, setAudioFile2] = useState<File | null>(null);
  const [audioOrder, setAudioOrder] = useState<string>('meanwhile');

  // Prefetch Kokoro voices
  React.useEffect(() => {
    import('../services/kokoroService').then(({ kokoroService }) => {
      kokoroService.getVoices().catch(err => console.error('Failed to prefetch voices:', err));
    });
  }, []);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleParamChange = (key: keyof AvatarParameters, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handlePresetSelect = (newParams: Partial<AvatarParameters>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert("Please login first to generate avatar.");
      return;
    }

    if (!title || (!imageFile && !previewUrl) || (!audioFile1 && !audioFile2)) return;

    try {
      // 1. Parallel Upload dengan Error Handling yang Jelas
      const uploadPromises = [
        imageFile ? uploadFile(imageFile) : Promise.resolve(null),
        audioFile1 ? uploadFile(audioFile1) : Promise.resolve(null),
        audioFile2 ? uploadFile(audioFile2) : Promise.resolve(null),
      ];

      const [imageResult, audioResult1, audioResult2] = await Promise.all(uploadPromises);

      const uploadedImageUrl = imageResult?.url;
      const uploadedAudioUrl1 = audioResult1?.url;
      const uploadedAudioUrl2 = audioResult2?.url;

      // 2. Validasi Hasil Upload
      if (imageFile && !uploadedImageUrl) throw new Error("Failed to upload source image.");
      if (audioFile1 && !uploadedAudioUrl1) throw new Error("Failed to upload primary audio.");
      if (audioFile2 && !uploadedAudioUrl2) throw new Error("Failed to upload secondary audio.");

      // Determine final image URL: either from upload or existing preview (template)
      const finalImageUrl = imageFile ? uploadedImageUrl : previewUrl;
      if (!finalImageUrl) throw new Error("No image source available.");

      // Pastikan minimal 1 aset audio tersedia
      const finalAudioUrl = uploadedAudioUrl1 || uploadedAudioUrl2;
      if (!finalAudioUrl) throw new Error("No audio uploaded.");

      const isMultiPerson = !!uploadedAudioUrl1 && !!uploadedAudioUrl2;

      // 3. Create Project
      await createAvatar({
        userId: user.id,
        title,
        prompt,
        imageUrl: finalImageUrl,
        audioUrl: finalAudioUrl,
        parameters: params,
        type: isMultiPerson ? 'multi_person' : 'single_person',
        audioOrder: isMultiPerson ? audioOrder : undefined,
        // Pass audio 2 via any/custom field sesuai service
        ...(isMultiPerson && { audioUrl2: uploadedAudioUrl2 } as any)
      });

      // 4. Cleanup Cloudinary Files (Auto Delete)
      const filesToDelete = [
        imageResult?.id_file,
        audioResult1?.id_file,
        audioResult2?.id_file
      ].filter((id): id is string => !!id);

      if (filesToDelete.length > 0) {
        // Jalankan delete di background agar tidak memblokir UI
        Promise.all(filesToDelete.map(id => deleteFile(id)))
          .catch(err => console.error("Failed to cleanup files:", err));
      }

      onSuccess();

      // Reset State
      setTitle('');
      setPrompt(DEFAULT_AVATAR_PROMPT);
      setImageFile(null);
      setAudioFile1(null);
      setAudioFile2(null);
      setPreviewUrl(undefined);
      setAudioOrder('meanwhile');
      setParams(DEFAULT_AVATAR_PARAMS);

    } catch (err) {
      console.error('Submission Process Failed:', err);
      // Error akan ditangani oleh state `error` dari hooks
    }
  };

  const isReady = (imageFile || previewUrl) && (audioFile1 || audioFile2) && title.trim().length > 0;
  const isBusy = isCreating || isUploading;
  const error = submitError || uploadError;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">

        <div className="xl:col-span-8 flex flex-col h-full">
          <div className="p-6 pb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Project Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-0.5">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isBusy}
                  placeholder="e.g., Dual Conversation V1"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-0.5">System Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isBusy}
                  rows={2}
                  placeholder="Describe facial expressions and behavior..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-100"></div>

          <div className="p-6 pt-4 flex-1 min-h-[340px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">

              <div className="flex flex-col gap-2 h-full">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Source Image</span>
                <div className="flex-1 flex flex-col gap-3">
                  <AvatarUploader
                    currentPreview={previewUrl}
                    onFileSelect={handleImageSelect}
                    disabled={isBusy}
                  />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>
                  <TemplateSelector
                    onSelect={(template) => {
                      setImageFile(null);
                      setPreviewUrl(template.image_url);
                    }}
                    selectedId={previewUrl && !imageFile ? undefined : undefined}
                    disabled={isBusy}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 h-full">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Voice Input</span>
                <div className="flex-1">
                  <AudioInput
                    file1={audioFile1}
                    file2={audioFile2}
                    onSetFile1={setAudioFile1}
                    onSetFile2={setAudioFile2}
                    onClear1={() => setAudioFile1(null)}
                    onClear2={() => setAudioFile2(null)}
                    audioOrder={audioOrder}
                    setAudioOrder={setAudioOrder}
                    disabled={isBusy}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 h-full">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Quality Preset</span>
                <div className="flex-1 border border-gray-200 rounded-xl p-3 bg-gray-50/30 overflow-hidden">
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
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Advanced Settings</h3>
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
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2.5 rounded-xl border border-red-100">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium truncate">{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isReady || isBusy || !user?.id}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              {isBusy ? (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  {isUploading ? 'Uploading Assets...' : 'Generating Project...'}
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