# Prompt: Perencanaan BAB IV - Hasil dan Pembahasan (Frontend) - REVISI

## 🎯 KONTEKS PENELITIAN

**Judul**: RANCANG BANGUN APLIKASI WEB GENERATOR UNTUK AVATAR DAN KOMIK DIGITAL BERBASIS GENERATIVE AI

**Fokus**: Pengembangan **Frontend** (Antarmuka Pengguna)

**Rumusan Masalah** (dari BAB I):
1. Bagaimana merancang aplikasi web yang terstruktur dan modular untuk memfasilitasi pembuatan avatar dan komik digital berbasis _Generative AI_?
2. Bagaimana mengimplementasikan antarmuka pengguna yang mendukung alur kerja bertahap serta manipulasi visual pada editor komik maupun pengaturan parameter pada pembuatan avatar?
3. Bagaimana performa dan fungsionalitas aplikasi web yang dihasilkan dalam memfasilitasi interaksi pengguna dengan layanan _Generative AI_ untuk pembuatan konten digital?

---

## 📋 STRUKTUR BAB IV (REVISI)

```
BAB IV - HASIL DAN PEMBAHASAN

4.1 Perancangan Arsitektur Aplikasi Web Generator
    (Menjawab Rumusan Masalah 1)
    4.1.1 Arsitektur Feature-Based Modular
    4.1.2 Manajemen State dan Data Flow
    4.1.3 Integrasi dengan Backend API
    
4.2 Implementasi Antarmuka dan Logika Interaksi Pengguna
    (Menjawab Rumusan Masalah 2)
    4.2.1 Implementasi Fitur Avatar Generator
    4.2.2 Implementasi Fitur Comic Generator
    4.2.3 Implementasi Komponen Interaktif
    
4.3 Pengujian dan Analisis Kinerja Sistem
    (Menjawab Rumusan Masalah 3)
    4.3.1 Hasil Pengujian Fungsional
    4.3.2 Hasil Pengujian Performa dan Responsivitas
    4.3.3 Analisis Kelebihan dan Keterbatasan Sistem
```

---

## 📝 PROMPT LENGKAP UNTUK GEMINI

