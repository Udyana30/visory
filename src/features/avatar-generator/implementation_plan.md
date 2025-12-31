# Refaktor Fitur TTS Avatar Generator (Best Practice)

Dokumen ini berisi rencana perbaikan untuk fitur TTS (Kokoro dan ChatterBox) dengan pemisahan yang benar antara presentational dan logic components, mengikuti best practice SRP dan SSOT.

---

## 📋 Prinsip Desain

### ✅ Best Practice yang Diterapkan

1. **Separation of Concerns**: Pisahkan UI (presentational) dan Logic (container)
2. **SRP**: Setiap file punya 1 tanggung jawab spesifik
3. **SSOT**: Tidak ada duplikasi state/logic
4. **Minimalis**: Tidak ada folder dengan 1 file, struktur flat
5. **Clarity**: Tidak pakai index.tsx, nama file jelas

---

## 🏗️ Struktur Folder Baru

```
src/features/avatar-generator/components/tts/
├── TTSModal.tsx                    # Main modal (routing & layout only)
├── TTSEngineSelector.tsx           # Engine selector UI (presentational)
│
├── kokoro/                         # Kokoro components
│   ├── KokoroGeneratorContainer.tsx   # Logic: generation, state management
│   ├── KokoroGeneratorForm.tsx        # UI: form inputs, voice selector
│   ├── KokoroHistoryContainer.tsx     # Logic: fetch, delete, pagination
│   ├── KokoroHistoryList.tsx          # UI: list display
│   ├── KokoroVoiceLibrary.tsx         # Voice library (sudah ada)
│   └── KokoroVoiceSelector.tsx        # Voice selector (sudah ada)
│
├── chatterbox/                     # ChatterBox components
│   ├── ChatterboxGeneratorContainer.tsx  # Logic: generation, mode switching
│   ├── ChatterboxGeneratorForm.tsx       # UI: form, mode selector, settings
│   ├── ChatterboxHistoryContainer.tsx    # Logic: fetch, delete, pagination
│   ├── ChatterboxHistoryList.tsx         # UI: list display
│   ├── ChatterboxModeSelector.tsx        # UI: mode tabs (presentational)
│   └── ChatterboxAdvancedSettings.tsx    # UI: settings inputs (presentational)
│
└── shared/                         # Shared components
    ├── AudioPlayer.tsx             # Audio player UI (presentational)
    ├── GenerationResult.tsx        # Result display (presentational)
    ├── HistoryItem.tsx             # History item UI (presentational)
    └── VoiceLibraryView.tsx        # Voice library view (sudah ada)

src/features/avatar-generator/hooks/tts/
├── useKokoro.ts                    # Kokoro business logic
├── useTTSGenerator.ts              # ChatterBox business logic
├── useAudioPlayer.ts               # Audio playback logic (NEW)
├── usePolling.ts                   # Generic polling (NEW)
└── useVoiceLibrary.ts              # Voice library logic

src/features/avatar-generator/context/
├── KokoroContext.tsx               # Kokoro global state
├── TTSContext.tsx                  # ChatterBox global state
└── VoiceLibraryContext.tsx         # Voice library global state

src/features/avatar-generator/services/
├── tts/
│   ├── kokoroService.ts            # Kokoro API service
│   └── chatterboxService.ts        # ChatterBox API service
├── localStorageService.ts          # Storage operations (NEW)

src/features/avatar-generator/utils/
├── audioUtils.ts                   # Audio utilities (NEW)
├── formatters.ts                   # Formatters (NEW)
└── constants.ts                    # Constants & enums (NEW)

src/features/avatar-generator/types/
├── domain/
│   ├── kokoro.ts
│   ├── chatterbox.ts
│   └── common.ts                   # Shared types & enums (NEW)
└── api/
    ├── request.ts
    └── response.ts
```

---

## 🎯 Pemisahan Presentational vs Container

### Pattern: Container/Presentational

#### **Container Components** (Logic)
- Menangani state management
- Memanggil hooks & services
- Handle business logic
- Pass data & callbacks ke presentational components

#### **Presentational Components** (UI)
- Hanya menerima props
- Render UI berdasarkan props
- Emit events via callbacks
- Tidak ada business logic

---

## 📦 Detail Komponen

### Kokoro Components

