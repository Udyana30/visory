import React, { useState, useEffect } from 'react';
import { GENDERS, AGE_CATEGORIES, ART_STYLES } from '../../../../constants/references';
import { CreateReferenceFormData, Reference } from '../../../../types/domain/reference';

interface Props {
  initialData?: Reference;
  onSubmit: (data: CreateReferenceFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export const CharacterGeneratorForm: React.FC<Props> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: GENDERS[0],
    age: AGE_CATEGORIES[2],
    style: ART_STYLES[0],
    appearance: '',
    clothing: '',
    negative: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        gender: GENDERS.find(g => initialData.prompt.includes(g.toLowerCase())) || GENDERS[0],
        age: AGE_CATEGORIES.find(a => initialData.prompt.includes(a.toLowerCase())) || AGE_CATEGORIES[2],
        style: ART_STYLES.find(s => initialData.prompt.includes(s)) || ART_STYLES[0],
        appearance: initialData.prompt, 
        clothing: initialData.clothingPrompt || '',
        negative: initialData.negativePrompt
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!formData.name) return;
    const prompt = initialData ? formData.appearance : `A ${formData.age.toLowerCase()} ${formData.gender.toLowerCase()}, ${formData.style} style. ${formData.appearance}`.trim();
    
    onSubmit({
      name: formData.name,
      type: 'character',
      prompt,
      clothingPrompt: formData.clothing,
      negativePrompt: formData.negative,
      age: formData.age,
      gender: formData.gender,
      style: formData.style
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputClasses = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Character Identity</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={e => updateField('name', e.target.value)}
          className={inputClasses}
          placeholder="e.g. Cyberpunk Hero"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</label>
          <select 
            value={formData.gender}
            onChange={e => updateField('gender', e.target.value)}
            className={inputClasses}
            disabled={loading}
          >
            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age Group</label>
          <select 
            value={formData.age}
            onChange={e => updateField('age', e.target.value)}
            className={inputClasses}
            disabled={loading}
          >
            {AGE_CATEGORIES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Physical Appearance</label>
        <textarea 
          value={formData.appearance}
          onChange={e => updateField('appearance', e.target.value)}
          rows={3}
          className={inputClasses}
          placeholder="Detailed description of face, hair, body type..."
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Clothing & Style</label>
        <textarea 
          value={formData.clothing}
          onChange={e => updateField('clothing', e.target.value)}
          rows={2}
          className={inputClasses}
          placeholder="Outfit details, accessories, colors..."
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
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Generate Character'}
        </button>
      </div>
    </div>
  );
};