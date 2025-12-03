import React, { useState, useEffect } from 'react';
import { ART_STYLES } from '../../../../constants/references';
import { CreateReferenceFormData, Reference } from '../../../../types/domain/reference';

interface Props {
  initialData?: Reference;
  onSubmit: (data: CreateReferenceFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export const BackgroundGeneratorForm: React.FC<Props> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    style: ART_STYLES[0],
    prompt: '',
    negative: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        style: ART_STYLES.find(s => initialData.prompt.includes(s)) || ART_STYLES[0],
        prompt: initialData.prompt,
        negative: initialData.negativePrompt
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!formData.name) return;
    const finalPrompt = initialData ? formData.prompt : `${formData.prompt}, ${formData.style} style`.trim();
    
    onSubmit({
      name: formData.name,
      type: 'background',
      prompt: finalPrompt,
      negativePrompt: formData.negative,
      style: formData.style
    });
  };

  const inputClasses = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location Name</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className={inputClasses}
          placeholder="e.g. Ancient Ruins"
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Visual Style</label>
        <select 
          value={formData.style} 
          onChange={e => setFormData({...formData, style: e.target.value})}
          className={inputClasses}
          disabled={loading}
        >
          {ART_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Scene Description</label>
        <textarea 
          value={formData.prompt}
          onChange={e => setFormData({...formData, prompt: e.target.value})}
          rows={4}
          className={inputClasses}
          placeholder="Describe the environment, lighting, weather, and mood..."
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
        <button onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading || !formData.name}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 disabled:opacity-50 transition-all"
        >
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Generate Background'}
        </button>
      </div>
    </div>
  );
};