```
KONTEKS:
Judul: RANCANG BANGUN APLIKASI WEB GENERATOR UNTUK AVATAR DAN KOMIK DIGITAL BERBASIS GENERATIVE AI
Bab: BAB IV - HASIL DAN PEMBAHASAN
Fokus: Pengembangan Frontend (Antarmuka Pengguna)

REFERENSI FORMAT:
Gunakan format penulisan yang sama dengan contoh BAB IV dari team backend yang telah diberikan, dengan adaptasi untuk konteks frontend.

TUGAS:
Buatkan perencanaan lengkap untuk BAB IV yang menjawab 3 rumusan masalah penelitian dengan struktur yang detail, profesional, dan akademik.

---

## 4.1 PERANCANGAN ARSITEKTUR APLIKASI WEB GENERATOR

**TUJUAN**: Menjawab Rumusan Masalah 1 - "Bagaimana merancang aplikasi web yang terstruktur dan modular?"

Bagian ini memaparkan hasil perancangan arsitektur aplikasi web yang telah diimplementasikan. Fokus utama adalah pembuktian bahwa desain sistem telah berhasil diterjemahkan menjadi struktur kode yang modular, terorganisir, dan mudah di-maintain.

---

### 4.1.1 Arsitektur Feature-Based Modular

**KONTEN YANG HARUS ADA**:

**A. Prinsip Feature-Based Architecture**

Paragraf pembuka yang menjelaskan:
- Penggunaan pendekatan feature-based architecture untuk modularitas
- Pemisahan fitur berdasarkan domain (avatar-generator, comic-generator)
- Keuntungan: maintainability, scalability, reusability

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.1**: Screenshot struktur folder project di VS Code
  - Caption: "Struktur Folder Feature-Based Architecture Aplikasi Web Generator"
  - Tunjukkan: `src/features/avatar-generator/` dan `src/features/comic-generator/`

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.1**: Struktur Folder Feature Module
```
src/
├── app/                    # Next.js App Router (routing)
├── components/             # Shared components
├── features/               # Feature modules
│   ├── avatar-generator/   # Avatar Generator feature
│   │   ├── components/     # 46 files - Feature-specific components
│   │   ├── sections/       # 2 files - Main sections
│   │   ├── hooks/          # 20 files - Custom hooks
│   │   ├── services/       # 6 files - API services
│   │   ├── types/          # 9 files - TypeScript types
│   │   ├── utils/          # 7 files - Utility functions
│   │   └── AvatarGenerator.tsx  # Main component
│   └── comic-generator/    # Comic Generator feature
│       ├── components/     # 56 files - Feature-specific components
│       ├── sections/       # 5 files - Main sections (5-step workflow)
│       ├── hooks/          # 15 files - Custom hooks
│       ├── services/       # 6 files - API services
│       ├── types/          # 10 files - TypeScript types
│       ├── utils/          # 7 files - Utility functions
│       └── ComicGenerator.tsx   # Main component
├── services/               # Shared services (auth, etc)
├── hooks/                  # Shared hooks
├── types/                  # Shared types
└── lib/                    # Third-party library configs
```

Kode Program 4.1 menunjukkan struktur folder yang mengimplementasikan prinsip _separation of concerns_ dan modularitas. Setiap feature module memiliki struktur internal yang konsisten, memudahkan developer untuk navigasi dan maintenance kode.

**B. Konsistensi Struktur Internal Feature**

Paragraf yang menjelaskan:
- Setiap feature module memiliki struktur yang sama (components, sections, hooks, services, types, utils)
- Peran setiap folder dalam feature module
- Contoh konkret dari avatar-generator dan comic-generator

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.1**: Peran Setiap Folder dalam Feature Module

| Folder | Peran | Contoh File |
|--------|-------|-------------|
| `components/` | Komponen UI spesifik feature | `AvatarUploader.tsx`, `ParameterSettings.tsx` |
| `sections/` | Section utama yang menggabungkan komponen | `CreateAvatarSection.tsx`, `HistorySection.tsx` |
| `hooks/` | Custom hooks untuk logic reusable | `usePaginatedProjects.ts`, `useAvatarGeneration.ts` |
| `services/` | Layer komunikasi dengan backend API | `avatarProjectService.ts`, `uploadService.ts` |
| `types/` | TypeScript type definitions | `project.ts`, `avatar.ts` |
| `utils/` | Utility functions dan helpers | `formatters.ts`, `validators.ts` |

**C. Shared Components dan Utilities**

Paragraf yang menjelaskan:
- Komponen yang digunakan bersama antar features (di `src/components/`)
- Shared services (authentication, error handling)
- Shared hooks dan utilities

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.2**: Contoh Shared Component
```typescript
// src/components/ui/Button.tsx
export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children,
  ...props 
}) => {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all',
        variants[variant],
        sizes[size]
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

### 4.1.2 Manajemen State dan Data Flow

**KONTEN YANG HARUS ADA**:

**A. Global State Management (React Context API)**

Paragraf yang menjelaskan:
- Penggunaan React Context API untuk global state
- Context yang digunakan: TTSContext, ComicContext
- Keuntungan: menghindari prop drilling, centralized state

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.2**: Diagram Data Flow Architecture
  - Caption: "Arsitektur Data Flow dengan React Context API"
  - Tunjukkan: Component → Context → API Service → Backend

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.3**: Implementasi Context API
```typescript
// src/features/avatar-generator/context/TTSContext.tsx
interface TTSContextType {
  state: TTSState;
  dispatch: React.Dispatch<TTSAction>;
  generateTTS: (params: TTSParams) => Promise<void>;
  getVoices: () => Promise<Voice[]>;
}

export const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ttsReducer, initialState);
  
  const generateTTS = async (params: TTSParams) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await ttsService.generate(params);
      dispatch({ type: 'SET_RESULT', payload: result });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };
  
  return (
    <TTSContext.Provider value={{ state, dispatch, generateTTS, getVoices }}>
      {children}
    </TTSContext.Provider>
  );
};
```

Kode Program 4.3 menunjukkan implementasi Context API yang mengelola state global untuk fitur TTS. Pattern ini memungkinkan komponen-komponen dalam tree untuk mengakses dan memodifikasi state tanpa perlu prop drilling.

**B. Local State Management**

Paragraf yang menjelaskan:
- Penggunaan useState untuk state lokal komponen
- Penggunaan useReducer untuk state yang kompleks
- Kapan menggunakan local vs global state

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.4**: Contoh Local State dengan useReducer
```typescript
// src/features/comic-generator/hooks/useComicEditor.ts
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'ADD_PANEL':
      return { ...state, panels: [...state.panels, action.payload] };
    case 'UPDATE_PANEL':
      return {
        ...state,
        panels: state.panels.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PANEL':
      return {
        ...state,
        panels: state.panels.filter(p => p.id !== action.payload),
      };
    default:
      return state;
  }
};

export const useComicEditor = () => {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  // ... logic
  return { state, dispatch, addPanel, updatePanel, deletePanel };
};
```

**C. Server State Management**

Paragraf yang menjelaskan:
- Pengelolaan data dari server (API responses)
- Custom hooks untuk data fetching dan caching
- Polling mechanism untuk status updates

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.5**: Custom Hook untuk Server State
```typescript
// src/features/avatar-generator/hooks/usePaginatedProjects.ts
export const usePaginatedProjects = (userId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const response = await avatarProjectService.getProjects(userId, cursor);
      setProjects(prev => [...prev, ...response.items]);
      setCursor(response.next_cursor);
      setHasMore(response.has_more);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return { projects, loadMore, hasMore, loading };
};
```

---

### 4.1.3 Integrasi dengan Backend API

**KONTEN YANG HARUS ADA**:

**A. Service Layer Pattern**

Paragraf yang menjelaskan:
- Pemisahan business logic dari UI components
- Service layer sebagai abstraksi komunikasi API
- Keuntungan: testability, reusability, maintainability

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.6**: Implementasi Service Layer
```typescript
// src/features/avatar-generator/services/avatarProjectService.ts
import { apiClient } from '@/lib/apiClient';

export const avatarProjectService = {
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post('/api/v1/projects', data);
    return response.data;
  },

  async getProjectStatus(projectId: string): Promise<ProjectStatus> {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/status`);
    return response.data;
  },

  async getProjects(userId: string, cursor?: string | null): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get('/api/v1/projects', {
      params: { user_id: userId, cursor },
    });
    return response.data;
  },

  async deleteProject(projectId: string): Promise<void> {
    await apiClient.delete(`/api/v1/projects/${projectId}`);
  },
};
```

Kode Program 4.6 menunjukkan service layer yang mengenkapsulasi seluruh komunikasi dengan backend API. Setiap method merepresentasikan satu operasi bisnis yang dapat dipanggil dari komponen atau hooks.

**B. Axios Configuration dan Interceptors**

Paragraf yang menjelaskan:
- Konfigurasi Axios sebagai HTTP client
- Request interceptors untuk menambahkan headers (API Key, Auth Token)
- Response interceptors untuk error handling

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.7**: Konfigurasi Axios Client
```typescript
// src/lib/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

