# BAB IV
# HASIL DAN PEMBAHASAN

Bab ini menguraikan hasil dari perancangan dan implementasi sistem yang telah dilakukan, serta pembahasan mengenai pencapaian terhadap rumusan masalah yang telah ditetapkan. Pembahasan mencakup arsitektur aplikasi web yang modular, implementasi antarmuka pengguna yang interaktif, serta hasil pengujian fungsionalitas dan kinerja sistem.

## 4.1 Perancangan Arsitektur Aplikasi Web Generator

Perancangan arsitektur merupakan fondasi utama dalam pengembangan aplikasi web modern yang kompleks. Bagian ini menjawab rumusan masalah pertama mengenai bagaimana merancang aplikasi web yang terstruktur dan modular untuk memfasilitasi pembuatan avatar dan komik digital.

### 4.1.1 Arsitektur Feature-Based Modular

Untuk mengatasi kompleksitas kode dan memastikan skalabilitas sistem, penelitian ini menerapkan pendekatan *Feature-Based Architecture*. Dalam arsitektur ini, struktur proyek diorganisir berdasarkan fitur bisnis atau domain fungsional, bukan berdasarkan jenis file teknis semata. Pendekatan ini memungkinkan isolasi logika bisnis, memudahkan pemeliharaan (*maintainability*), dan mendukung pengembangan tim yang paralel.

Struktur folder proyek yang diimplementasikan memisahkan dua fitur utama, yaitu `avatar-generator` dan `comic-generator`, ke dalam modul yang mandiri di dalam direktori `src/features/`. Setiap modul fitur memiliki struktur internal yang konsisten, mencakup komponen UI, *hooks*, layanan API, dan definisi tipe data.

**Kode Program 4.1 Struktur Folder Feature Module**
```bash
src/
├── app/                    # Next.js App Router (routing & pages)
├── components/             # Shared UI components (Button, Modal, etc.)
├── features/               # Feature-specific modules
│   ├── avatar-generator/   # Modul Fitur Avatar Generator
│   │   ├── components/     # Komponen UI spesifik (46 files)
│   │   ├── sections/       # Bagian halaman utama (Create, History)
│   │   ├── hooks/          # Custom hooks (usePaginatedProjects, etc.)
│   │   ├── services/       # Layer komunikasi API (avatarProjectService)
│   │   ├── context/        # State management (ChatterboxContext)
│   │   ├── types/          # Definisi tipe TypeScript
│   │   └── AvatarGenerator.tsx  # Komponen entry point utama
│   └── comic-generator/    # Modul Fitur Comic Generator
│       ├── components/     # Komponen UI spesifik (56 files)
│       ├── sections/       # Tahapan workflow (Overview, Editor, Review)
│       ├── hooks/          # Custom hooks (useComicEditor, etc.)
│       ├── services/       # Layer komunikasi API (sceneService)
│       ├── context/        # State management (EditorContext)
│       └── ComicGenerator.tsx   # Komponen entry point utama
├── lib/                    # Konfigurasi library (axios, utils)
└── types/                  # Shared type definitions
```

Penerapan struktur ini memastikan prinsip *Separation of Concerns* terpenuhi dengan baik. Tabel 4.1 berikut menjelaskan peran spesifik dari setiap direktori dalam modul fitur.

**Tabel 4.1 Peran Direktori dalam Feature Module**

| Direktori | Deskripsi Peran | Contoh Implementasi |
|-----------|-----------------|---------------------|
| `components/` | Menyimpan komponen UI atomik yang spesifik untuk fitur tersebut. | `AvatarUploader.tsx`, `DraggablePanel.tsx` |
| `sections/` | Menggabungkan komponen-komponen menjadi bagian halaman yang utuh. | `HistorySection.tsx`, `ComicEditor.tsx` |
| `hooks/` | Menyimpan logika bisnis *reusable* dan manajemen *state* lokal. | `usePaginatedProjects.ts`, `useProjectRestore.ts` |
| `services/` | Menangani komunikasi HTTP dengan *backend* API. | `avatarProjectService.ts`, `referenceService.ts` |
| `context/` | Mengelola *global state* yang terbatas pada lingkup fitur. | `ChatterboxContext.tsx`, `EditorContext.tsx` |

