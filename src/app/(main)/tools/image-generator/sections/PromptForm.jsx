'use client';

import { ImageUp, Wand2 } from 'lucide-react';

const themes = ['Photorealistic', 'Anime', 'Fantasy', 'Vector Art', 'Cyberpunk', '3D Render'];
const aspectRatios = ['1:1', '16:9', '9:16'];

export default function ImagePromptForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  isLoading 
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ 
        ...prev, 
        referenceImage: {
          file,
          preview: URL.createObjectURL(file)
        } 
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, referenceImage: null }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Gambar (Prompt)
        </label>
        <textarea
          name="prompt"
          rows={4}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Contoh: Seekor astronot menunggangi kuda di luar angkasa, photorealistic"
          value={formData.prompt}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tema Gambar
        </label>
        <div className="flex flex-wrap gap-2">
          {themes.map(theme => (
            <button
              key={theme}
              type="button"
              onClick={() => handleInputChange({ target: { name: 'theme', value: theme }})}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                formData.theme === theme 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gambar Referensi (Opsional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Unggah file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                <p className="pl-1">atau tarik dan lepas</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
            </div>
          </div>
          {formData.referenceImage && (
            <div className="mt-4 relative">
              <img src={formData.referenceImage.preview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
              <button type="button" onClick={removeImage} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 text-xs">X</button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rasio Aspek
          </label>
          <div className="flex flex-col space-y-2">
            {aspectRatios.map(ratio => (
              <label key={ratio} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="aspectRatio"
                  value={ratio}
                  checked={formData.aspectRatio === ratio}
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span>{ratio}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        <Wand2 size={20} />
        {isLoading ? 'Membuat Gambar...' : 'Buat Gambar'}
      </button>
    </form>
  );
}
