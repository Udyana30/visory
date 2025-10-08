'use client';

import { Download, Image as ImageIcon } from 'lucide-react';

export default function ImageResultDisplay({ isLoading, error, images }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <p className="font-semibold text-red-700">Terjadi Kesalahan</p>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
        <ImageIcon size={48} className="text-gray-400 mb-4" />
        <p className="font-semibold text-gray-700">Hasil Gambar Anda Akan Muncul di Sini</p>
        <p className="text-sm text-gray-500 mt-1">Isi form di sebelah kiri untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {images.map((src, index) => (
        <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
          <img src={src} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <a 
              href={src} 
              download={`generated_image_${index + 1}.png`}
              className="flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Download size={16} />
              Unduh
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
