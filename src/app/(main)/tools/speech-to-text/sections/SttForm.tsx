import React, { useState, useRef } from 'react';
import { Upload, X, FileAudio, Sparkles, Mic, StopCircle } from 'lucide-react';
import { STTFormData } from '@/types/stt';
import { LANGUAGE_OPTIONS, INITIAL_FORM_DATA } from '../lib/stt.constants';
import { formatFileSize, validateAudioFile, formatPayload } from '../lib/stt.utils';

interface SttFormProps {
  isLoading: boolean;
  onSubmit: (payload: FormData) => void;
}

const SttForm: React.FC<SttFormProps> = ({ isLoading, onSubmit }) => {
  const [formData, setFormData] = useState<STTFormData>(INITIAL_FORM_DATA);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === INITIAL_FORM_DATA.title) {
      setFormData((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateAudioFile(file);
      if (!validation.valid) {
        setValidationError(validation.error || 'Invalid file');
        return;
      }

      setValidationError(null);
      setFormData((prev) => ({ ...prev, audio_file: file }));
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, audio_file: null }));
    setAudioPreview(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const validation = validateAudioFile(file);
      if (!validation.valid) {
        setValidationError(validation.error || 'Invalid file');
        return;
      }

      setValidationError(null);
      setFormData((prev) => ({ ...prev, audio_file: file }));
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setValidationError('Your browser does not support audio recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, {
          type: 'audio/wav',
        });

        setFormData((prev) => ({ ...prev, audio_file: audioFile }));
        setAudioPreview(audioUrl);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setValidationError('Could not start recording. Please ensure microphone permissions are granted.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingSeconds(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.audio_file) {
      setValidationError('Please select or record an audio file');
      return;
    }

    const payload = formatPayload(formData);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            onFocus={handleTitleFocus}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-semibold text-gray-900 mb-2">
            Audio Language
          </label>
          <select
            name="language"
            id="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-900 cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Audio File</label>

          {!formData.audio_file ? (
            <div className="border border-gray-200 rounded-lg p-1.5 bg-gray-50">
              <div className="flex mb-1.5 gap-1">
                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-md transition-all ${
                    mode === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setMode('record')}
                  className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-md transition-all ${
                    mode === 'record' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Record Audio
                </button>
              </div>

              {mode === 'upload' && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload size={28} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">MP3, WAV, M4A, OGG, FLAC (Max 50MB)</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {mode === 'record' && (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all flex flex-col items-center justify-center min-h-[165px]">
                  {isRecording ? (
                    <>
                      <div className="mb-3 text-2xl font-mono text-red-600 font-semibold">{formatTime(recordingSeconds)}</div>
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
                      >
                        <StopCircle size={18} />
                        Stop Recording
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="p-3 rounded-full transition-all hover:bg-gray-100"
                        aria-label="Start Recording"
                      >
                        <Mic size={36} className="text-gray-600" />
                      </button>
                      <p className="mt-2 text-sm text-gray-500">Click to start recording</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-gray-900 rounded flex-shrink-0">
                    <FileAudio size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {formData.audio_file.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(formData.audio_file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                >
                  <X size={20} className="text-red-600" />
                </button>
              </div>
              {audioPreview && (
                <audio controls className="w-full" src={audioPreview} style={{ outline: 'none' }}>
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}

          {validationError && (
            <p className="mt-2 text-sm text-red-600 font-medium">{validationError}</p>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-gray-200 flex-shrink-0">
      <button
        type="submit"
        disabled={isLoading || !formData.audio_file}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Transcribing...
          </>
        ) : (
          <>
            Generate Transcription
            <Sparkles size={20} />
          </>
        )}
      </button>
    </div>

    <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
    `}</style>
  </form>
  );
};

export default SttForm;