**C. Polling Mechanism untuk Async Operations**

Paragraf yang menjelaskan:
- Implementasi polling untuk memantau status generation
- Interval polling (2-3 detik)
- Auto-stop ketika status completed atau failed

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.8**: Custom Hook untuk Polling
```typescript
// src/features/avatar-generator/hooks/useProjectPolling.ts
export const useProjectPolling = (projectId: string | null) => {
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        const data = await avatarProjectService.getProjectStatus(projectId);
        setStatus(data);

        if (data.status === 'completed' || data.status === 'failed') {
          setIsPolling(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setIsPolling(false);
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [projectId]);

  return { status, isPolling };
};
```

---

## 4.2 IMPLEMENTASI ANTARMUKA DAN LOGIKA INTERAKSI PENGGUNA

**TUJUAN**: Menjawab Rumusan Masalah 2 - "Bagaimana mengimplementasikan antarmuka pengguna yang mendukung alur kerja bertahap dan manipulasi visual?"

Bagian ini memaparkan hasil implementasi antarmuka pengguna untuk kedua fitur utama (Avatar Generator dan Comic Generator), dengan fokus pada interaktivitas dan user experience.

---

### 4.2.1 Implementasi Fitur Avatar Generator

**KONTEN YANG HARUS ADA**:

**A. Form Input Dinamis**

Paragraf yang menjelaskan:
- Tiga metode input gambar: drag & drop, file picker, library template
- Tiga metode input audio: upload file, record, TTS modal
- Parameter controls: quality slider, gender select, age input

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.3**: Screenshot CreateAvatarSection
  - Caption: "Antarmuka Form Input Avatar Generator dengan Drag & Drop"
  - Tunjukkan: Upload area, parameter controls

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.9**: Implementasi Drag & Drop Upload
```typescript
// src/features/avatar-generator/components/AvatarUploader.tsx
export const AvatarUploader: React.FC = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resource_type', 'image');
      
      const result = await uploadService.uploadFile(formData);
      setImageUrl(result.url);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag & drop an image, or click to select</p>
      )}
    </div>
  );
};
```

