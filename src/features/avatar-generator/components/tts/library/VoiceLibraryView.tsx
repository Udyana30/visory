import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, Play, Pause, Search, Mic, ChevronLeft } from 'lucide-react';
import { UseVoiceLibraryResult } from '../../../hooks/tts/useVoiceLibrary';
import { VoiceSample } from '../../../types/domain/chatterbox';

interface VoiceLibraryViewProps {
    onSelect: (voice: VoiceSample) => void;
    onClose?: () => void;
    selectedId?: string;
    voiceLib: UseVoiceLibraryResult;
    onBack?: () => void;
}

export const VoiceLibraryView: React.FC<VoiceLibraryViewProps> = ({
    onSelect,
    selectedId,
    voiceLib,
    onBack
}) => {
    const { voices, isLoading, isFetchingMore, uploadVoice, deleteVoice, hasMore, loadMore } = voiceLib;

    const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');
    const [search, setSearch] = useState('');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Upload State
    const [uploadName, setUploadName] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadDesc, setUploadDesc] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Infinite Scroll Observer
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        }, { threshold: 0, rootMargin: '200px' });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingMore, hasMore, loadMore]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    const handlePlay = (url: string, id: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(url);
            audioRef.current.play();
            audioRef.current.onended = () => setPlayingId(null);
            setPlayingId(id);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile || !uploadName) return;

        if (uploadFile.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10MB limit");
            return;
        }

        setIsUploading(true);
        try {
            await uploadVoice(uploadFile, uploadName, uploadDesc, false);
            setActiveTab('list');
            setUploadName('');
            setUploadFile(null);
            setUploadDesc('');
        } catch (err) {
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const filteredVoices = voices.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white w-full flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors -ml-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <h3 className="text-xl font-bold text-gray-900">Voice Library</h3>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-2 bg-white shrink-0">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${activeTab === 'list' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        My Voices
                        {activeTab === 'list' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${activeTab === 'upload' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Upload New Voice
                        {activeTab === 'upload' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {activeTab === 'list' ? (
                    <div className="space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search voices..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>

                        {isLoading && voices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3" />
                                <p className="text-sm">Loading voices...</p>
                            </div>
                        ) : filteredVoices.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No voices found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredVoices.map((voice, index) => (
                                    <div
                                        key={voice.voice_sample_id}
                                        ref={index === filteredVoices.length - 1 ? lastElementRef : null}
                                        className={`group bg-white p-4 rounded-2xl border transition-all hover:shadow-md ${selectedId === voice.voice_sample_id
                                            ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm'
                                            : 'border-gray-100 hover:border-blue-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePlay(voice.audio_url, voice.voice_sample_id);
                                                }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${playingId === voice.voice_sample_id
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                    }`}
                                            >
                                                {playingId === voice.voice_sample_id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                            </button>

                                            <div
                                                className="flex-1 min-w-0 cursor-pointer"
                                                onClick={() => onSelect(voice)}
                                            >
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className="text-sm font-bold text-gray-900 truncate">{voice.name}</h4>
                                                    {selectedId === voice.voice_sample_id && (
                                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Selected</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">{voice.description || 'No description provided'}</p>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Delete voice?')) deleteVoice(voice.voice_sample_id);
                                                }}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete voice"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {isFetchingMore && (
                                    <div className="flex justify-center py-4">
                                        <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Voice Name</label>
                                <input
                                    type="text"
                                    value={uploadName}
                                    onChange={(e) => setUploadName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Barack Obama"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Audio Sample</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {uploadFile ? uploadFile.name : 'Click to upload audio'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">WAV, MP3, M4A up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <textarea
                                    value={uploadDesc}
                                    onChange={(e) => setUploadDesc(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all"
                                    rows={3}
                                    placeholder="Describe the voice characteristics..."
                                />
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={isUploading || !uploadFile || !uploadName}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload Voice Sample
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