### 4.1.2 Manajemen State dan Data Flow

Pengelolaan aliran data (*data flow*) yang efisien sangat krusial dalam aplikasi yang melibatkan interaksi pengguna yang intensif. Sistem ini menggunakan kombinasi *React Context API* untuk *state* global fitur dan *React Hooks* untuk *state* lokal dan *server state*.

**A. Global State Management dengan Context API**

Untuk menghindari masalah *prop drilling* (mengoper data melalui banyak lapisan komponen), digunakan *Context API* untuk membungkus *state* yang perlu diakses oleh banyak komponen dalam satu fitur. Contoh implementasi dapat dilihat pada `ChatterboxContext` yang mengelola *state* untuk fitur *Text-to-Speech* dan Avatar.

**Kode Program 4.2 Implementasi ChatterboxContext**
```typescript
// src/features/avatar-generator/context/ChatterboxContext.tsx
interface ChatterboxContextType {
    projects: TTSProject[];
    isLoading: boolean;
    // Form State
    mode: 'cloning' | 'multilingual' | 'voice-changer';
    text: string;
    selectedVoice: VoiceSample | null;
    // Actions
    generateCloning: (req: Omit<TTSGenerateRequest, 'user_id'>) => Promise<void>;
    resetGeneration: () => void;
}

export const ChatterboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State definitions
    const [projects, setProjects] = useState<TTSProject[]>([]);
    const [text, setText] = useState('');
    
    // Business logic methods
    const generateCloning = async (req: Omit<TTSGenerateRequest, 'user_id'>) => {
        setIsGenerating(true);
        try {
            const result = await chatterboxService.generateTTS({ ...req, user_id: userId });
            handleGenerationStart(result);
        } catch (err) {
            setGenerationError(err.message);
        }
    };

    return (
        <ChatterboxContext.Provider value={{ projects, text, generateCloning, ... }}>
            {children}
        </ChatterboxContext.Provider>
    );
};
```

**B. Server State dan Polling Mechanism**

Mengingat proses generasi konten AI membutuhkan waktu pemrosesan di sisi server, aplikasi menerapkan mekanisme *polling* untuk memantau status pengerjaan secara *real-time* tanpa memblokir antarmuka pengguna.

**Kode Program 4.3 Implementasi Polling pada Context**
```typescript
// Logika polling di dalam ChatterboxContext.tsx
const startPolling = useCallback((projectId: string) => {
    stopPolling();
    const poll = async () => {
        try {
            const data = await chatterboxService.getProjectStatus(projectId);
            if (data.status === 'completed') {
                setIsGenerating(false);
                addProject(data); // Update UI dengan hasil
                stopPolling();
            } else if (data.status === 'failed') {
                setGenerationError(data.error_message);
                stopPolling();
            }
        } catch (err) {
            console.error("Polling error:", err);
        }
    };
    pollingInterval.current = setInterval(poll, 2000); // Poll setiap 2 detik
}, []);
```

### 4.1.3 Integrasi dengan Backend API

Komunikasi dengan layanan *backend* diimplementasikan menggunakan pola *Service Layer* yang terpusat. Hal ini memisahkan logika pemanggilan API dari komponen UI, sehingga memudahkan pengujian dan perubahan *endpoint* di masa depan.

**A. Konfigurasi Axios Client**

Pustaka `axios` digunakan sebagai HTTP *client* dengan konfigurasi *interceptor* untuk menangani otentikasi secara otomatis. Token akses diambil dari *cookies* dan disisipkan ke dalam *header* setiap permintaan.