**B. Preview dan History Management**

Paragraf yang menjelaskan:
- Video preview component dengan controls
- History section dengan pagination
- Filter dan search functionality
- Modal preview untuk detail view

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.4**: Screenshot HistorySection
  - Caption: "Antarmuka History Section dengan Fitur Filter, Search, dan Pagination"
  - Tunjukkan: Grid layout, filter dropdown, search bar

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.10**: Implementasi History dengan Pagination
```typescript
// src/features/avatar-generator/sections/HistorySection.tsx
export const HistorySection: React.FC = () => {
  const { projects, loadMore, hasMore, loading } = usePaginatedProjects(userId);
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <FilterDropdown value={filter} onChange={setFilter} />
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {hasMore && (
        <Button onClick={loadMore} loading={loading}>
          Load More
        </Button>
      )}
    </div>
  );
};
```

---

### 4.2.2 Implementasi Fitur Comic Generator

**KONTEN YANG HARUS ADA**:

**A. Alur Kerja Bertahap (5-Step Workflow)**

Paragraf yang menjelaskan:
- Implementasi timeline/stepper component
- 5 sections: ComicOverview, ReferencesSetup, SceneVisualization, ComicEditor, ComicReview
- Navigation logic (back, next, jump to step)
- State persistence antar steps

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.5**: Screenshot Timeline/Stepper Component
  - Caption: "Antarmuka Timeline 5-Step Workflow Comic Generator"
  - Tunjukkan: 5 steps dengan indicator active step

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.11**: Implementasi Main Comic Generator
```typescript
// src/features/comic-generator/ComicGenerator.tsx
export const ComicGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { projectData, updateProjectData } = useComicProject();

  const steps = [
    { id: 0, name: 'Project Setup', component: <ComicOverview /> },
    { id: 1, name: 'Character References', component: <ReferencesSetup /> },
    { id: 2, name: 'Scene Generation', component: <SceneVisualization /> },
    { id: 3, name: 'Canvas Editor', component: <ComicEditor /> },
    { id: 4, name: 'Preview & Export', component: <ComicReview /> },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleJumpTo = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen p-8">
      <Timeline 
        currentStep={currentStep} 
        steps={steps} 
        onStepClick={handleJumpTo}
      />
      
      <div className="mt-8">
        {steps[currentStep].component}
      </div>
      
      <div className="flex justify-between mt-8">
        <Button onClick={handleBack} disabled={currentStep === 0}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};
```

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.6**: Screenshot ComicOverview (Step 1)
  - Caption: "Antarmuka Project Setup dengan Visual Selectors"
- **Gambar 4.7**: Screenshot ReferencesSetup (Step 2)
  - Caption: "Antarmuka Character Reference Management dengan Gallery View"
- **Gambar 4.8**: Screenshot SceneVisualization (Step 3)
  - Caption: "Antarmuka Scene Generation dengan Dual View Mode dan Filmstrip"

**B. Canvas Editor dengan Manipulasi Visual**

Paragraf yang menjelaskan:
- Drag & drop functionality (React DnD)
- Resize dan reposition panels (React RnD)
- Dialog bubble editor
- Auto-save mechanism

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.9**: Screenshot ComicEditor dengan Drag & Drop
  - Caption: "Antarmuka Canvas Editor dengan Fitur Drag & Drop dan Resize"
  - Tunjukkan: Panels yang bisa di-drag, resize handles

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.12**: Implementasi Drag & Drop Panel
```typescript
// src/features/comic-generator/components/DraggablePanel.tsx
export const DraggablePanel: React.FC<PanelProps> = ({ panel, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'PANEL',
    item: { id: panel.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'PANEL',
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.index !== index) {
        onReorder(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={cn(
        'relative border-2 rounded-lg',
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
    >
      <img src={panel.imageUrl} alt={`Panel ${index + 1}`} />
    </div>
  );
};
```

