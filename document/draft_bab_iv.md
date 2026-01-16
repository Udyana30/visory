# BAB IV
# HASIL DAN PEMBAHASAN

Bab ini menguraikan hasil dari perancangan dan implementasi sistem yang telah dilakukan, serta pembahasan mengenai pencapaian terhadap rumusan masalah yang telah ditetapkan. Pembahasan mencakup arsitektur aplikasi web yang modular, implementasi antarmuka pengguna yang interaktif, serta hasil pengujian fungsionalitas dan kinerja sistem.

## 4.1 Perancangan Arsitektur Aplikasi Web Generator

Visualisasi arsitektur sistem disajikan untuk memberikan pemahaman menyeluruh terhadap struktur fundamental aplikasi yang dirancang guna menangani kompleksitas interaksi pengguna dan integrasi layanan kecerdasan buatan. Bagian ini menguraikan strategi implementasi teknis yang diadopsi untuk menjawab tantangan skalabilitas dan pemeliharaan kode dalam pengembangan aplikasi web modern. Fokus pembahasan meliputi penerapan arsitektur modular berbasis fitur, mekanisme pengelolaan aliran data yang efisien, serta pola integrasi layanan *backend* yang terstruktur.

### 4.1.1 Arsitektur Feature-Based Modular

Dekomposisi sistem ke dalam komponen-komponen fungsional ditunjukkan melalui penerapan *Feature-Based Architecture*, sebuah pendekatan desain yang mengorganisir kode berdasarkan domain bisnis alih-alih jenis teknis semata. Strategi ini dipilih untuk memitigasi risiko *spaghetti code* yang sering muncul pada aplikasi berskala besar, di mana logika bisnis yang saling terkait tersebar di berbagai direktori yang terpisah. Dengan mengisolasi setiap fitur utama ke dalam modul mandiri, tim pengembang dapat bekerja secara paralel pada fitur yang berbeda tanpa menimbulkan konflik kode yang signifikan, sekaligus memudahkan proses *debugging* dan pengujian unit. Struktur ini juga mendukung prinsip *High Cohesion* dan *Low Coupling*, di mana komponen-komponen yang memiliki fungsi serupa dikelompokkan bersama, sementara ketergantungan antar modul diminimalkan.

Implementasi konkret dari arsitektur ini terlihat pada pemisahan dua fitur utama aplikasi, yaitu `avatar-generator` dan `comic-generator`, yang ditempatkan dalam direktori `src/features/`. Setiap modul fitur dirancang dengan struktur internal yang konsisten dan terstandarisasi, mencakup sub-direktori untuk komponen antarmuka, logika bisnis (*hooks*), layanan API, dan manajemen *state*. Konsistensi struktur ini sangat krusial untuk mempercepat kurva pembelajaran bagi pengembang baru dan memastikan bahwa pola desain yang baik diterapkan secara seragam di seluruh aplikasi. Kode Program 4.1 berikut mengilustrasikan hierarki direktori yang telah diimplementasikan untuk kedua fitur tersebut.

**Kode Program 4.1 Struktur Folder Feature Module**
```bash
src/
├── features/               
│   ├── avatar-generator/   # Modul Fitur Avatar Generator
│   │   ├── components/     # Komponen UI (e.g., AvatarUploader.tsx)
│   │   ├── sections/       # Halaman Utama (e.g., HistorySection.tsx)
│   │   ├── hooks/          # Logika Bisnis (e.g., usePaginatedProjects.ts)
│   │   ├── services/       # Komunikasi API (e.g., avatarProjectService.ts)
│   │   ├── context/        # State Management (e.g., VoiceLibraryContext.tsx)
│   │   └── AvatarGenerator.tsx  # Halaman Utama Fitur
│   └── comic-generator/    # Modul Fitur Comic Generator
│       ├── components/     # Komponen UI (e.g., DraggablePanel.tsx)
│       ├── sections/       # Halaman Utama (e.g., ComicEditor.tsx)
│       ├── hooks/          # Logika Bisnis (e.g., useComicEditor.ts)
│       ├── services/       # Komunikasi API (e.g., sceneService.ts)
│       ├── context/        # State Management (e.g., EditorContext.tsx)
│       └── ComicGenerator.tsx   # Halaman Utama Fitur
```

