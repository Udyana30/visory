import React from 'react';
import Image from 'next/image';
import { Star, Eye, BookOpen, FileText } from 'lucide-react';
import { ComicGalleryItem } from '../../types/domain';
import { isImageFile } from '@/lib/file';

interface ComicCardProps {
  data: ComicGalleryItem;
  onClick?: (id: number) => void;
}

export const ComicCard: React.FC<ComicCardProps> = ({ data, onClick }) => {
  const hasValidCover = isImageFile(data.coverUrl);

  return (
    <div 
      onClick={() => onClick?.(data.id)}
      className="group cursor-pointer flex flex-col gap-3 w-full"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
        {hasValidCover && data.coverUrl ? (
          <Image
            src={data.coverUrl}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col h-full w-full items-center justify-center text-gray-400 bg-gray-50 gap-2">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-medium text-gray-400">Read Comic</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {data.title}
          </h3>
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
             {data.metadata.genre}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{data.stats.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>{data.stats.views}</span>
          </div>
          <span>•</span>
          <span className="capitalize">{data.metadata.artStyle}</span>
        </div>
      </div>
    </div>
  );
};