- **Kode Program 4.13**: Implementasi Resize Panel
```typescript
// src/features/comic-generator/components/ResizablePanel.tsx
export const ResizablePanel: React.FC<PanelProps> = ({ panel, onResize }) => {
  return (
    <Rnd
      size={{ width: panel.width, height: panel.height }}
      position={{ x: panel.x, y: panel.y }}
      onDragStop={(e, d) => {
        onResize(panel.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onResize(panel.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...position,
        });
      }}
      bounds="parent"
    >
      <div className="w-full h-full border-2 border-blue-500">
        <img src={panel.imageUrl} className="w-full h-full object-cover" />
      </div>
    </Rnd>
  );
};
```

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.10**: Screenshot Dialog Bubble Editor
  - Caption: "Antarmuka Dialog Bubble Editor dengan Rich Text Formatting"

---

### 4.2.3 Implementasi Komponen Interaktif

**KONTEN YANG HARUS ADA**:

**A. Teknologi Interaktivitas**

Paragraf yang menjelaskan:
- React DnD untuk drag & drop
- React RnD untuk resize
- Framer Motion untuk animations
- Tailwind CSS untuk responsive design

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.2**: Teknologi Interaktivitas yang Digunakan

| Teknologi | Fungsi | Implementasi |
|-----------|--------|--------------|
| **React DnD** | Drag & drop panels di canvas editor | `useDrag`, `useDrop` hooks |
| **React RnD** | Resize dan reposition panels | `<Rnd>` component |
| **Framer Motion** | Page transitions, micro-animations | `<motion.div>`, `AnimatePresence` |
| **Tailwind CSS** | Responsive design, utility-first styling | Responsive classes (`md:`, `lg:`) |
| **React Dropzone** | File upload dengan drag & drop | `useDropzone` hook |

**B. Responsive Design Implementation**

Paragraf yang menjelaskan:
- Breakpoints yang digunakan (sm, md, lg, xl)
- Mobile-first approach (jika ada)
- Grid layout yang responsif

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.14**: Contoh Responsive Layout
```typescript
// src/features/comic-generator/sections/SceneVisualization.tsx
export const SceneVisualization: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="space-y-4">
        <PromptInput />
        <CharacterSelector />
        <PanelLayoutSelector />
        <GenerateButton />
      </div>
      
      {/* Right: Preview */}
      <div className="hidden lg:block">
        <ScenePreview />
      </div>
    </div>
  );
};
```

**C. Animations dan Transitions**

Paragraf yang menjelaskan:
- Page transitions dengan Framer Motion
- Micro-animations untuk feedback
- Loading states dan skeletons

**KODE PROGRAM YANG DIPERLUKAN**:
- **Kode Program 4.15**: Implementasi Page Transition
```typescript
// src/components/PageTransition.tsx
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
```

---

## 4.3 PENGUJIAN DAN ANALISIS KINERJA SISTEM

**TUJUAN**: Menjawab Rumusan Masalah 3 - "Bagaimana performa dan fungsionalitas aplikasi web yang dihasilkan?"

Bagian ini memaparkan hasil pengujian yang dilakukan berdasarkan metode yang telah dirancang pada Bab III, serta analisis kinerja sistem secara menyeluruh.

---

### 4.3.1 Hasil Pengujian Fungsional

**KONTEN YANG HARUS ADA**:

**A. Pengujian Avatar Generator**

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.3**: Hasil Pengujian Fungsional Avatar Generator

| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|----|--------------------|-----------------------|-----------------|------------|
| 1 | Upload gambar referensi (JPG/PNG) | File ter-upload, preview muncul | File berhasil di-upload, preview ditampilkan dengan benar | **Sesuai** |
| 2 | Upload file audio (MP3/WAV) | File ter-upload, waveform muncul | File berhasil di-upload, waveform ditampilkan | **Sesuai** |
| 3 | Validasi format file tidak valid (.exe) | Sistem menolak dengan pesan error | Error message muncul: "Invalid file format" | **Sesuai** |
| 4 | Validasi ukuran file melebihi batas (>10MB) | Sistem menolak dengan pesan error | Error message muncul: "File size exceeds limit" | **Sesuai** |
| 5 | Generate avatar dengan parameter valid | Video avatar ter-generate, status "completed" | Video berhasil di-generate, status update berjalan | **Sesuai** |
| 6 | Polling status generation | Status berubah dari "queued" → "processing" → "completed" | Status update berjalan dengan interval 2 detik | **Sesuai** |
| 7 | Filter history berdasarkan status | Hanya proyek dengan status tertentu yang ditampilkan | Filter berfungsi dengan akurat | **Sesuai** |
| 8 | Search history berdasarkan nama | Hasil search sesuai dengan keyword | Search berfungsi dengan benar (case-insensitive) | **Sesuai** |
| 9 | Pagination history (load more) | Data tambahan dimuat tanpa duplikasi | Pagination berfungsi, cursor-based working | **Sesuai** |
| 10 | Delete project dari history | Project terhapus dari daftar | Project berhasil dihapus, UI update otomatis | **Sesuai** |