Representasi grafis di atas menegaskan bahwa setiap fitur memiliki otonomi dalam mengelola aset dan logikanya sendiri, namun tetap berbagi konvensi penamaan yang sama. Sebagai contoh, logika manipulasi data untuk avatar dikapsulasi sepenuhnya dalam folder `avatar-generator/hooks`, sedangkan logika editor kanvas komik berada dalam `comic-generator/hooks`. Pemisahan yang tegas ini tidak hanya meningkatkan keterbacaan kode, tetapi juga memfasilitasi *code splitting* yang lebih efisien oleh *bundler* Next.js, sehingga performa muat awal aplikasi dapat dioptimalkan.

### 4.1.2 Manajemen State dan Data Flow

Mekanisme pengelolaan data dalam aplikasi yang interaktif memegang peranan vital untuk menjamin responsivitas antarmuka dan konsistensi informasi yang ditampilkan kepada pengguna. Sistem ini menerapkan pola manajemen *state* hibrida yang menggabungkan *React Context API* untuk data global pada level fitur dan *React Hooks* untuk data lokal komponen. Pendekatan ini dipilih untuk menghindari kompleksitas berlebihan dari pustaka manajemen *state* eksternal seperti Redux, sambil tetap menyediakan solusi yang *scalable* untuk kebutuhan aplikasi.

#### 4.1.2.1 AuthContext

Implementasi otentikasi terpusat dikelola melalui `AuthContext` yang bertugas menyimpan status sesi pengguna dan menyediakan metode login serta registrasi yang dapat diakses dari seluruh bagian aplikasi. Konteks ini memastikan bahwa informasi pengguna yang sensitif dikelola secara aman dan konsisten, serta memfasilitasi pengalihan halaman otomatis berdasarkan status otorisasi.

**Kode Program 4.2 Implementasi AuthContext**
```typescript
// src/context/AuthContext.tsx
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    if (response.user) setUser(response.user);
    return { success: !!response.user };
  };

  return (
    <AuthContext.Provider value={{ user, login, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
```

Cuplikan kode di atas menunjukkan bagaimana `AuthContext` mengenkapsulasi logika otentikasi dengan menyediakan *state* `user` dan fungsi `login` yang terintegrasi langsung dengan layanan *backend*. Dengan membungkus logika ini dalam *Provider*, komponen lain tidak perlu mengetahui detail implementasi penyimpanan token atau mekanisme *request* ke API, cukup mengonsumsi nilai konteks yang disediakan.

#### 4.1.2.2 EditorContext

Manajemen interaksi visual yang kompleks pada fitur Comic Generator ditangani oleh `EditorContext`, yang bertanggung jawab atas manipulasi elemen kanvas seperti panel, balon teks, dan tata letak halaman. Penggunaan `useReducer` di dalam konteks ini sangat krusial untuk menangani transisi *state* yang rumit dan memastikan setiap aksi pengguna, seperti *undo* atau *redo*, dapat dilacak dengan presisi.

**Kode Program 4.3 Implementasi EditorContext**
```typescript
// src/features/comic-generator/context/EditorContext.tsx
export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const actions = useMemo(() => ({
    addCustomPanel: (x: number, y: number, w: number, h: number) => {
      dispatch({ type: 'ADD_ELEMENT', payload: createDefaultPanel(x, y, w, h) });
    },
    saveAllChanges: async (projectId: number) => {
      await editorService.savePage(projectId, state.pages[state.activePageIndex]);
    }
  }), [state]);

  return (
    <EditorContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </EditorContext.Provider>
  );
};
```

Kode program tersebut mengilustrasikan bagaimana `EditorContext` menyediakan aksi-aksi spesifik domain editor yang dapat dipicu oleh komponen antarmuka. Pemisahan antara *state* dan *dispatch* memungkinkan komponen *toolbar* atau kanvas untuk memicu perubahan tanpa perlu mengetahui logika internal pemrosesan data, menjaga kode tetap bersih dan terorganisir.

#### 4.1.2.3 VoiceLibraryContext

Pengelolaan aset suara pada fitur Avatar Generator difasilitasi oleh `VoiceLibraryContext`, yang menangani pengambilan data pustaka suara, pengunggahan sampel baru, dan sinkronisasi status pemrosesan. Konteks ini dirancang untuk mendukung operasi asinkron yang intensif, seperti *fetching* data dengan paginasi dan pembaruan antarmuka secara optimistik saat pengguna menambahkan suara baru.

