import React, { useRef, useState } from 'react';
import { X, FileAudio, Plus, Mic, Music, Wand2 } from 'lucide-react';
import { TTSModal } from './tts/TTSModal';

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
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const [showTTS, setShowTTS] = useState(false);
  const [targetSlot, setTargetSlot] = useState<1 | 2>(1);

  const handleTTSComplete = (file: File) => {
    if (targetSlot === 1) {
      onSetFile1(file);
    } else {
      onSetFile2(file);
    }
  };

  const openTTS = (slot: 1 | 2) => {
    setTargetSlot(slot);
    setShowTTS(true);
  };

  const AudioItem = ({ file, onClear, label, isActive }: { file: File, onClear: () => void, label: string, isActive?: boolean }) => (
    <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${isActive
      ? 'bg-white border-blue-200 shadow-sm'
      : 'bg-white/50 border-gray-100 hover:border-blue-200'
      }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
        }`}>
        <FileAudio className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 truncate">{file.name}</p>
        <p className="text-[10px] text-gray-500 font-medium">{label}</p>
      </div>
      <button
        onClick={onClear}
        disabled={disabled}
        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const EmptySlot = ({ onClick, onTTSClick, label }: { onClick: () => void, onTTSClick: () => void, label: string }) => (
    <div className="w-full p-3 rounded-lg border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center gap-3 group relative">
      <button onClick={onClick} className="flex-1 flex items-center gap-3 text-left">
        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 flex items-center justify-center shrink-0 transition-colors">
          <Plus className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-xs font-medium text-gray-600 group-hover:text-blue-700">{label}</span>
          <span className="block text-[10px] text-gray-400">Upload or Generate</span>
        </div>
      </button>
      <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button
          onClick={onTTSClick}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
          title="Generate with AI"
        >
          <Wand2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  const OrderSelector = () => (
    <div className="pt-3 mt-auto border-t border-gray-200/50">
      <div className="flex items-center gap-1.5 mb-2">
        <Music className="w-3 h-3 text-gray-400" />
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flow</label>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { id: 'meanwhile', label: 'Together' },
          { id: 'left_right', label: 'L → R' },
          { id: 'right_left', label: 'R → L' }
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setAudioOrder(opt.id)}
            disabled={disabled}
            className={`px-1 py-1.5 text-[10px] font-semibold rounded-md border transition-all ${audioOrder === opt.id
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="h-full w-full border border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden flex flex-col relative">
        <input ref={inputRef1} type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && onSetFile1(e.target.files[0])} />
        <input ref={inputRef2} type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && onSetFile2(e.target.files[0])} />

        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
          {!file1 && !file2 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
              <div className="flex gap-2">
                <button
                  onClick={() => inputRef1.current?.click()}
                  disabled={disabled}
                  className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:scale-105 transition-all"
                  title="Upload Audio"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openTTS(1)}
                  disabled={disabled}
                  className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-200 hover:scale-105 transition-all"
                  title="Generate with AI"
                >
                  <Wand2 className="w-5 h-5" />
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">Add Audio Track</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Upload file or generate speech</p>
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
                />
              ) : (
                <EmptySlot
                  onClick={() => inputRef1.current?.click()}
                  onTTSClick={() => openTTS(1)}
                  label="Add Primary Audio"
                />
              )}

              {file2 ? (
                <AudioItem
                  file={file2}
                  onClear={onClear2}
                  label={file1 ? "Person 2 (Right)" : "Secondary Track"}
                  isActive={true}
                />
              ) : (
                <EmptySlot
                  onClick={() => inputRef2.current?.click()}
                  onTTSClick={() => openTTS(2)}
                  label="Add Second Person"
                />
              )}
            </>
          )}
        </div>

        {file1 && file2 && (
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <OrderSelector />
          </div>
        )}
      </div>

      {showTTS && (
        <TTSModal
          onClose={() => setShowTTS(false)}
          onComplete={handleTTSComplete}
        />
      )}
    </>
  );
};