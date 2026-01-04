import React, { useEffect } from 'react';
import { Loader2, Globe2, ChevronDown } from 'lucide-react';
import { useVoiceUpload } from '../../../hooks/tts/useVoiceUpload';
import { FileUploadZone } from '../shared/FileUploadZone';
import { VoiceSample } from '../../../types/domain/chatterbox';

interface VoiceUploadFormProps {
    userId: string;
    onCancel: () => void;
    onSuccess: (voice: VoiceSample) => void;
}

const SUPPORTED_LANGUAGES = {
    'en': 'English',
    'id': 'Indonesian',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'da': 'Danish',
    'nl': 'Dutch',
    'fi': 'Finnish',
    'fr': 'French',
    'de': 'German',
    'el': 'Greek',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'it': 'Italian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ms': 'Malay',
    'no': 'Norwegian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'es': 'Spanish',
    'sv': 'Swedish',
    'sw': 'Swahili',
    'tr': 'Turkish'
};

const ALLOWED_FORMATS = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/x-m4a', 'audio/m4a'];

export const VoiceUploadForm: React.FC<VoiceUploadFormProps> = ({
    userId,
    onCancel,
    onSuccess
}) => {
    const {
        audioFile,
        name,
        description,
        languageHint,
        isPublic,
        isUploading,
        error,
        setAudioFile,
        setName,
        setDescription,
        setLanguageHint,
        setIsPublic,
        handleUpload,
        validateForm
    } = useVoiceUpload();

    const [localError, setLocalError] = React.useState<string | null>(null);

    useEffect(() => {
        setLocalError(error);
    }, [error]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        const validationError = validateForm();
        if (validationError) {
            setLocalError(validationError);
            return;
        }

        try {
            const uploadedVoice = await handleUpload(userId);
            onSuccess(uploadedVoice);
        } catch (err: any) {
            setLocalError(err.message);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="px-10 py-6 border-b border-gray-100 bg-white shrink-0">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Upload Voice Sample</h3>
                    <p className="text-sm text-gray-500">Tambahkan voice sample baru ke library</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-10 py-8 space-y-6">
                {/* Error Alert */}
                {localError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-800 font-medium">{localError}</p>
                    </div>
                )}

                {/* Audio File Upload */}
                <FileUploadZone
                    file={audioFile}
                    onFileChange={setAudioFile}
                    acceptedFormats={ALLOWED_FORMATS}
                    maxSizeMB={10}
                    label="Audio File *"
                    disabled={isUploading}
                />

                {/* Name Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Nama Voice *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Suara Profesional Pria"
                        maxLength={100}
                        disabled={isUploading}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">
                        {name.length}/100 karakter
                    </p>
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Deskripsi (Opsional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Deskripsikan karakteristik voice ini..."
                        maxLength={500}
                        rows={4}
                        disabled={isUploading}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">
                        {description.length}/500 karakter
                    </p>
                </div>

                {/* Language Hint Dropdown */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Bahasa (Opsional)
                    </label>
                    <div className="relative">
                        <select
                            value={languageHint}
                            onChange={(e) => setLanguageHint(e.target.value)}
                            disabled={isUploading}
                            className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                        >
                            <option value="">Pilih bahasa...</option>
                            {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => (
                                <option key={code} value={code}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Is Public Toggle */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Globe2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Public Voice
                            </p>
                            <p className="text-xs text-gray-600">
                                Voice ini dapat digunakan oleh semua user
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        disabled={isUploading}
                        className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${isPublic ? 'bg-blue-600' : 'bg-gray-300'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <span
                            className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${isPublic ? 'translate-x-6' : 'translate-x-1'}
                            `}
                        />
                    </button>
                </div>
            </form>

            {/* Footer with Actions */}
            <div className="px-10 py-6 border-t border-gray-100 bg-gray-50 shrink-0">
                <div className="flex gap-3 items-center">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isUploading}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isUploading || !audioFile || !name.trim()}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Upload Voice'
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};
