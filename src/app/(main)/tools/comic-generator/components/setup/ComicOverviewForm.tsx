import React from 'react';
import { GENRES, PAGE_SIZES } from '@/lib/comic';
import { ArtStyleSelector } from './ArtStyleSelector';
import { FormData } from '@/types/comic';

interface ComicOverviewFormProps {
  formData: FormData;
  selectedArtStyle: number | null;
  onInputChange: (field: string, value: string) => void;
  onStyleSelect: (index: number) => void;
}

export const ComicOverviewForm: React.FC<ComicOverviewFormProps> = ({
  formData,
  selectedArtStyle,
  onInputChange,
  onStyleSelect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm pt-6 pb-25 px-15 sticky top-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Comic Overview</h2>
        <p className="text-gray-700">
          Define your comic's theme, style, and layout before bringing your characters to life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Comic Name
            </label>
            <input
              type="text"
              value={formData.comicName}
              onChange={(e) => onInputChange('comicName', e.target.value)}
              className="w-full px-4 py-3 border-1 border-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-900"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Genre
            </label>
            <select
              value={formData.genre}
              onChange={(e) => onInputChange('genre', e.target.value)}
              className="w-full px-4 py-3 border-1 border-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition appearance-none text-gray-900 bg-white"
            >
              <option value=""></option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Page Size
            </label>
            <select
              value={formData.pageSize}
              onChange={(e) => onInputChange('pageSize', e.target.value)}
              className="w-full px-4 py-3 border-1 border-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition appearance-none text-gray-900 bg-white"
            >
              <option value=""></option>
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <ArtStyleSelector
            selectedStyle={selectedArtStyle}
            onSelectStyle={onStyleSelect}
          />
        </div>
      </div>
    </div>
  );
};