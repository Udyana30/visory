import React from 'react';
import { GENRES, PAGE_SIZES } from '@/app/(main)/tools/comic-generator/lib/comic';
import { ArtStyleSelector } from './ArtStyleSelector';
import { Dropdown } from './Dropdown';
import { FormData } from '@/app/(main)/tools/comic-generator/types/comic';

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
    <div className="bg-white rounded-xl shadow-sm py-10 px-10 sticky top-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Comic Overview</h2>
        <p className="text-gray-700">
          Define your comic's theme, style, and layout before bringing your characters to life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Comic Name
            </label>
            <input
              type="text"
              value={formData.comicName}
              onChange={(e) => onInputChange('comicName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
              placeholder="Enter comic name"
            />
          </div>

          <Dropdown
            label="Genre"
            value={formData.genre}
            options={GENRES}
            placeholder="Select genre"
            onChange={(value) => onInputChange('genre', value)}
          />

          <Dropdown
            label="Page Size"
            value={formData.pageSize}
            options={PAGE_SIZES}
            placeholder="Select page size"
            onChange={(value) => onInputChange('pageSize', value)}
          />
        </div>

        <div className="h-full">
          <ArtStyleSelector
            selectedStyle={selectedArtStyle}
            onSelectStyle={onStyleSelect}
          />
        </div>
      </div>
    </div>
  );
};