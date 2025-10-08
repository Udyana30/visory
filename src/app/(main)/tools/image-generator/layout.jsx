export const metadata = {
  title: 'Image Generator',
  description: 'Create stunning visuals with AI-powered image generation.',
};

export default function ImageGeneratorLayout({ children }) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Image Generator</h1>
        <p className="text-gray-500 mt-1">
          Ubah imajinasi Anda menjadi gambar yang menakjubkan dengan kekuatan AI.
        </p>
      </div>
      {children}
    </div>
  );
}