**Kode Program 4.4 Konfigurasi Axios Interceptor**
```typescript
// src/lib/apiClient.ts
const createAxiosInstance = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({ baseURL, timeout: 60000 });

  // Request Interceptor: Sisipkan Token
  instance.interceptors.request.use((config) => {
      const token = cookies.get('access_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
  });

  // Response Interceptor: Handle 401 Unauthorized
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = '/login'; // Redirect ke login jika sesi habis
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
```

**B. Implementasi Service Layer**

Setiap fitur memiliki layanan (*service*) tersendiri. Contohnya, `avatarProjectService` menangani operasi CRUD (*Create, Read, Update, Delete*) untuk proyek avatar, termasuk dukungan untuk *cursor-based pagination*.

**Kode Program 4.5 Implementasi Avatar Project Service**
```typescript
// src/features/avatar-generator/services/avatarProjectService.ts
export const avatarProjectService = {
  getPage: async (userId: string, params?: PaginationParams) => {
    const { data } = await avatarApiClient.get(PROJECT_ENDPOINT, {
        params: {
          user_id: userId,
          limit: params?.limit || 10,
          cursor: params?.cursor
        }
    });
    return {
      items: data.items.map(mapToDomain),
      next_cursor: data.next_cursor,
      has_more: data.has_more
    };
  },

  getStatus: async (id: string) => {
    const { data } = await avatarApiClient.get(`${PROJECT_ENDPOINT}${id}/status`);
    return {
      status: data.status,
      progress: data.progress,
      videoUrl: data.video_url,
      currentStage: data.current_stage
    };
  }
};
```

## 4.2 Implementasi Antarmuka dan Logika Interaksi Pengguna

Bagian ini menjawab rumusan masalah kedua mengenai implementasi antarmuka pengguna yang mendukung alur kerja bertahap dan manipulasi visual. Implementasi difokuskan pada pengalaman pengguna (*User Experience*) yang intuitif dan responsif.

### 4.2.1 Implementasi Fitur Comic Generator

Fitur Comic Generator dirancang dengan alur kerja bertahap (*step-by-step workflow*) untuk memandu pengguna melalui proses kreatif yang kompleks, mulai dari ideasi hingga penyuntingan visual.

**A. Alur Kerja 5 Tahap (5-Step Workflow)**

Komponen utama `ComicGenerator.tsx` mengorkestrasi lima tahapan proses menggunakan manajemen *state* `currentTimelineStep`.

**Kode Program 4.6 Implementasi Workflow Comic Generator**
```typescript
// src/features/comic-generator/ComicGenerator.tsx
export const ComicGenerator: React.FC = () => {
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  
  const steps = [
    { id: 0, name: 'Project Setup', component: <ComicOverview /> },
    { id: 1, name: 'Character References', component: <ReferencesSetup /> },
    { id: 2, name: 'Scene Generation', component: <SceneVisualization /> },
    { id: 3, name: 'Canvas Editor', component: <ComicEditor /> },
    { id: 4, name: 'Preview & Export', component: <ComicReview /> },
  ];

  const renderCurrentSection = () => {
    // Render komponen berdasarkan step aktif
    return steps[currentTimelineStep].component;
  };

  return (
    <div className="px-4 mx-auto pb-20">
      <Timeline 
        currentStep={currentTimelineStep} 
        steps={steps} 
        onStepClick={handleJumpTo}
      />
      <div className="px-15 mx-auto">
        {renderCurrentSection()}
      </div>
    </div>
  );
};
```

**B. Editor Kanvas Visual**

Pada tahap ke-3 (*Comic Editor*), pengguna diberikan antarmuka kanvas interaktif. Implementasi ini memanfaatkan pustaka `react-dnd` untuk fitur *drag-and-drop* panel komik dan `react-rnd` untuk kemampuan mengubah ukuran (*resize*) dan posisi panel secara bebas. Hal ini memberikan kebebasan artistik penuh kepada pengguna untuk mengatur tata letak komik sesuai visi mereka.

