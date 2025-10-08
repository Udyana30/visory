'use client';

import { useState } from 'react';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

const voiceOptions = [
  { id: 'id-ID-ArdiNeural', name: 'Ardi (Male) - Indonesian' },
  { id: 'en-US-JennyNeural', name: 'Jenny (Female) - US English' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (Male) - UK English' },
  { id: 'ja-JP-KeitaNeural', name: 'Keita (Male) - Japanese' },
];

const languageOptions = [
  { id: 'id-ID', name: 'Indonesian' },
  { id: 'en-US', name: 'English (US)' },
  { id: 'en-GB', name: 'English (UK)' },
  { id: 'ja-JP', name: 'Japanese' },
];

const SliderControl = ({ label, name, value, min, max, step, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <span className="text-sm font-mono px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
        {value >= 0 ? '+' : ''}{value}
      </span>
    </div>
    <input
      type="range"
      name={name}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(name, parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
    <div className="flex justify-between text-xs text-gray-400">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

export default function TtsForm({ isLoading, onSubmit }) {
  const [formData, setFormData] = useState({
    title: 'My First TTS Project',
    input_text: '',
    voice_name: 'id-ID-ArdiNeural',
    language: 'id-ID',
    rate: 0,
    volume: 0,
    pitch: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSliderChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleFocus = (e) => {
    if (e.target.value === 'My First TTS Project') {
      setFormData((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      input_text: formData.input_text,
      voice_name: formData.voice_name,
      rate: `${formData.rate >= 0 ? '+' : ''}${formData.rate}%`,
      volume: `${formData.volume >= 0 ? '+' : ''}${formData.volume}%`,
      pitch: `${formData.pitch >= 0 ? '+' : ''}${formData.pitch}Hz`,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-200">

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
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
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
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 leading-relaxed"
          placeholder="Enter the text you want to convert to speech..."
          required
        ></textarea>
        <p className="text-xs text-gray-500 mt-2">
          {formData.input_text.length} characters
        </p>
      </div>

      <div className="flex items-center gap-2 text-gray-700 pt-4 border-t-2 border-gray-200">
        <SlidersHorizontal size={20} />
        <h3 className="text-lg font-bold">Voice Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="voice_name" className="block text-sm font-semibold text-gray-700 mb-2">
            Voice Name
          </label>
          <select 
            name="voice_name" 
            id="voice_name" 
            value={formData.voice_name} 
            onChange={handleInputChange} 
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium cursor-pointer"
          >
            {voiceOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
            Language
          </label>
          <select 
            name="language" 
            id="language" 
            value={formData.language} 
            onChange={handleInputChange} 
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium cursor-pointer"
          >
            {languageOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <SliderControl 
          label="Volume" 
          name="volume" 
          value={formData.volume} 
          min="-50" 
          max="50" 
          step="1" 
          onChange={handleSliderChange} 
        />
        <SliderControl 
          label="Pitch" 
          name="pitch" 
          value={formData.pitch} 
          min="-50" 
          max="50" 
          step="1" 
          onChange={handleSliderChange} 
        />
        <SliderControl 
          label="Rate" 
          name="rate" 
          value={formData.rate} 
          min="-50" 
          max="50" 
          step="1" 
          onChange={handleSliderChange} 
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
}