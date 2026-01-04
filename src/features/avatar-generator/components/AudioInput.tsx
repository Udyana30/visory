import React from 'react';
import { Mic, Circle, Wand2 } from 'lucide-react';
import { TTSModal } from './AvatarTTS/TTSModal';
import { useAudioInput } from '../hooks/useAudioInput';
import { AudioItem } from './AudioInput/AudioItem';
import { EmptyAudioSlot } from './AudioInput/EmptyAudioSlot';
import { AudioOrderSelector } from './AudioInput/AudioOrderSelector';
import { ActionButton } from './shared/ActionButton';

interface AudioInputProps {
  file1: File | null;
  file2: File | null;
  onSetFile1: (file: File) => void;
  onSetFile2: (file: File) => void;
  onClear1: () => void;
  onClear2: () => void;
  audioOrder: string;
  setAudioOrder: (order: string) => void;
  disabled?: boolean;
}

export const AudioInput: React.FC<AudioInputProps> = ({
  file1,
  file2,
  onSetFile1,
  onSetFile2,
  onClear1,
  onClear2,
  audioOrder,
  setAudioOrder,
  disabled
}) => {
  const {
    inputRef1,
    inputRef2,
    showTTS,
    recordingSlot,
    dragOver,
    hoveredButton,
    recorder,
    handleTTSComplete,
    openTTS,
    closeTTS,
    handleStartRecording,
    handleStopRecording,
    handleCancelRecording,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleUploadClick,
    setHovered,
    getContainerBackgroundClass
  } = useAudioInput({ file1, file2, onSetFile1, onSetFile2, disabled });

  const getTitleColor = () => {
    if (hoveredButton === 'upload') return 'text-blue-700';
    if (hoveredButton === 'record') return 'text-red-700';
    if (hoveredButton === 'generate') return 'text-purple-700';
    return 'text-gray-700';
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-full w-full border rounded-xl overflow-hidden flex flex-col relative transition-all duration-300 ${getContainerBackgroundClass()}`}
      >
        <input
          ref={inputRef1}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onSetFile1(e.target.files[0])}
        />
        <input
          ref={inputRef2}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onSetFile2(e.target.files[0])}
        />

        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
          {!file1 && !file2 && !recordingSlot ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-2">
              <div>
                <p className={`text-sm font-semibold transition-colors duration-300 ${getTitleColor()}`}>
                  Add Audio Track
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dragOver ? 'Drop audio file here' : 'Drag & drop or choose option'}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                <ActionButton
                  icon={<Mic className="w-4 h-4" />}
                  label="Upload"
                  onClick={() => handleUploadClick(1)}
                  onMouseEnter={() => setHovered('upload')}
                  onMouseLeave={() => setHovered(null)}
                  disabled={disabled}
                  variant="blue"
                />
                <ActionButton
                  icon={<Circle className="w-4 h-4" />}
                  label="Record"
                  onClick={() => handleStartRecording(1)}
                  onMouseEnter={() => setHovered('record')}
                  onMouseLeave={() => setHovered(null)}
                  disabled={disabled}
                  variant="red"
                />
                <ActionButton
                  icon={<Wand2 className="w-4 h-4" />}
                  label="Generate"
                  onClick={() => openTTS(1)}
                  onMouseEnter={() => setHovered('generate')}
                  onMouseLeave={() => setHovered(null)}
                  disabled={disabled}
                  variant="purple"
                />
              </div>
            </div>
          ) : (
            <>
              {file1 ? (
                <AudioItem
                  file={file1}
                  onClear={onClear1}
                  label={file2 ? "Person 1 (Left)" : "Primary Track"}
                  isActive={true}
                  disabled={disabled}
                />
              ) : (
                <EmptyAudioSlot
                  onUpload={() => handleUploadClick(1)}
                  onRecord={() => handleStartRecording(1)}
                  onTTS={() => openTTS(1)}
                  onHover={setHovered}
                  label="Add Primary Audio"
                  slot={1}
                  isRecording={recordingSlot === 1}
                  recordingTime={recorder.recordingTime}
                  onStopRecording={handleStopRecording}
                  onCancelRecording={handleCancelRecording}
                  disabled={disabled}
                />
              )}

              {file2 ? (
                <AudioItem
                  file={file2}
                  onClear={onClear2}
                  label={file1 ? "Person 2 (Right)" : "Secondary Track"}
                  isActive={true}
                  disabled={disabled}
                />
              ) : (
                <EmptyAudioSlot
                  onUpload={() => handleUploadClick(2)}
                  onRecord={() => handleStartRecording(2)}
                  onTTS={() => openTTS(2)}
                  onHover={setHovered}
                  label="Add Second Person"
                  slot={2}
                  isRecording={recordingSlot === 2}
                  recordingTime={recorder.recordingTime}
                  onStopRecording={handleStopRecording}
                  onCancelRecording={handleCancelRecording}
                  disabled={disabled}
                />
              )}
            </>
          )}
        </div>

        {file1 && file2 && (
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <AudioOrderSelector
              audioOrder={audioOrder}
              setAudioOrder={setAudioOrder}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {showTTS && (
        <TTSModal
          onClose={closeTTS}
          onComplete={handleTTSComplete}
        />
      )}
    </>
  );
};