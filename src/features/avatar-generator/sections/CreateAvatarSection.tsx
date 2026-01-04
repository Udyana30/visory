import React from 'react';
import { Sparkles, AlertCircle, Settings2 } from 'lucide-react';
import { AvatarUploader } from '../components/AvatarUploader';
import { AudioInput } from '../components/AudioInput';
import { ParameterSettings } from '../components/ParameterSettings';
import { QualityPresetSelector } from '../components/QualityPresetSelector';
import { TemplateModal } from '../components/AvatarTemplates/TemplateModal';
import { useAvatarForm } from '../hooks/useAvatarForm';
import { useAvatarSubmission } from '../hooks/useAvatarSubmission';
import { validateAvatarForm } from '../utils/avatarValidation';
import { useAuth } from '@/hooks/useAuth';

interface CreateAvatarSectionProps {
  onSuccess: () => void;
}

export const CreateAvatarSection: React.FC<CreateAvatarSectionProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const {
    formState,
    updateField,
    updateParams,
    updateParamsPartial,
    handleImageSelect,
    handleTemplateSelect,
    reset
  } = useAvatarForm();

  const { submit, isSubmitting, error } = useAvatarSubmission();

  // Prefetch TTS voices on mount
  React.useEffect(() => {
    import('../services/tts/kokoroService').then(({ kokoroService }) => {
      kokoroService.getVoices().catch(err => console.error('Failed to prefetch voices:', err));
    });
  }, []);

  const handleSubmit = async () => {
    if (!user?.id) {
      alert("Please login first to generate avatar.");
      return;
    }

    const validation = validateAvatarForm(formState);
    if (!validation.isValid) {
      return;
    }

    try {
      await submit({
        userId: user.id,
        title: formState.title,
        prompt: formState.prompt,
        imageFile: formState.imageFile,
        previewUrl: formState.previewUrl,
        audioFile1: formState.audioFile1,
        audioFile2: formState.audioFile2,
        audioOrder: formState.audioOrder,
        params: formState.params
      });

      reset();
      onSuccess();
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const validation = validateAvatarForm(formState);
  const isReady = validation.isValid && !!user?.id;

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
                  value={formState.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g., Dual Conversation V1"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-0.5">System Prompt</label>
                <textarea
                  value={formState.prompt}
                  onChange={(e) => updateField('prompt', e.target.value)}
                  disabled={isSubmitting}
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
                <div className="flex-1">
                  <AvatarUploader
                    currentPreview={formState.previewUrl}
                    onFileSelect={handleImageSelect}
                    onTemplateClick={() => updateField('templateModalOpen', true)}
                    disabled={isSubmitting}
                  />
                  <TemplateModal
                    isOpen={formState.templateModalOpen}
                    onClose={() => updateField('templateModalOpen', false)}
                    onSelect={(template) => handleTemplateSelect(template.image_url)}
                    selectedId={formState.previewUrl && !formState.imageFile ? undefined : undefined}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 h-full">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Voice Input</span>
                <div className="flex-1">
                  <AudioInput
                    file1={formState.audioFile1}
                    file2={formState.audioFile2}
                    onSetFile1={(file) => updateField('audioFile1', file)}
                    onSetFile2={(file) => updateField('audioFile2', file)}
                    onClear1={() => updateField('audioFile1', null)}
                    onClear2={() => updateField('audioFile2', null)}
                    audioOrder={formState.audioOrder}
                    setAudioOrder={(order) => updateField('audioOrder', order)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 h-full">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Quality Preset</span>
                <div className="flex-1 border border-gray-200 rounded-xl p-3 bg-gray-50/30 overflow-hidden">
                  <QualityPresetSelector
                    currentParams={formState.params}
                    onSelect={updateParamsPartial}
                    disabled={isSubmitting}
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
              settings={formState.params}
              onChange={updateParams}
              disabled={isSubmitting}
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
              disabled={!isReady || isSubmitting}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Processing...
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