**Kode Program 4.4 Implementasi VoiceLibraryContext**
```typescript
// src/features/avatar-generator/context/VoiceLibraryContext.tsx
export const VoiceLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [voices, setVoices] = useState<VoiceSample[]>([]);
    
    const fetchVoices = useCallback(async (reset = false) => {
        const data = await chatterboxService.getVoices(userId, true, LIMIT, offset);
        setVoices(prev => reset ? data : [...prev, ...data]);
    }, [userId]);

    return (
        <VoiceLibraryContext.Provider value={{ voices, fetchVoices, ... }}>
            {children}
        </VoiceLibraryContext.Provider>
    );
};
```

Implementasi di atas memperlihatkan strategi pengelolaan data pustaka suara yang efisien dengan memanfaatkan `useCallback` untuk mencegah pembuatan ulang fungsi yang tidak perlu. Konteks ini bertindak sebagai jembatan antara antarmuka pengguna dan layanan `chatterboxService`, memastikan bahwa setiap perubahan data di server segera direfleksikan pada tampilan daftar suara pengguna.

### 4.1.3 Integrasi dengan Backend API

Interaksi antar entitas dalam ekosistem aplikasi, khususnya antara antarmuka pengguna dan layanan *backend*, difasilitasi melalui lapisan layanan (*Service Layer*) yang terabstraksi. Pola desain ini bertujuan untuk memisahkan logika komunikasi HTTP dari komponen presentasi, sehingga perubahan pada *endpoint* API atau struktur respons tidak berdampak langsung pada kode antarmuka. Setiap fitur memiliki modul layanan tersendiri yang membungkus pemanggilan `axios` ke dalam fungsi-fungsi asinkron yang terdefinisi dengan baik, mencakup operasi CRUD (*Create, Read, Update, Delete*) yang standar dalam pengembangan aplikasi berbasis REST API.

#### 4.1.3.1 Layanan Otentikasi Pengguna

Manajemen akses dan keamanan aplikasi ditangani oleh layanan otentikasi yang bertanggung jawab atas validasi kredensial pengguna serta pengelolaan sesi berbasis token. Layanan ini menyediakan fungsi esensial seperti *login*, registrasi, dan *logout*, yang secara otomatis menangani penyimpanan token akses ke dalam *cookies* untuk persistensi sesi.

**Kode Program 4.5 Implementasi Layanan Otentikasi**
```typescript
// src/services/authService.ts
const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (response.data.access_token) cookies.set('access_token', response.data.access_token, 7);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
    return response.data;
  },

  logout: (): void => {
    cookies.remove('access_token');
    localStorage.removeItem('user');
  }
};
```

Implementasi di atas menunjukkan mekanisme *login* dan registrasi yang memanfaatkan metode HTTP POST untuk mengirimkan data sensitif secara aman ke server. Fungsi `logout` bekerja secara sinkron di sisi klien untuk membersihkan jejak sesi, memastikan bahwa akses pengguna terputus sepenuhnya setelah tindakan keluar dilakukan tanpa memerlukan panggilan jaringan tambahan.

#### 4.1.3.2 Layanan Proyek Komik

Layanan ini bertindak sebagai pintu gerbang utama untuk pengelolaan siklus hidup proyek komik, memfasilitasi operasi lengkap mulai dari penciptaan hingga penghapusan data. Modul ini mengimplementasikan seluruh spektrum operasi CRUD untuk memastikan fleksibilitas penuh dalam manajemen data proyek oleh pengguna.

**Kode Program 4.6 Implementasi Layanan Proyek Komik**
```typescript
// src/features/comic-generator/services/projectService.ts
export const projectService = {
  create: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>('/service/comic/projects/', data);
    return response.data;
  },

  getAll: async (params?: PaginationParams): Promise<ComicListResponse> => {
    const response = await apiClient.get<ComicListResponse>('/service/comic/projects/', { params });
    return response.data;
  },

  update: async (id: number, data: Partial<CreateProjectRequest>): Promise<ProjectResponse> => {
    const response = await apiClient.put<ProjectResponse>(`/service/comic/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/projects/${id}`);
  }
};
```

Kode program tersebut memperlihatkan penerapan standar RESTful API yang komprehensif, di mana `create` menggunakan POST, `getAll` menggunakan GET dengan parameter *query*, `update` menggunakan PUT untuk modifikasi data, dan `delete` menggunakan DELETE. Abstraksi ini memungkinkan komponen antarmuka untuk melakukan manipulasi data proyek yang kompleks tanpa perlu mengetahui detail implementasi protokol komunikasi yang mendasarinya.

