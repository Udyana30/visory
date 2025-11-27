import React, { useState } from 'react';
import { ART_STYLES } from '../../../constants/references';
import { CreateReferenceFormData } from '../../../types/domain/reference';

interface BackgroundGeneratorFormProps {
  onSubmit: (data: CreateReferenceFormData) => void;
  loading: boolean;
  onCancel: () => void;
}

export const BackgroundGeneratorForm: React.FC<BackgroundGeneratorFormProps> = ({
  onSubmit,
  loading,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [style, setStyle] = useState(ART_STYLES[0]);
  const [prompt, setPrompt] = useState('');
  const [negative, setNegative] = useState('');

  const handleSubmit = () => {
    if (!name) return;

    const finalPrompt = `${prompt}, ${style} style`.trim();

    onSubmit({
      name,
      type: 'background',
      prompt: finalPrompt,
      negativePrompt: negative,
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
          placeholder="e.g. Dark Forest"
          disabled={loading}
        />
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
        <label className="block font-semibold text-gray-800 mb-2">Description</label>
        <textarea 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border rounded-xl"
          placeholder="ruins covered in moss, misty atmosphere, full moon"
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
          className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Generate Background'}
        </button>
      </div>
    </div>
  );
};