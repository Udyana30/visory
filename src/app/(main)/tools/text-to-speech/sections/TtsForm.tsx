import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import SliderControl from '../components/SliderControl';
import { VOICE_OPTIONS, LANGUAGE_OPTIONS, SLIDER_CONFIGS, INITIAL_FORM_DATA } from '../lib/tts.constants';
import { TTSFormData, TTSRequestData } from '@/types/tts';
import { formatPayload } from '../lib/tts.utils';

interface TtsFormProps {
  isLoading: boolean;
  onSubmit: (payload: TTSRequestData) => void;
}

const TtsForm: React.FC<TtsFormProps> = ({ isLoading, onSubmit }) => {
  const [formData, setFormData] = useState<TTSFormData>(INITIAL_FORM_DATA);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === INITIAL_FORM_DATA.title) {
      setFormData((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    const voiceForLanguage = VOICE_OPTIONS.find(v => v.language === selectedLanguage);
    
    setFormData((prev) => ({
      ...prev,
      language: selectedLanguage,
      voice_name: voiceForLanguage?.id || prev.voice_name,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = formatPayload(formData);
    onSubmit(payload);
  };

  const filteredVoices = VOICE_OPTIONS.filter(v => v.language === formData.language);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Project Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
          onFocus={handleTitleFocus}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-900 font-medium"
          required
        />
      </div>

      <div>
        <label htmlFor="input_text" className="block text-sm font-semibold text-gray-700 mb-2">
          Text to Convert
        </label>
        <textarea
          name="input_text"
          id="input_text"
          rows={8}
          value={formData.input_text}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-900 leading-relaxed resize-none"
          placeholder="Enter the text you want to convert to speech..."
          required
        />
        <p className="text-xs text-gray-500 mt-2">
          {formData.input_text.length} characters
        </p>
      </div>

      <div className="flex items-center gap-2 text-gray-900 pt-4 border-t border-gray-200">
        <SlidersHorizontal size={20} />
        <h3 className="text-lg font-bold">Voice Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
            Language
          </label>
          <select
            name="language"
            id="language"
            value={formData.language}
            onChange={handleLanguageChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-900 font-medium cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="voice_name" className="block text-sm font-semibold text-gray-700 mb-2">
            Voice Name
          </label>
          <select
            name="voice_name"
            id="voice_name"
            value={formData.voice_name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-900 font-medium cursor-pointer"
          >
            {filteredVoices.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} ({opt.gender})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {SLIDER_CONFIGS.map((config) => (
          <SliderControl
            key={config.name}
            label={config.label}
            name={config.name}
            value={formData[config.name]}
            min={config.min}
            max={config.max}
            step={config.step}
            unit={config.unit}
            onChange={handleSliderChange}
          />
        ))}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Generating...
            </>
          ) : (
            <>
              Generate Voice
              <Sparkles size={20} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TtsForm;