**B. Pengujian Comic Generator**

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.4**: Hasil Pengujian Fungsional Comic Generator

| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|----|--------------------|-----------------------|-----------------|------------|
| 1 | Navigasi 5-step workflow (next/back) | Perpindahan step lancar, data tersimpan | Navigasi berfungsi, data tidak hilang | **Sesuai** |
| 2 | Jump to specific step dari timeline | Langsung ke step yang dipilih | Jump berfungsi dengan benar | **Sesuai** |
| 3 | Validasi form project setup | Form tidak bisa submit jika ada field kosong | Validasi berfungsi, error message muncul | **Sesuai** |
| 4 | Add character reference | Character tersimpan, muncul di gallery | Character berhasil ditambahkan | **Sesuai** |
| 5 | Edit character reference | Data character ter-update | Edit berfungsi, data tersimpan | **Sesuai** |
| 6 | Delete character reference | Character terhapus dari gallery | Delete berfungsi dengan konfirmasi | **Sesuai** |
| 7 | Import character from library | Character dari library ditambahkan | Import berfungsi dengan benar | **Sesuai** |
| 8 | Generate scene dengan prompt | Scene image ter-generate | Scene berhasil di-generate | **Sesuai** |
| 9 | Switch view mode (generate/grid) | View berubah sesuai mode | Mode switching berfungsi smooth | **Sesuai** |
| 10 | Drag & drop panel di canvas | Panel berpindah posisi | Drag & drop berfungsi smooth, 60 FPS | **Sesuai** |
| 11 | Resize panel di canvas | Ukuran panel berubah | Resize berfungsi, aspect ratio maintained | **Sesuai** |
| 12 | Add/edit dialog bubble | Dialog tersimpan di panel | Dialog editor berfungsi, rich text support | **Sesuai** |
| 13 | Auto-save mechanism | Data tersimpan otomatis setelah 3 detik idle | Auto-save berfungsi, visual indicator muncul | **Sesuai** |
| 14 | Preview generation (all pages) | Preview semua halaman ter-generate | Preview berfungsi, loading state clear | **Sesuai** |
| 15 | Export comic to PDF | File PDF ter-download | Export berhasil, PDF valid dan dapat dibuka | **Sesuai** |

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.11**: Screenshot hasil pengujian drag & drop (before & after)
  - Caption: "Hasil Pengujian Fitur Drag & Drop Panel (Before & After)"

---

### 4.3.2 Hasil Pengujian Performa dan Responsivitas

**KONTEN YANG HARUS ADA**:

**A. Client-Side Performance Metrics**

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.5**: Hasil Pengujian Performa Frontend

| Metrik | Target | Hasil Pengujian | Kesimpulan |
|--------|--------|-----------------|------------|
| **Page Load Time** (Initial) | < 3 detik | 2.5 detik | **Sesuai** |
| **Time to Interactive** (TTI) | < 4 detik | 3.2 detik | **Sesuai** |
| **First Contentful Paint** (FCP) | < 1.5 detik | 1.2 detik | **Sesuai** |
| **Largest Contentful Paint** (LCP) | < 2.5 detik | 2.1 detik | **Sesuai** |
| **Cumulative Layout Shift** (CLS) | < 0.1 | 0.05 | **Sesuai** |
| **Bundle Size** (gzipped) | < 500 KB | 450 KB | **Sesuai** |
| **Rendering FPS** | 60 FPS | 58-60 FPS | **Sesuai** |

**GAMBAR YANG DIPERLUKAN**:
- **Gambar 4.12**: Screenshot Lighthouse Performance Report
  - Caption: "Hasil Pengujian Performa dengan Google Lighthouse"
  - Tunjukkan: Performance score (90+), metrics (FCP, LCP, TTI, CLS)

**B. API Integration Performance**

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.6**: Hasil Pengujian Performa API Integration