#### 4.1.3.3 Layanan Referensi Visual

Pengelolaan aset visual eksternal yang digunakan sebagai referensi dalam pembuatan komik ditangani oleh layanan ini dengan kemampuan manipulasi data yang lengkap. Layanan ini mendukung pengunggahan berkas gambar kustom, pengambilan pustaka referensi, pembaruan metadata, serta penghapusan aset yang tidak lagi diperlukan.

**Kode Program 4.7 Implementasi Layanan Referensi Visual**
```typescript
// src/features/comic-generator/services/referenceService.ts
export const referenceService = {
  createCustom: async (projectId: number, file: File, type: 'character' | 'background') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await apiClient.post(`/service/comic/references/custom/${projectId}`, formData);
    return response.data;
  },

  getAllByProject: async (projectId: number): Promise<ReferenceResponse[]> => {
    const response = await apiClient.get('/service/comic/references/', { params: { project_id: projectId } });
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  },

  update: async (id: number, data: CreateReferenceRequest): Promise<ReferenceResponse> => {
    const response = await apiClient.put<ReferenceResponse>(`/service/comic/references/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/references/${id}`);
  }
};
```

Implementasi di atas menonjolkan penggunaan objek `FormData` pada fungsi `createCustom` untuk menangani pengiriman data biner, sementara fungsi lainnya menangani data JSON standar. Fleksibilitas ini sangat penting untuk mendukung berbagai jenis interaksi pengguna, mulai dari manajemen berkas fisik hingga pengorganisasian metadata referensi.

#### 4.1.3.4 Layanan Adegan Komik

Setiap panel dalam komik direpresentasikan sebagai sebuah adegan (*scene*) yang dikelola secara dinamis melalui layanan khusus ini. Layanan ini menyediakan fungsionalitas *end-to-end* untuk siklus hidup adegan, termasuk pembuatan awal, pengambilan riwayat revisi, pembaruan parameter, dan penghapusan.

**Kode Program 4.8 Implementasi Layanan Adegan Komik**
```typescript
// src/features/comic-generator/services/sceneService.ts
export const sceneService = {
  create: async (data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.post<SceneResponse>('/service/comic/scenes', data);
    return response.data;
  },

  getHistory: async (id: number): Promise<GenerationHistoryItem[]> => {
    const response = await apiClient.get<GenerationHistoryItem[]>(`/service/comic/scenes/history/${id}`);
    return response.data;
  },

  update: async (id: number, data: CreateSceneRequest): Promise<SceneResponse> => {
    const response = await apiClient.put<SceneResponse>(`/service/comic/scenes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/comic/scenes/${id}`);
  }
};
```

Melalui kode program tersebut, terlihat bagaimana layanan memfasilitasi interaksi granular dengan setiap panel komik. Fungsi `getHistory` secara spesifik mendukung fitur eksperimentasi kreatif, memungkinkan pengguna untuk menelusuri dan memulihkan versi gambar sebelumnya, sementara operasi `update` dan `delete` memberikan kontrol penuh atas konten panel.

#### 4.1.3.5 Layanan Editor Komik

Manipulasi detail halaman komik, termasuk tata letak panel dan urutan halaman, dikelola oleh layanan editor yang menyediakan operasi tingkat halaman. Layanan ini memastikan integritas struktur komik melalui fungsi-fungsi untuk menambah, menyimpan, memperbarui urutan, dan menghapus halaman.

**Kode Program 4.9 Implementasi Layanan Editor Komik**
```typescript
// src/features/comic-generator/services/editorService.ts
export const editorService = {
  createPage: async (projectId: number, data: CreatePageRequest): Promise<ComicPage> => {
    const response = await apiClient.post<PageResponse>(`/service/comic/projects/${projectId}/pages`, data);
    return mapApiToDomain(response.data);
  },

  getPages: async (projectId: number): Promise<ComicPage[]> => {
    const response = await apiClient.get<PageListResponse>(`/service/comic/projects/${projectId}/pages`);
    return response.data.data ? response.data.data.map(mapApiToDomain) : [];
  },

  updatePageDetails: async (projectId: number, pageId: string, data: UpdatePageRequest): Promise<void> => {
    await apiClient.put(`/service/comic/projects/${projectId}/pages/${pageId}`, data);
  },

  deletePage: async (projectId: number, pageId: string): Promise<void> => {
    await apiClient.delete(`/service/comic/projects/${projectId}/pages/${pageId}`);
  }
};
```

