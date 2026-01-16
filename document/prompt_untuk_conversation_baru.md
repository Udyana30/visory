# Prompt: Menyelesaikan Bug State Management dan Preview Generation Comic Editor

## Konteks Masalah

Saya memiliki 2 bug kritis pada comic editor:

### Bug #1: State Persistence Antar Project
Ketika membuka Project A lalu beralih ke Project B, state dari Project A masih tersisa, menyebabkan error `console.error({})` pada `autoSavePage` di `EditorContext.tsx` line 332.

### Bug #2: Preview Generation Failure  
Scene yang sudah di-generate tidak muncul di editor (terutama di Safari) dengan error "Process aborted" di `usePreviewGeneration.ts` line 73.

## Progress yang SUDAH Diselesaikan

✅ **File `e:\TA\Website\visory\src\features\comic-generator\types\domain\editor.ts`**:
- Line 106: Sudah menambahkan `| { type: 'RESET_STATE' }` ke `EditorAction` type

✅ **File `e:\TA\Website\visory\src\features\comic-generator\context\EditorContext.tsx`**:
- Line 208: Case reducer `'RESET_STATE'` → `return { ...initialState };`
- Line 266: Interface `resetState: () => void;`  
- Line 458-460: Method implementation:
  ```typescript
  resetState: () => {
    dispatch({ type: 'RESET_STATE' });
  }
  ```

## Yang MASIH Perlu Diselesaikan

### 1. PRIORITAS TINGGI: Modifikasi `loadProject` di EditorContext.tsx

**Lokasi**: `e:\TA\Website\visory\src\features\comic-generator\context\EditorContext.tsx` line 279-290

**SEBELUM** (kondisi saat ini):
```typescript
loadProject: async (projectId: number) => {
  try {
    const pages = await editorService.getPages(projectId);
    if (pages.length === 0) {
      dispatch({ type: 'INIT_PAGES', payload: [createInitialPage(1)] });
    } else {
      dispatch({ type: 'INIT_PAGES', payload: pages });
    }
  } catch (error) {
    dispatch({ type: 'INIT_PAGES', payload: [createInitialPage(1)] });
  }
},
```

**SESUDAH** (yang harus diimplementasikan):
```typescript
loadProject: async (projectId: number) => {
  // Reset state terlebih dahulu untuk membersihkan data project lama
  dispatch({ type: 'RESET_STATE' });
  
  try {
    const pages = await editorService.getPages(projectId);
    if (pages.length === 0) {
      dispatch({ type: 'INIT_PAGES', payload: [createInitialPage(1)] });
    } else {
      dispatch({ type: 'INIT_PAGES', payload: pages });
    }
  } catch (error) {
    dispatch({ type: 'INIT_PAGES', payload: [createInitialPage(1)] });
  }
},
```

**Instruksi**:
- Tambahkan `dispatch({ type: 'RESET_STATE' });` di BARIS PERTAMA function `loadProject`, sebelum `try`
- Ini memastikan state editor dibersihkan sebelum load data project baru

---

### 2. PRIORITAS TINGGI: Tambah Cleanup Effect di ComicEditor.tsx

**Lokasi**: `e:\TA\Website\visory\src\features\comic-generator\sections\ComicEditor.tsx`

**Posisi**: Setelah `useEffect` yang existing (sekitar line 64), sebelum hooks `useAutoSave` dan `useEditorShortcuts`

**Tambahkan code berikut**:
```typescript
// Cleanup: reset editor state saat projectId berubah atau component unmount
useEffect(() => {
  return () => {
    // Reset state saat akan berpindah ke project lain atau keluar dari editor
    actions.resetState();
  };
}, [projectId, actions]);
```

**Instruksi**:
- Tambahkan `useEffect` cleanup ini SETELAH `useEffect` yang existing (yang handle `loadProject`)
- Dependency array `[projectId, actions]` akan trigger cleanup saat project berubah
- Cleanup function (`return () => {...}`) akan dipanggil sebelum `projectId` berubah dan saat unmount

**CATATAN PENTING**: Destructure `resetState` dari `actions` di bagian atas component:
```typescript
const { state, actions } = useEditor();
const { pages, activePageIndex } = state;
const { loadProject, saveAllChanges, dispatch } = actions;
const { setZoom } = useEditorZoom(dispatch);
```

Ubah menjadi:
```typescript
const { state, actions } = useEditor();
const { pages, activePageIndex } = state;
const { loadProject, saveAllChanges, resetState, dispatch } = actions;  // TAMBAHKAN resetState
const { setZoom } = useEditorZoom(dispatch);
```

---

### 3. PRIORITAS SEDANG: Perbaiki Preview Generation Abort Handling

**Lokasi**: `e:\TA\Website\visory\src\features\comic-generator\hooks\usePreviewGeneration.ts`