| Endpoint | Metrik | Target | Hasil | Kesimpulan |
|----------|--------|--------|-------|------------|
| **Upload File** | Response Time | < 1 detik | 800 ms | **Sesuai** |
| **Create Project** | Response Time | < 500 ms | 350 ms | **Sesuai** |
| **Get Project Status** | Response Time | < 300 ms | 200 ms | **Sesuai** |
| **List Projects** | Response Time | < 500 ms | 400 ms | **Sesuai** |
| **Polling Interval** | Interval | 2-3 detik | 2 detik | **Sesuai** |
| **Polling Auto-stop** | Behavior | Stop on completed/failed | Berfungsi dengan benar | **Sesuai** |

**C. User Interaction Performance**

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.7**: Hasil Pengujian Interaksi Pengguna

| Fitur Interaksi | Metrik | Hasil Pengujian | Kesimpulan |
|-----------------|--------|-----------------|------------|
| **Drag & Drop** | FPS | 58-60 FPS | **Optimal** |
| **Resize Panel** | FPS | 58-60 FPS | **Optimal** |
| **Form Validation** | Response Time | Real-time (< 100ms) | **Optimal** |
| **State Update** | Consistency | No data loss | **Optimal** |
| **Auto-save** | Trigger Time | 3 seconds idle | **Optimal** |
| **Image Preview** | Load Time | < 500ms | **Optimal** |
| **Modal Transitions** | Animation | Smooth (60 FPS) | **Optimal** |

---

### 4.3.3 Analisis Kelebihan dan Keterbatasan Sistem

**KONTEN YANG HARUS ADA**:

**A. Kelebihan Sistem**

Paragraf yang menjelaskan kelebihan sistem yang telah dibangun:

1. **Modular Architecture**: Struktur feature-based memudahkan maintenance dan scalability. Setiap feature module dapat dikembangkan secara independen tanpa mempengaruhi module lain.

2. **Responsive Design**: Antarmuka bekerja optimal di berbagai ukuran layar desktop (1280px - 1920px), dengan layout yang adaptif menggunakan Tailwind CSS.

3. **Interactive UI**: Implementasi drag & drop, resize, dan animations memberikan pengalaman pengguna yang smooth dan intuitif, dengan performa rendering yang konsisten di 60 FPS.

4. **Efficient API Integration**: Service layer pattern dan polling mechanism memastikan komunikasi dengan backend berjalan efisien, dengan error handling yang robust.

5. **Type Safety**: Penggunaan TypeScript mencegah runtime errors dan meningkatkan developer experience dengan autocomplete dan type checking.

6. **State Management**: React Context API dan custom hooks memberikan state management yang konsisten tanpa data loss selama navigasi antar halaman.

**B. Keterbatasan Sistem**

Paragraf yang menjelaskan keterbatasan sistem:

1. **Desktop-Only Optimization**: Aplikasi belum dioptimasi untuk perangkat mobile (< 768px), sehingga pengalaman pengguna di smartphone kurang optimal.

2. **No Real-time Collaboration**: Sistem belum mendukung fitur kolaborasi multi-user secara real-time, sehingga hanya satu pengguna yang dapat mengedit project pada satu waktu.

3. **Limited Offline Functionality**: Aplikasi membutuhkan koneksi internet yang stabil untuk seluruh operasi, tidak ada fitur offline mode atau caching untuk data yang sudah di-fetch.

4. **Long Generation Time**: Proses generasi video avatar memakan waktu 15-20 menit (keterbatasan backend), yang dapat mengurangi kepuasan pengguna meskipun sudah ada feedback progress.

5. **Browser Compatibility**: Aplikasi dioptimasi untuk Chrome dan Firefox, belum dilakukan pengujian menyeluruh di Safari dan Edge yang mungkin memiliki compatibility issues.

**TABEL YANG DIPERLUKAN**:
- **Tabel 4.8**: Ringkasan Kelebihan dan Keterbatasan Sistem

| Aspek | Kelebihan | Keterbatasan |
|-------|-----------|--------------|
| **Arsitektur** | Modular, scalable, maintainable dengan feature-based structure | - |
| **UI/UX** | Interactive, responsive (desktop), smooth animations | Belum optimasi mobile (< 768px) |
| **Performa** | Fast rendering (60 FPS), efficient polling, bundle size optimal | Generation time lama (backend limitation) |
| **State Management** | Consistent, no data loss, Context API well-structured | - |
| **Collaboration** | - | No real-time multi-user editing |
| **Offline** | - | Butuh koneksi internet stabil |
| **Browser** | Optimal di Chrome/Firefox | Belum test menyeluruh di Safari/Edge |
| **Type Safety** | TypeScript mencegah runtime errors | - |