Implementasi `createPage` dan `getPages` melibatkan transformasi data (*mapping*) untuk menjembatani perbedaan antara struktur basis data dan model domain aplikasi. Fungsi `updatePageDetails` dan `deletePage` melengkapi kemampuan editor dengan menyediakan mekanisme untuk modifikasi properti halaman dan penghapusan halaman yang tidak diinginkan.

#### 4.1.3.6 Layanan Pratinjau Komik

Sebelum hasil akhir diekspor, pengguna memerlukan visualisasi cepat dari halaman yang sedang dikerjakan untuk keperluan verifikasi. Layanan pratinjau memfasilitasi pengunggahan tangkapan layar sementara (*snapshot*) dari kanvas yang dihasilkan secara *client-side*.

**Kode Program 4.10 Implementasi Layanan Pratinjau Komik**
```typescript
// src/features/comic-generator/services/previewService.ts
export const previewService = {
  uploadPagePreview: async (projectId: number, pageId: number, blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', blob, `preview_${pageId}.png`);

    const { data } = await apiClient.post<PreviewResponse>(
      `/service/comic/projects/${projectId}/pages/${pageId}/preview`, 
      formData
    );
    return data.preview_url;
  }
};
```

Kode di atas mendemonstrasikan penanganan khusus untuk data *Blob* yang dikonversi menjadi berkas gambar sebelum dikirim ke server. Meskipun hanya memiliki satu operasi utama, fungsi ini krusial untuk memberikan umpan balik visual instan pada navigasi editor tanpa membebani server dengan proses *rendering* berulang.

#### 4.1.3.7 Layanan Ekspor Komik

Tahap akhir dari proses pembuatan komik adalah konversi proyek menjadi format dokumen portabel yang siap didistribusikan. Layanan ekspor menangani inisiasi proses komputasi berat ini di sisi server melalui permintaan POST yang terdedikasi.

**Kode Program 4.11 Implementasi Layanan Ekspor Komik**
```typescript
// src/features/comic-generator/services/exportService.ts
export const exportService = {
  triggerExport: async (projectId: number, format: ExportFormat): Promise<ExportResponse> => {
    const { data } = await apiClient.post(`/service/comic/projects/${projectId}/export`, { 
      export_format: format 
    });
    return data;
  }
};
```

Fungsi `triggerExport` dirancang untuk memisahkan permintaan ekspor dari proses pengunduhan, memungkinkan server untuk memproses permintaan secara asinkron jika diperlukan. Pendekatan ini mencegah *timeout* pada koneksi HTTP saat melakukan konversi dokumen yang kompleks dan berukuran besar.

#### 4.1.3.8 Layanan Proyek Avatar

Pengelolaan data proyek avatar, termasuk pembuatan proyek baru dan pemantauan status pemrosesan video, ditangani oleh layanan ini secara komprehensif. Layanan ini menyediakan mekanisme untuk menginisialisasi proyek dengan parameter AI yang kompleks, melihat daftar proyek, memantau kemajuan pembuatan, dan menghapus proyek.

**Kode Program 4.12 Implementasi Layanan Proyek Avatar**
```typescript
// src/features/avatar-generator/services/avatarProjectService.ts
export const avatarProjectService = {
  create: async (payload: CreateAvatarPayload & { userId: string }): Promise<AvatarProject> => {
    if (!payload.userId) throw new Error('User ID is required');
    const requestBody: ApiCreateAvatarRequest = {
      user_id: String(payload.userId),
      title: payload.title,
      description: payload.description,
      prompt: payload.prompt || DEFAULT_AVATAR_PROMPT,
      image_url: payload.imageUrl,
      audio_url: payload.audioUrl,
      type: payload.type || 'single_person',
      audio_order: payload.audioOrder,
      audio_url_2: (payload as any).audioUrl2,
      parameters: {
        sample_steps: Number(payload.parameters.sampleSteps),
        sample_shift: Number(payload.parameters.sampleShift),
        sample_text_guide_scale: Number(payload.parameters.textGuideScale),
        sample_audio_guide_scale: Number(payload.parameters.audioGuideScale),
        lora_scale: Number(payload.parameters.loraScale),
        num_persistent_param_in_dit: Number(payload.parameters.numPersistentParamInDit),
        seed: Number(payload.parameters.seed),
      }
    };
    const { data } = await avatarApiClient.post<ApiAvatarProject>(PROJECT_ENDPOINT, requestBody);
    return mapToDomain(data);
  },

  getPage: async (userId: string, params?: PaginationParams) => {
    const { data } = await avatarApiClient.get('/projects/', { params: { user_id: userId, ...params } });
    return { items: data.items.map(mapToDomain), next_cursor: data.next_cursor };
  },

  getStatus: async (id: string) => {
    const { data } = await avatarApiClient.get(`/projects/${id}/status`);
    return mapStatusToDomain(data);
  },

  deleteProject: async (id: string): Promise<void> => {
    await avatarApiClient.delete(`/projects/${id}`);
  }
};
```