**Masalah**:
- Line 73: `if (abortControllerRef.current.signal.aborted) throw new Error('Process aborted');`
- AbortController di-abort terlalu cepat karena cleanup effect dipanggil saat re-render

**SEBELUM** (line 33-42 approx):
```typescript
useEffect(() => {
  return () => {
    // Cleanup blob URLs
    Object.values(renderedPreviews).forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    
    // Abort ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []); // Empty dependency
```

**SESUDAH** (yang harus diimplementasikan):
```typescript
useEffect(() => {
  return () => {
    // Hanya cleanup blob URLs, JANGAN abort controller di sini
    Object.values(renderedPreviews).forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  };
}, []); // Empty dependency
```

Dan modifikasi bagian `generatePreviews` function (sekitar line 54):
```typescript
const generatePreviews = useCallback(async (projectId: number): Promise<void> => {
  // Abort proses sebelumnya jika ada
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  
  // Buat controller baru untuk proses ini
  abortControllerRef.current = new AbortController();
  const currentController = abortControllerRef.current;
  
  setIsGenerating(true);
  const newRendered: Record<string, string> = {};
  ...
  
  // Check abort menggunakan currentController, bukan abortControllerRef
  if (currentController.signal.aborted) {
    throw new Error('Process aborted');
  }
  ...
}, [pages, ...]);
```

---

### 4. PRIORITAS RENDAH: Validasi di useAutoSave.ts (Opsional - Safety Net)

**Lokasi**: `e:\TA\Website\visory\src\features\comic-generator\hooks\editor\useAutoSave.ts`

**Modifikasi `checkAndSave` function** (sekitar line 16-24):
```typescript
const checkAndSave = useCallback(async () => {
  if (!projectId) return;
  
  const dirtyPageIndex = state.pages.findIndex(p => p.isDirty);
  if (dirtyPageIndex !== -1) {
    const page = state.pages[dirtyPageIndex];
    
    // Validasi page sebelum save
    if (!page || !page.id || !page.elements || page.elements.length === 0) {
      console.warn('[AutoSave] Skipping invalid page:', { 
        pageIndex: dirtyPageIndex, 
        pageId: page?.id,
        hasElements: !!page?.elements 
      });
      return;
    }
    
    try {
      await actions.autoSavePage(projectId, dirtyPageIndex);
    } catch (error) {
      console.error('[AutoSave] Failed to save page:', { pageIndex: dirtyPageIndex, error });
    }
  }
}, [state.pages, projectId, actions]);
```

---

## Instruksi Implementasi

**CRITICAL**: Lakukan perubahan dalam urutan berikut:

1. **WAJIB**: Modifikasi `loadProject` di `EditorContext.tsx` (Prioritas TINGGI #1)
2. **WAJIB**: Tambah cleanup `useEffect` di `ComicEditor.tsx` (Prioritas TINGGI #2)
3. **WAJIB**: Perbaiki abort handling di `usePreviewGeneration.ts` (Prioritas SEDANG #3)
4. **OPSIONAL**: Tambah validasi di `useAutoSave.ts` (Prioritas RENDAH #4 - safety net)

**Setelah implementasi, WAJIB lakukan testing**:
- Test state persistence: Buka Project A → kembali → Buka Project B → pastikan tidak ada error di console
- Test preview generation: Generate scene → buka editor → pastikan preview muncul (test di Safari juga)
- Test auto-save: Edit page → tunggu 5 detik → pastikan auto-save berjalan tanpa error

---

## File Paths yang Akan Dimodifikasi

1. `e:\TA\Website\visory\src\features\comic-generator\context\EditorContext.tsx`
2. `e:\TA\Website\visory\src\features\comic-generator\sections\ComicEditor.tsx`
3. `e:\TA\Website\visory\src\features\comic-generator\hooks\usePreviewGeneration.ts`
4. `e:\TA\Website\visory\src\features\comic-generator\hooks\editor\useAutoSave.ts` (opsional)

---

## Output yang Diharapkan

Setelah semua perubahan diimplementasikan:

✅ Bug #1 TERATASI: State editor bersih saat berpindah project, tidak ada error `console.error({})`
✅ Bug #2 TERATASI: Preview generation berhasil di semua browser termasuk Safari
✅ Auto-save tetap berfungsi normal tanpa error
✅ Tidak ada regresi pada fitur lain (preview, undo/redo, save manual, dll)

---

## Catatan Tambahan

- **Best Practice**: Perubahan ini mengikuti pattern "cleanup on change" yang standard di React
- **Type Safety**: Semua perubahan sudah type-safe karena `RESET_STATE` sudah ditambahkan ke `EditorAction` type
- **Performance**: Reset state dengan `dispatch({ type: 'RESET_STATE' })` sangat efisien karena hanya mengganti reference object
- **Backward Compatibility**: Tidak ada breaking changes, semua API tetap sama

**Jika ada pertanyaan atau kesulitan saat implementasi, tanyakan sebelum melanjutkan!**