---

## ✅ CHECKLIST KELENGKAPAN BAB IV

**Struktur**:
- [ ] 4.1 Perancangan Arsitektur (3 sub-bab)
- [ ] 4.2 Implementasi Antarmuka (3 sub-bab)
- [ ] 4.3 Pengujian dan Analisis (3 sub-bab)
- [ ] Total: 9 sub-bab

**Gambar** (Minimal 12 gambar):
- [ ] Gambar 4.1: Struktur folder project
- [ ] Gambar 4.2: Diagram data flow
- [ ] Gambar 4.3: CreateAvatarSection
- [ ] Gambar 4.4: HistorySection
- [ ] Gambar 4.5: Timeline/Stepper
- [ ] Gambar 4.6: ComicOverview
- [ ] Gambar 4.7: ReferencesSetup
- [ ] Gambar 4.8: SceneVisualization
- [ ] Gambar 4.9: ComicEditor drag & drop
- [ ] Gambar 4.10: Dialog Bubble Editor
- [ ] Gambar 4.11: Hasil pengujian drag & drop
- [ ] Gambar 4.12: Lighthouse Performance Report

**Kode Program** (Minimal 15 kode):
- [ ] Kode Program 4.1: Struktur folder
- [ ] Kode Program 4.2: Shared component
- [ ] Kode Program 4.3: Context API
- [ ] Kode Program 4.4: useReducer
- [ ] Kode Program 4.5: usePaginatedProjects
- [ ] Kode Program 4.6: Service layer
- [ ] Kode Program 4.7: Axios config
- [ ] Kode Program 4.8: Polling hook
- [ ] Kode Program 4.9: Drag & drop upload
- [ ] Kode Program 4.10: History pagination
- [ ] Kode Program 4.11: ComicGenerator main
- [ ] Kode Program 4.12: Draggable panel
- [ ] Kode Program 4.13: Resizable panel
- [ ] Kode Program 4.14: Responsive layout
- [ ] Kode Program 4.15: Page transition

**Tabel** (Minimal 8 tabel):
- [ ] Tabel 4.1: Peran folder dalam feature
- [ ] Tabel 4.2: Teknologi interaktivitas
- [ ] Tabel 4.3: Pengujian Avatar Generator (10 skenario)
- [ ] Tabel 4.4: Pengujian Comic Generator (15 skenario)
- [ ] Tabel 4.5: Performa Frontend (7 metrik)
- [ ] Tabel 4.6: Performa API Integration (6 metrik)
- [ ] Tabel 4.7: Interaksi Pengguna (7 fitur)
- [ ] Tabel 4.8: Kelebihan dan Keterbatasan

**Konten**:
- [ ] Menjawab 3 rumusan masalah
- [ ] Relevan dengan project frontend
- [ ] Fokus pada hasil implementasi
- [ ] Bukti implementasi (screenshot, kode, tabel)

---

## 💡 PANDUAN PENGGUNAAN

### **Cara Menggunakan Prompt Ini**:

1. **Copy seluruh prompt** di atas
2. **Paste ke Gemini** dengan attachment:
   - Draft laporan BAB III
   - Screenshot project (struktur folder, UI, dll)
3. **Generate per sub-bab** untuk hasil yang lebih fokus
4. **Review dan sesuaikan** dengan detail project aktual
5. **Tambahkan screenshot** yang diperlukan
6. **Tambahkan kode program** dari project aktual
7. **Lakukan pengujian nyata** untuk data metrics

---

## 🎯 KESIMPULAN

Prompt revisi ini dirancang untuk:
1. ✅ **Langsung menjawab 3 rumusan masalah** tanpa sub-bab lingkungan
2. ✅ **Format sesuai referensi backend** (gambar, kode, tabel)
3. ✅ **Relevan dengan project frontend** (React, Next.js, TypeScript)
4. ✅ **Fokus pada hasil** (perancangan, implementasi, pengujian)
5. ✅ **Formal akademik** dengan bahasa yang baik dan benar

Gunakan prompt ini untuk generate BAB IV yang **profesional, lengkap, dan relevan** dengan project frontend Anda!
```
