'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Globe, Share2, Download } from 'lucide-react';
import { galleryService } from '@/features/explore/services/galleryService';
import { ComicGalleryItem } from '@/features/explore/types/domain';
import { ComicReader } from '@/features/explore/components/reader/ComicReader';
import { ReviewSection } from '@/features/explore/components/reviews/ReviewSection';

export default function ComicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [comic, setComic] = useState<ComicGalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        if (params.id) {
          const data = await galleryService.getById(Number(params.id));
          setComic(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComic();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!comic) return null;

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-8">
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12">
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  {comic.metadata.genre}
                </span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-600 text-sm font-medium capitalize">
                  {comic.metadata.artStyle} Style
                </span>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <button 
                  onClick={() => router.back()}
                  className="mt-1.5 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"
                  aria-label="Back to explore"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {comic.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-6 pl-[56px]">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Author ID: {comic.authorId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{comic.metadata.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>{comic.metadata.language}</span>
                </div>
              </div>

              <div className="pl-[56px]">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  {comic.description}
                </p>

                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      <Share2 size={18} />
                      Share
                  </button>
                  {comic.downloadUrl && (
                    <a 
                      href={comic.downloadUrl}
                      download
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      <Download size={18} />
                      Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-20" id="reader-container">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-2">Reader View</h2>
          <div className="w-full shadow-2xl rounded-xl overflow-hidden bg-gray-100 min-h-[600px]">
            <ComicReader 
              url={comic.downloadUrl} 
              title={comic.title} 
            />
          </div>
        </div>

        <ReviewSection comicId={comic.id} />
        
      </div>
    </main>
  );
}