Fungsi `create` menangani transformasi data yang rumit dari model formulir antarmuka ke struktur permintaan API yang dibutuhkan oleh mesin AI, termasuk konversi tipe data parameter numerik. Sementara itu, `getPage` dan `getStatus` memastikan pengguna dapat memantau siklus hidup proyek mereka dari status antrian hingga selesai diproses.

#### 4.1.3.9 Layanan Template Avatar

Untuk mempercepat proses pembuatan, pengguna dapat memilih dari koleksi *template* avatar yang dikelola melalui layanan ini. Layanan ini mendukung eksplorasi pustaka template, penambahan template baru melalui pengunggahan berkas, dan penghapusan template pribadi.

**Kode Program 4.13 Implementasi Layanan Template Avatar**
```typescript
// src/features/avatar-generator/services/avatarTemplateService.ts
export const avatarTemplateService = {
  create: async (payload: CreateTemplatePayload): Promise<AvatarTemplate> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('file', payload.file);
    formData.append('user_id', payload.userId);
    formData.append('is_public', String(payload.isPublic || false));

    const { data } = await avatarApiClient.post<AvatarTemplate>(`${AVATAR_ENDPOINT}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getPage: async (params?: PaginationParams): Promise<PaginatedResponse<AvatarTemplate>> => {
    const { data } = await avatarApiClient.get('/avatars/', {
        params: { limit: params?.limit || 10, cursor: params?.cursor }
    });
    return data;
  },

  delete: async (avatarId: string): Promise<void> => {
    await avatarApiClient.delete(`/avatars/${avatarId}`);
  }
};
```

Kode program di atas menunjukkan penggunaan objek `FormData` pada fungsi `create` untuk memfasilitasi pengunggahan berkas template beserta metadatanya dalam satu permintaan HTTP. Hal ini memungkinkan pengguna untuk berkontribusi pada pustaka template dengan mudah, sementara fungsi `getPage` dan `delete` menyediakan kontrol penuh atas manajemen koleksi tersebut.

#### 4.1.3.10 Layanan Pengunggahan Berkas

Fitur Avatar Generator memerlukan kemampuan untuk mengunggah dan mengelola aset media pengguna secara efisien. Layanan ini menangani proses *upload* *multipart* untuk berbagai jenis media serta penghapusan aset yang tidak lagi digunakan.

**Kode Program 4.14 Implementasi Layanan Pengunggahan Berkas**
```typescript
// src/features/avatar-generator/services/uploadService.ts
export const uploadService = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource_type', file.type.startsWith('audio') ? 'audio' : 'image');
    const response = await avatarApiClient.post<UploadResponse>('/upload', formData);
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    await avatarApiClient.delete(`/upload/${fileId}`);
  }
};
```

Fungsi `uploadFile` secara cerdas mengabstraksi kompleksitas penanganan tipe MIME, memastikan berkas diproses sesuai jenisnya di server. Sementara itu, `deleteFile` memastikan bahwa penyimpanan server tetap efisien dengan memungkinkan penghapusan berkas fisik yang sudah tidak relevan.

#### 4.1.3.11 Layanan Text-to-Speech Chatterbox

Integrasi dengan mesin sintesis suara *Chatterbox* dikelola melalui layanan ini yang menawarkan kapabilitas manajemen suara yang lengkap. Modul ini menangani permintaan generasi audio, pengelolaan pustaka suara pengguna, konversi suara, dan penghapusan proyek audio.

**Kode Program 4.15 Implementasi Layanan Chatterbox**
```typescript
// src/features/avatar-generator/services/tts/chatterboxService.ts
export const chatterboxService = {
  generateTTS: async (payload: TTSGenerateRequest): Promise<TTSProject> => {
    const { data } = await avatarApiClient.post('/audio/chatterbox/tts/generate', payload);
    return data;
  },

  getVoicesPage: async (userId: string, params?: PaginationParams) => {
    const { data } = await avatarApiClient.get(`${AUDIO_BASE}/voice-library`, {
        params: { user_id: userId, ...params }
    });
    return data;
  },

  uploadVoice: async (payload: UploadVoiceRequest): Promise<VoiceSample> => {
    const formData = new FormData(); // ... append logic
    const { data } = await avatarApiClient.post(`${AUDIO_BASE}/voice-library/upload`, formData);
    return data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await avatarApiClient.delete(`${AUDIO_BASE}/chatterbox/projects/${projectId}`);
  }
};
```

Layanan ini memfasilitasi interaksi yang kaya dengan API audio, mencakup operasi pembuatan (`generateTTS`, `uploadVoice`), pengambilan data (`getVoicesPage`), dan penghapusan (`deleteProject`). Keragaman operasi ini mencerminkan kompleksitas fitur audio yang memungkinkan pengguna untuk tidak hanya mengonsumsi tetapi juga memproduksi dan mengelola aset suara mereka sendiri.

#### 4.1.3.12 Layanan Text-to-Speech Kokoro

Sebagai alternatif mesin suara, layanan *Kokoro* menyediakan opsi sintesis suara tambahan dengan manajemen proyek yang setara. Layanan ini mengelola pengambilan daftar model suara, permintaan generasi audio, pemantauan status, dan penghapusan proyek.

**Kode Program 4.16 Implementasi Layanan Kokoro**
```typescript
// src/features/avatar-generator/services/tts/kokoroService.ts
export const kokoroService = {
  getVoices: async (): Promise<KokoroVoice[]> => {
    if (voicesCache) return voicesCache;
    const { data } = await avatarApiClient.get<{ voices: any[] }>(`${KOKORO_BASE}/voices`);
    return data.voices.map(mapKokoroVoice);
  },

  generateAudio: async (payload: KokoroGenerateRequest): Promise<KokoroGenerateResponse> => {
    const { data } = await avatarApiClient.post<KokoroGenerateResponse>(`${KOKORO_BASE}/generate/`, payload);
    return data;
  },

  checkStatus: async (ttsId: string): Promise<KokoroGenerateResponse> => {
    const { data } = await avatarApiClient.get<KokoroGenerateResponse>(`${KOKORO_BASE}/${ttsId}`);
    return data;
  },

  deleteProject: async (ttsId: string): Promise<void> => {
    await avatarApiClient.delete(`${KOKORO_BASE}/${ttsId}`);
  }
};
```

Implementasi layanan ini menunjukkan cakupan operasi yang lengkap untuk fitur TTS sekunder, mulai dari `getVoices` yang dioptimalkan dengan *cache*, `generateAudio` untuk inisiasi tugas, `checkStatus` untuk pemantauan, hingga `deleteProject` untuk pembersihan data. Hal ini memastikan bahwa pengguna memiliki pengalaman yang konsisten dan terkontrol terlepas dari mesin suara mana yang mereka pilih.

## 4.2 Implementasi Antarmuka dan Logika Interaksi Pengguna

Bagian ini menjawab rumusan masalah kedua mengenai implementasi antarmuka pengguna yang mendukung alur kerja bertahap dan manipulasi visual. Implementasi difokuskan pada pengalaman pengguna (*User Experience*) yang intuitif dan responsif.

### 4.2.1 Implementasi Fitur Comic Generator

Fitur Comic Generator dirancang dengan alur kerja bertahap (*step-by-step workflow*) untuk memandu pengguna melalui proses kreatif yang kompleks, mulai dari ideasi hingga penyuntingan visual.

**A. Alur Kerja 5 Tahap (5-Step Workflow)**

Komponen utama `ComicGenerator.tsx` mengorkestrasi lima tahapan proses menggunakan manajemen *state* `currentTimelineStep`.

**Kode Program 4.17 Implementasi Workflow Comic Generator**
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
