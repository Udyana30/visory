import React, { useState } from 'react';
import { GENDERS, AGE_CATEGORIES, ART_STYLES } from '../../../constants/references';
import { CreateReferenceFormData } from '../../../types/domain/reference';

interface CharacterGeneratorFormProps {
  onSubmit: (data: CreateReferenceFormData) => void;
  loading: boolean;
  onCancel: () => void;
}

export const CharacterGeneratorForm: React.FC<CharacterGeneratorFormProps> = ({
  onSubmit,
  loading,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(GENDERS[0]);
  const [age, setAge] = useState(AGE_CATEGORIES[2]);
  const [style, setStyle] = useState(ART_STYLES[0]);
  const [appearance, setAppearance] = useState('');
  const [clothing, setClothing] = useState('');
  const [negative, setNegative] = useState('');

  const handleSubmit = () => {
    if (!name) return;

    const finalPrompt = `A ${age.toLowerCase()} ${gender.toLowerCase()}, ${style} style. ${appearance}`.trim();

    onSubmit({
      name,
      type: 'character',
      prompt: finalPrompt,
      clothingPrompt: clothing,
      negativePrompt: negative,
      age,
      gender,
      style
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Name</label>
        <input 
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
          placeholder="e.g. Hero Name"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-800 mb-2">Gender</label>
          <select 
            value={gender} 
            onChange={e => setGender(e.target.value)} 
            className="w-full px-4 py-3 border rounded-xl bg-white"
            disabled={loading}
          >
            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-gray-800 mb-2">Age</label>
          <select 
            value={age} 
            onChange={e => setAge(e.target.value)} 
            className="w-full px-4 py-3 border rounded-xl bg-white"
            disabled={loading}
          >
            {AGE_CATEGORIES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-semibold text-gray-800 mb-2">Visual Style</label>
        <select 
          value={style} 
          onChange={e => setStyle(e.target.value)} 
          className="w-full px-4 py-3 border rounded-xl bg-white"
          disabled={loading}
        >
          {ART_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-semibold text-gray-800 mb-2">Appearance</label>
        <textarea 
          value={appearance}
          onChange={e => setAppearance(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border rounded-xl"
          placeholder="blue eyes, scar on face, holding a sword"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-800 mb-2">Clothing</label>
        <textarea 
          value={clothing}
          onChange={e => setClothing(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 border rounded-xl"
          placeholder="silver armor, red cape"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-800 mb-2">Negative Prompt</label>
        <input 
          type="text"
          value={negative}
          onChange={e => setNegative(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
          placeholder="blurry, distorted"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onCancel} disabled={loading} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        <button 
          onClick={handleSubmit} 
          disabled={loading || !name} 
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Generate Character'}
        </button>
      </div>
    </div>
  );
};