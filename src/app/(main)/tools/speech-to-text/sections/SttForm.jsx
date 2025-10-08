'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileAudio, Sparkles, Mic, StopCircle } from 'lucide-react';

const languageOptions = [
  { id: 'id', name: 'Indonesian' },
  { id: 'en', name: 'English' },
  { id: 'ja', name: 'Japanese' },
  { id: 'zh', name: 'Chinese' },
  { id: 'ko', name: 'Korean' },
];

export default function SttForm({ isLoading, onSubmit }) {
  const [formData, setFormData] = useState({
    title: 'My First STT Project',
    language: 'id',
    audio_file: null,
  });
  const [audioPreview, setAudioPreview] = useState(null);
  const [mode, setMode] = useState('upload'); // 'upload' or 'record'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleFocus = (e) => {
    if (e.target.value === 'My First STT Project') {
      setFormData((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file');
        return;
      }
      
      setFormData((prev) => ({ ...prev, audio_file: file }));
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, audio_file: null }));
    setAudioPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setFormData((prev) => ({ ...prev, audio_file: file }));
      setAudioPreview(URL.createObjectURL(file));
    }
  };
  
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
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
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Please ensure you have given microphone permissions.");
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setRecordingSeconds(0);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.audio_file) {
      alert('Please select or record an audio file');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('language', formData.language);
    submitData.append('audio_file', formData.audio_file);
    
    onSubmit(submitData);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
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
          onFocus={handleTitleFocus}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
          required
        />
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
          Audio Language
        </label>
        <select 
          name="language" 
          id="language" 
          value={formData.language} 
          onChange={handleInputChange} 
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium cursor-pointer"
        >
          {languageOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Audio File
        </label>
        
        {!formData.audio_file ? (
          <div className="border border-gray-200 rounded-lg p-1 bg-gray-100">
            <div className="flex mb-1">
              <button type="button" onClick={() => setMode('upload')} className={`flex-1 p-2 text-sm font-semibold rounded-md ${mode === 'upload' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>Upload File</button>
              <button type="button" onClick={() => setMode('record')} className={`flex-1 p-2 text-sm font-semibold rounded-md ${mode === 'record' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>Record Audio</button>
            </div>
            
            {/* Upload Area */}
            {mode === 'upload' && (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Upload size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">MP3, WAV, M4A, OGG (Max 50MB)</p>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileChange} className="hidden"/>
              </div>
            )}
            
            {/* Record Area */}
            {mode === 'record' && (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all flex flex-col items-center justify-center min-h-[190px]">
                {isRecording ? (
                  <>
                    <div className="mb-4 text-2xl font-mono text-red-500">{formatTime(recordingSeconds)}</div>
                    <button type="button" onClick={handleStopRecording} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all">
                      <StopCircle size={20} />
                      Stop Recording
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      onClick={handleStartRecording} 
                      className="p-4 rounded-full transition-all hover:bg-gray-200"
                      aria-label="Start Recording"
                    >
                      <Mic size={40} className="text-gray-500" />
                    </button>
                    <p className="mt-2 text-sm text-gray-500">Click the icon to start recording</p>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded">
                  <FileAudio size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{formData.audio_file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(formData.audio_file.size)}</p>
                </div>
              </div>
              <button type="button" onClick={handleRemoveFile} className="p-1 hover:bg-red-100 rounded transition-colors">
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
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading || !formData.audio_file}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
    </form>
  );
}