#### 1. `KokoroGeneratorContainer.tsx` (Container)
**Tanggung Jawab**:
- Manage generation state
- Call [useKokoro](file:///e:/TA/Website/visory/src/features/avatar-generator/hooks/useKokoro.ts#5-139) hook
- Handle generate, download, reset
- Pass data & callbacks ke Form

```typescript
export const KokoroGeneratorContainer = ({ onComplete, onClose }) => {
  const kokoro = useKokoro(userId);
  const { toggle } = useAudioPlayer();
  
  const handleGenerate = (text, voice, speed) => {
    kokoro.generateAudio(text, voice, speed);
  };
  
  const handleDownload = async () => {
    const file = await kokoro.downloadAudio(kokoro.lastGeneratedAudioUrl);
    onComplete(file);
    onClose();
  };
  
  return (
    <KokoroGeneratorForm
      voices={kokoro.voices}
      isLoading={kokoro.isVoicesLoading}
      isGenerating={kokoro.isGenerating}
      generatedAudio={kokoro.lastGeneratedAudioUrl}
      onGenerate={handleGenerate}
      onDownload={handleDownload}
      onReset={kokoro.resetGeneration}
      onPlayAudio={toggle}
    />
  );
};
```

#### 2. `KokoroGeneratorForm.tsx` (Presentational)
**Tanggung Jawab**:
- Render form inputs (text, voice, speed)
- Display generation result
- Emit events via callbacks

```typescript
interface Props {
  voices: KokoroVoice[];
  isLoading: boolean;
  isGenerating: boolean;
  generatedAudio: string | null;
  onGenerate: (text: string, voice: string, speed: number) => void;
  onDownload: () => void;
  onReset: () => void;
  onPlayAudio: (url: string) => void;
}

export const KokoroGeneratorForm = ({ voices, onGenerate, ... }: Props) => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('');
  const [speed, setSpeed] = useState(1.0);
  
  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <KokoroVoiceSelector voices={voices} selected={voice} onSelect={setVoice} />
      <input type="range" value={speed} onChange={e => setSpeed(+e.target.value)} />
      
      {generatedAudio && (
        <GenerationResult 
          audioUrl={generatedAudio}
          onUse={onDownload}
          onPlayAudio={onPlayAudio}
          onReset={onReset}
        />
      )}
      
      <button onClick={() => onGenerate(text, voice, speed)}>
        Generate
      </button>
    </div>
  );
};
```

#### 3. `KokoroHistoryContainer.tsx` (Container)
**Tanggung Jawab**:
- Fetch history from context
- Handle delete, play, use audio
- Pass data & callbacks ke List

```typescript
export const KokoroHistoryContainer = ({ onUseAudio }) => {
  const { projects, isHistoryLoading, deleteProject } = useKokoro();
  const { toggle, isPlaying, currentTrack } = useAudioPlayer();
  
  const handleUse = async (url: string) => {
    const file = await downloadAudio(url);
    onUseAudio(file);
  };
  
  return (
    <KokoroHistoryList
      projects={projects}
      isLoading={isHistoryLoading}
      isPlaying={isPlaying}
      currentTrack={currentTrack}
      onPlay={toggle}
      onDelete={deleteProject}
      onUse={handleUse}
    />
  );
};
```

#### 4. `KokoroHistoryList.tsx` (Presentational)
**Tanggung Jawab**:
- Render list of history items
- Display loading/empty states

```typescript
interface Props {
  projects: KokoroGenerateResponse[];
  isLoading: boolean;
  isPlaying: boolean;
  currentTrack: string | null;
  onPlay: (url: string) => void;
  onDelete: (id: string) => void;
  onUse: (url: string) => void;
}

export const KokoroHistoryList = ({ projects, onPlay, ... }: Props) => {
  if (isLoading) return <LoadingState />;
  if (projects.length === 0) return <EmptyState />;
  
  return (
    <div>
      {projects.map(project => (
        <HistoryItem
          key={project.tts_id}
          project={project}
          isPlaying={isPlaying && currentTrack === project.audio_url}
          onPlay={() => onPlay(project.audio_url)}
          onDelete={() => onDelete(project.tts_id)}
          onUse={() => onUse(project.audio_url)}
        />
      ))}
    </div>
  );
};
```

---

### ChatterBox Components

#### 5. `ChatterboxGeneratorContainer.tsx` (Container)
**Tanggung Jawab**:
- Manage generation state & mode
- Call [useTTSGenerator](file:///e:/TA/Website/visory/src/features/avatar-generator/hooks/useTTSGenerator.ts#9-163) hook
- Handle generate for all modes
- Pass data & callbacks ke Form

```typescript
export const ChatterboxGeneratorContainer = ({ onComplete, onClose }) => {
  const tts = useTTSGenerator(userId);
  const { toggle } = useAudioPlayer();
  const [mode, setMode] = useState<'cloning' | 'multilingual' | 'voice-changer'>('cloning');
  
  const handleGenerate = (formData) => {
    if (mode === 'cloning') {
      tts.generateCloning(formData);
    } else if (mode === 'multilingual') {
      tts.generateMultilingual(formData);
    } else {
      tts.convertVoice(formData);
    }
  };
  
  const handleDownload = async () => {
    const file = await downloadAudio(tts.project.audio_url);
    onComplete(file);
    onClose();
  };
  
  return (
    <ChatterboxGeneratorForm
      mode={mode}
      onModeChange={setMode}
      languages={tts.languages}
      isGenerating={tts.isGenerating}
      project={tts.project}
      error={tts.error}
      onGenerate={handleGenerate}
      onDownload={handleDownload}
      onReset={tts.reset}
      onPlayAudio={toggle}
    />
  );
};
```

#### 6. `ChatterboxGeneratorForm.tsx` (Presentational)
**Tanggung Jawab**:
- Render mode selector
- Render form inputs based on mode
- Display generation result
- Emit events via callbacks

```typescript
interface Props {
  mode: 'cloning' | 'multilingual' | 'voice-changer';
  onModeChange: (mode) => void;
  languages: SupportedLanguages;
  isGenerating: boolean;
  project: TTSProject | null;
  error: string | null;
  onGenerate: (formData: any) => void;
  onDownload: () => void;
  onReset: () => void;
  onPlayAudio: (url: string) => void;
}

export const ChatterboxGeneratorForm = ({ mode, onGenerate, ... }: Props) => {
  const [formData, setFormData] = useState({});
  
  return (
    <div>
      <ChatterboxModeSelector mode={mode} onChange={onModeChange} />
      
      {/* Form inputs based on mode */}
      {mode === 'cloning' && <CloningInputs data={formData} onChange={setFormData} />}
      {mode === 'multilingual' && <MultilingualInputs data={formData} onChange={setFormData} />}
      {mode === 'voice-changer' && <VoiceChangerInputs data={formData} onChange={setFormData} />}
      
      <ChatterboxAdvancedSettings data={formData} onChange={setFormData} mode={mode} />
      
      {error && <ErrorMessage message={error} />}
      
      {project?.status === 'completed' && (
        <GenerationResult 
          audioUrl={project.audio_url}
          onUse={onDownload}
          onPlayAudio={onPlayAudio}
          onReset={onReset}
        />
      )}
      
      <button onClick={() => onGenerate(formData)}>Generate</button>
    </div>
  );
};
```

#### 7. `ChatterboxHistoryContainer.tsx` (Container)
**Tanggung Jawab**:
- Fetch history from context
- Handle pagination, delete, play
- Pass data & callbacks ke List

```typescript
export const ChatterboxHistoryContainer = ({ onUseAudio }) => {
  const { projects, loadMore, hasMore, deleteProject } = useTTSGenerator();
  const { toggle, isPlaying, currentTrack } = useAudioPlayer();
  
  const handleUse = async (url: string) => {
    const file = await downloadAudio(url);
    onUseAudio(file);
  };
  
  return (
    <ChatterboxHistoryList
      projects={projects}
      hasMore={hasMore}
      isPlaying={isPlaying}
      currentTrack={currentTrack}
      onLoadMore={loadMore}
      onPlay={toggle}
      onDelete={deleteProject}
      onUse={handleUse}
    />
  );
};
```

#### 8. `ChatterboxHistoryList.tsx` (Presentational)
**Tanggung Jawab**:
- Render list of history items
- Display pagination
- Display loading/empty states

```typescript
interface Props {
  projects: TTSProject[];
  hasMore: boolean;
  isPlaying: boolean;
  currentTrack: string | null;
  onLoadMore: () => void;
  onPlay: (url: string) => void;
  onDelete: (id: string) => void;
  onUse: (url: string) => void;
}

export const ChatterboxHistoryList = ({ projects, hasMore, onLoadMore, ... }: Props) => {
  if (projects.length === 0) return <EmptyState />;
  
  return (
    <div>
      {projects.map(project => (
        <HistoryItem
          key={project.project_id}
          project={project}
          isPlaying={isPlaying && currentTrack === project.audio_url}
          onPlay={() => onPlay(project.audio_url)}
          onDelete={() => onDelete(project.project_id)}
          onUse={() => onUse(project.audio_url)}
        />
      ))}
      
      {hasMore && <button onClick={onLoadMore}>Load More</button>}
    </div>
  );
};
```

---

### Shared Components (Presentational)

#### 9. [HistoryItem.tsx](file:///e:/TA/Website/visory/src/features/avatar-generator/components/tts/history/HistoryItem.tsx)
**Tanggung Jawab**: Display single history item
```typescript
interface Props {
  project: TTSProject | KokoroGenerateResponse;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
  onUse: () => void;
}

export const HistoryItem = ({ project, isPlaying, onPlay, onDelete, onUse }: Props) => {
  return (
    <div onClick={onUse}>
      <div>{project.text}</div>
      <div>{formatDate(project.created_at)}</div>
      <AudioPlayer isPlaying={isPlaying} onToggle={onPlay} />
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};
```

#### 10. [GenerationResult.tsx](file:///e:/TA/Website/visory/src/features/avatar-generator/components/tts/generator/GenerationResult.tsx)
**Tanggung Jawab**: Display generation result with actions
```typescript
interface Props {
  audioUrl: string;
  onUse: () => void;
  onPlayAudio: (url: string) => void;
  onReset: () => void;
}

export const GenerationResult = ({ audioUrl, onUse, onPlayAudio, onReset }: Props) => {
  return (
    <div>
      <audio controls src={audioUrl} />
      <button onClick={onUse}>Use This Audio</button>
      <button onClick={onReset}>Generate Again</button>
    </div>
  );
};
```

#### 11. [AudioPlayer.tsx](file:///e:/TA/Website/visory/src/features/avatar-generator/components/tts/shared/AudioPlayer.tsx)
**Tanggung Jawab**: Audio play/pause button
```typescript
interface Props {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioPlayer = ({ isPlaying, onToggle }: Props) => {
  return (
    <button onClick={onToggle}>
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
};
```

---

## 🔧 Utilities & Services (Tetap Sama)

### `useAudioPlayer.ts`
```typescript
export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const toggle = (url: string) => {
    if (isPlaying && currentTrack === url) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentTrack(url);
    }
  };
  
  return { currentTrack, isPlaying, toggle };
};
```

### `usePolling.ts`
```typescript
export const usePolling = <T>(
  checkStatus: (id: string) => Promise<T>,
  isComplete: (data: T) => boolean,
  isFailed: (data: T) => boolean
) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startPolling = (id: string, onUpdate: (data: T) => void) => {
    const poll = async () => {
      const data = await checkStatus(id);
      onUpdate(data);
      
      if (isComplete(data) || isFailed(data)) {
        stopPolling();
      }
    };
    
    intervalRef.current = setInterval(poll, 1500);
    poll();
  };
  
  const stopPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  return { startPolling, stopPolling };
};
```

### `utils/constants.ts`
```typescript
export enum TTSEngine {
  KOKORO = 'kokoro',
  CHATTERBOX = 'chatterbox'
}

export enum ProjectStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export const PROJECT_TYPE_LABELS = {
  'tts': 'Voice Cloning',
  'multilingual_tts': 'Multilingual',
  'voice_conversion': 'Voice Changer',
};

export const CACHE_DURATIONS = {
  VOICES: 5 * 60 * 1000,
  HISTORY: 30 * 1000,
};
```

### `utils/audioUtils.ts`
```typescript
export const downloadAudio = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], `tts_${Date.now()}.wav`, { type: 'audio/wav' });
};
```

### `utils/formatters.ts`
```typescript
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

### `services/localStorageService.ts`
```typescript
export const localStorageService = {
  getTTSEngine: (): TTSEngine => {
    const stored = localStorage.getItem('tts_active_engine');
    return stored === 'kokoro' || stored === 'chatterbox' ? stored : 'kokoro';
  },
  
  setTTSEngine: (engine: TTSEngine): void => {
    localStorage.setItem('tts_active_engine', engine);
  },
};
```

---

## 📊 Perbandingan

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| **Separation of Concerns** | ❌ Mixed | ✅ Separated |
| **Container Components** | 0 | 4 (2 Kokoro + 2 ChatterBox) |
| **Presentational Components** | Mixed | 7 (pure UI) |
| **Reusability** | Low | High |
| **Testability** | Hard | Easy |
| **Maintainability** | Medium | High |

---

## ✅ Checklist Implementasi

### Phase 1: Infrastructure
- [ ] `utils/constants.ts`
- [ ] `utils/audioUtils.ts`
- [ ] `utils/formatters.ts`
- [x] `services/localStorageService.ts`
- [ ] `types/domain/common.ts`

### Phase 2: Hooks
- [x] `hooks/tts/useAudioPlayer.ts`
- [x] `hooks/tts/usePolling.ts`
- [x] Update [hooks/tts/useKokoro.ts](file:///e:/TA/Website/visory/src/features/avatar-generator/hooks/tts/useKokoro.ts)
- [x] Update [hooks/tts/useTTSGenerator.ts](file:///e:/TA/Website/visory/src/features/avatar-generator/hooks/tts/useTTSGenerator.ts)

### Phase 3: Shared Presentational Components
- [ ] `shared/HistoryItem.tsx`
- [ ] `shared/GenerationResult.tsx`
- [ ] Update [shared/AudioPlayer.tsx](file:///e:/TA/Website/visory/src/features/avatar-generator/components/tts/shared/AudioPlayer.tsx)

### Phase 4: Kokoro Components
- [ ] `kokoro/KokoroGeneratorContainer.tsx`
- [ ] `kokoro/KokoroGeneratorForm.tsx`
- [ ] `kokoro/KokoroHistoryContainer.tsx`
- [ ] `kokoro/KokoroHistoryList.tsx`

### Phase 5: ChatterBox Components
- [ ] `chatterbox/ChatterboxGeneratorContainer.tsx`
- [ ] `chatterbox/ChatterboxGeneratorForm.tsx`
- [ ] `chatterbox/ChatterboxHistoryContainer.tsx`
- [ ] `chatterbox/ChatterboxHistoryList.tsx`
- [ ] `chatterbox/ChatterboxModeSelector.tsx`
- [ ] `chatterbox/ChatterboxAdvancedSettings.tsx`

### Phase 6: Main Components
- [ ] Update [TTSModal.tsx](file:///e:/TA/Website/visory/src/features/avatar-generator/components/tts/TTSModal.tsx)
- [ ] Update `TTSEngineSelector.tsx`

### Phase 7: Context & Services
- [x] Update [TTSContext.tsx](file:///e:/TA/Website/visory/src/features/avatar-generator/context/TTSContext.tsx)
- [x] Update [VoiceLibraryContext.tsx](file:///e:/TA/Website/visory/src/features/avatar-generator/context/VoiceLibraryContext.tsx)
- [x] `services/tts/kokoroService.ts`
- [x] `services/tts/chatterboxService.ts`

---

## 🎯 Prinsip yang Diterapkan

### ✅ SRP (Single Responsibility Principle)
- **Container**: Handle logic & state
- **Presentational**: Handle UI & display
- **Hooks**: Handle specific business logic
- **Services**: Handle API calls
- **Utils**: Handle utilities

### ✅ SSOT (Single Source of Truth)
- Audio playback: `useAudioPlayer` hook
- Polling: `usePolling` hook
- Storage: `localStorageService`
- Constants: `constants.ts`
- Formatters: `formatters.ts`

### ✅ Best Practice
- Container/Presentational pattern
- Props drilling minimal (via hooks & context)
- Reusable components
- Easy to test
- Easy to maintain

---

## 💡 Keuntungan Struktur Ini

1. **Clear Separation**: UI dan logic terpisah jelas
2. **Reusable**: Presentational components bisa dipakai ulang
3. **Testable**: Container dan presentational mudah di-test terpisah
4. **Maintainable**: Mudah cari dan ubah kode
5. **Scalable**: Mudah tambah fitur baru
6. **Minimalis**: Tidak ada folder dengan 1 file
7. **Clarity**: Tidak pakai index.tsx

---

## 📌 Catatan

> [!IMPORTANT]
> Container components handle **WHAT** (logic, state, data fetching)
> Presentational components handle **HOW** (UI, display, user interaction)

> [!TIP]
> Jika component perlu data dari context/hook, buat Container.
> Jika component hanya render UI dari props, buat Presentational.

**Estimasi Waktu**: 2-3 hari development + 1 hari testing