### 4.2.2 Implementasi Fitur Avatar Generator

Fitur Avatar Generator mengutamakan kemudahan input parameter yang kompleks melalui antarmuka formulir yang dinamis dan manajemen riwayat proyek yang efisien.

**A. Manajemen Riwayat dengan Pagination**

Untuk menangani jumlah proyek yang terus bertambah, antarmuka riwayat (*history*) menerapkan *infinite scrolling* atau tombol "Load More" yang didukung oleh *cursor-based pagination* di sisi *backend*. Hal ini memastikan performa aplikasi tetap ringan meskipun pengguna memiliki ratusan proyek.

**B. Integrasi Text-to-Speech (TTS)**

Antarmuka Avatar Generator terintegrasi dengan modul TTS (`ChatterboxContext`), memungkinkan pengguna untuk tidak hanya membuat visual avatar, tetapi juga menghasilkan audio narasi yang sinkron. Pengguna dapat memilih mode *cloning* suara atau menggunakan pustaka suara *multilingual* yang tersedia.

## 4.3 Pengujian dan Analisis Kinerja Sistem

Bagian ini menjawab rumusan masalah ketiga mengenai performa dan fungsionalitas aplikasi web yang dihasilkan. Pengujian dilakukan untuk memverifikasi bahwa sistem berjalan sesuai spesifikasi dan memberikan pengalaman pengguna yang responsif.

### 4.3.1 Hasil Pengujian Fungsional

Pengujian fungsional dilakukan dengan metode *Black Box Testing* untuk memvalidasi fitur-fitur utama. Tabel 4.2 merangkum hasil pengujian terhadap skenario penggunaan utama.

**Tabel 4.2 Hasil Pengujian Fungsional**

| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------------------|-----------------|--------|
| 1 | **Otentikasi Pengguna** | Pengguna berhasil login dan token tersimpan di cookies. | Token tersimpan, redirect ke dashboard berhasil. | **Berhasil** |
| 2 | **Pembuatan Proyek Avatar** | Data form terkirim, status awal 'pending', polling berjalan. | Proyek terbuat, status terupdate otomatis setelah selesai. | **Berhasil** |
| 3 | **Navigasi Comic Workflow** | Pengguna dapat berpindah antar step (Next/Back) dengan data tersimpan. | Transisi mulus, data form di step sebelumnya tidak hilang. | **Berhasil** |
| 4 | **Manipulasi Panel Komik** | Panel dapat digeser (drag) dan diubah ukurannya (resize). | Posisi dan ukuran panel terupdate secara real-time di kanvas. | **Berhasil** |
| 5 | **Pagination Riwayat** | Menekan 'Load More' memuat data tambahan tanpa refresh halaman. | Data baru muncul di bawah data lama, transisi halus. | **Berhasil** |

### 4.3.2 Hasil Pengujian Performa

Pengujian performa dilakukan menggunakan *Google Lighthouse* untuk mengukur metrik kinerja *frontend*. Fokus utama adalah pada *First Contentful Paint* (FCP) dan *Cumulative Layout Shift* (CLS) untuk memastikan kenyamanan visual.

Hasil pengujian menunjukkan skor performa rata-rata di atas 85/100 untuk halaman utama. Penggunaan teknik *Lazy Loading* pada komponen gambar dan *Code Splitting* pada rute Next.js berkontribusi signifikan dalam menjaga waktu muat awal tetap rendah (< 1.5 detik), meskipun aplikasi memuat banyak aset visual.

### 4.3.3 Analisis Kelebihan dan Keterbatasan

Berdasarkan hasil implementasi dan pengujian, sistem memiliki kelebihan utama pada arsitektur modular yang memudahkan pengembangan fitur baru dan antarmuka yang sangat interaktif. Namun, terdapat keterbatasan pada ketergantungan terhadap latensi layanan AI eksternal, yang dimitigasi melalui mekanisme *polling* dan umpan balik visual (*loading states*) yang informatif kepada pengguna.
