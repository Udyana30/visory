'use client';

import { useState } from 'react';
import { Video, User, Mic, Sparkles, Play, Download, CheckCircle, AlertCircle, Settings2, Image } from 'lucide-react';

// Avatar presets
const avatarPresets = [
  { id: 'avatar-1', name: 'Professional Male', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', voice: 'en-US-GuyNeural' },
  { id: 'avatar-2', name: 'Professional Female', thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', voice: 'en-US-JennyNeural' },
  { id: 'avatar-3', name: 'Casual Male', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', voice: 'en-GB-RyanNeural' },
  { id: 'avatar-4', name: 'Business Female', thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop', voice: 'en-US-AriaNeural' },
];

// Background options
const backgroundOptions = [
  { id: 'studio-1', name: 'Modern Studio', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'studio-2', name: 'Tech Office', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'studio-3', name: 'Minimalist', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'studio-4', name: 'Dark Mode', preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
];

const voiceOptions = [
  { id: 'en-US-GuyNeural', name: 'Guy (Male) - US English' },
  { id: 'en-US-JennyNeural', name: 'Jenny (Female) - US English' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (Male) - UK English' },
  { id: 'en-US-AriaNeural', name: 'Aria (Female) - US English' },
];

// Avatar Card Component
const AvatarCard = ({ avatar, isSelected, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(avatar)}
    className={`relative group overflow-hidden rounded-xl border-3 transition-all ${
      isSelected 
        ? 'border-blue-600 shadow-lg scale-105' 
        : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
    }`}
  >
    <div className="aspect-square bg-gray-100">
      <img 
        src={avatar.thumbnail} 
        alt={avatar.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent ${
      isSelected ? 'from-blue-600/90' : ''
    }`}>
      <p className="text-white font-semibold text-sm">{avatar.name}</p>
    </div>
    {isSelected && (
      <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
        <CheckCircle size={16} className="text-white" />
      </div>
    )}
  </button>
);

// Background Card Component
const BackgroundCard = ({ background, isSelected, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(background)}
    className={`relative overflow-hidden rounded-lg border-2 transition-all h-20 ${
      isSelected 
        ? 'border-blue-600 shadow-lg scale-105' 
        : 'border-gray-200 hover:border-blue-400'
    }`}
  >
    <div 
      className="w-full h-full"
      style={{ background: background.preview }}
    />
    <div className={`absolute inset-x-0 bottom-0 px-2 py-1 text-xs font-semibold text-white bg-black/50 ${
      isSelected ? 'bg-blue-600/80' : ''
    }`}>
      {background.name}
    </div>
    {isSelected && (
      <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5">
        <CheckCircle size={12} className="text-white" />
      </div>
    )}
  </button>
);

// Form Component
const AvatarForm = ({ isLoading, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: 'My Podcast Video',
    script: '',
    selectedAvatar: avatarPresets[0],
    selectedBackground: backgroundOptions[0],
    voiceName: 'en-US-GuyNeural',
    videoRatio: '16:9',
    duration: 'auto',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar) => {
    setFormData((prev) => ({ 
      ...prev, 
      selectedAvatar: avatar,
      voiceName: avatar.voice 
    }));
  };

  const handleBackgroundSelect = (background) => {
    setFormData((prev) => ({ ...prev, selectedBackground: background }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      script: formData.script,
      avatar_id: formData.selectedAvatar.id,
      background_id: formData.selectedBackground.id,
      voice_name: formData.voiceName,
      video_ratio: formData.videoRatio,
      duration: formData.duration,
    };
    onSubmit(payload);
  };

  const wordCount = formData.script.trim().split(/\s+/).filter(Boolean).length;
  const estimatedDuration = Math.ceil(wordCount / 150 * 60);

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      
      {/* Project Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Project Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
          required
        />
      </div>

      {/* Avatar Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Choose Avatar</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {avatarPresets.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              isSelected={formData.selectedAvatar.id === avatar.id}
              onClick={handleAvatarSelect}
            />
          ))}
        </div>
      </div>

      {/* Script Input */}
      <div>
        <label htmlFor="script" className="block text-sm font-semibold text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Mic size={18} />
            Video Script
          </div>
        </label>
        <textarea
          name="script"
          id="script"
          rows={10}
          value={formData.script}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 leading-relaxed"
          placeholder="Enter your podcast script here. The avatar will speak these words naturally..."
          required
        ></textarea>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{wordCount} words • ~{estimatedDuration}s estimated</span>
          <span>{formData.script.length} characters</span>
        </div>
      </div>

      {/* Video Settings */}
      <div className="border-t-2 border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 size={20} className="text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Video Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="voiceName" className="block text-sm font-semibold text-gray-700 mb-2">
              Voice Selection
            </label>
            <select 
              name="voiceName" 
              id="voiceName" 
              value={formData.voiceName} 
              onChange={handleInputChange} 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium cursor-pointer"
            >
              {voiceOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="videoRatio" className="block text-sm font-semibold text-gray-700 mb-2">
              Aspect Ratio
            </label>
            <select 
              name="videoRatio" 
              id="videoRatio" 
              value={formData.videoRatio} 
              onChange={handleInputChange} 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium cursor-pointer"
            >
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Video...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Podcast Video
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Result Display Component
const ResultDisplay = ({ isLoading, error, result }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-28">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Video size={20} className="text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Preview</h2>
      </div>
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <Video size={24} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600" />
            </div>
            <p className="text-gray-600 font-medium">Generating your video...</p>
            <p className="text-sm text-gray-400">This may take a few moments</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 max-w-xs">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5"/>
            <div>
              <p className="font-semibold mb-1">Generation Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {result && !isLoading && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <CheckCircle size={18} />
            <span className="text-sm font-semibold">Video Ready!</span>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-gray-900 break-words mb-3 flex items-center gap-2">
              <Play size={18} className="text-purple-600 flex-shrink-0" />
              {result.title}
            </h3>
          </div>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800">
            <video 
              controls 
              className="w-full aspect-video"
              src={result.video_url || '#'}
              poster={result.thumbnail_url}
            >
              Your browser does not support the video element.
            </video>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2 pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Avatar:</span>
              <span className="text-gray-900">{result.avatar_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Duration:</span>
              <span className="text-gray-900">{result.duration}s</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Resolution:</span>
              <span className="text-gray-900">{result.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Created:</span>
              <span className="text-gray-900">{new Date(result.created_at).toLocaleString()}</span>
            </div>
          </div>
          
          <a 
            href={result.video_url || '#'}
            download
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
          >
            <Download size={18} />
            Download Video
          </a>
        </div>
      )}

      {!isLoading && !error && !result && (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-full">
              <Video size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No video generated yet</p>
            <p className="text-sm text-gray-400">Configure settings and generate</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Page Component
export default function AvatarGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (payload) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response
      const response = {
        title: payload.title,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
        avatar_name: payload.avatar_id,
        duration: 120,
        resolution: '1920x1080',
        created_at: new Date().toISOString(),
      };
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to generate video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <header className="mb-8 ml-8">
          <h1 className="text-3xl font-bold text-gray-900">Avatar Generator</h1>
          <p className="mt-2 text-md text-gray-600">
            Create engaging video podcasts with AI-powered avatars and natural voices.
          </p>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start ml-6 mt-4">
          <div className="lg:col-span-2">
            <AvatarForm isLoading={isLoading} onSubmit={handleGenerate} />
          </div>
          <div className="lg:col-span-1">
            <ResultDisplay isLoading={isLoading} error={error} result={result} />
          </div>
        </main>
      </div>
    </div>  
  );
}