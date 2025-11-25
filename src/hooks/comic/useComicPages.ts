import { useState, useEffect, useCallback, useRef } from 'react';
import { ComicPage } from '@/app/(main)/tools/comic-generator/types/editor';
import { comicPageService, PageData } from '@/services/comic/comicPageService';
import { deserializePageFromAPI } from '@/app/(main)/tools/comic-generator/lib/pageSerializer';
import { createEmptyPage } from '@/app/(main)/tools/comic-generator/lib/editorUtils';

interface UseComicPagesProps {
  projectId: number | null;
  visualizations?: any[];
}

interface UseComicPagesReturn {
  pages: ComicPage[];
  setPages: React.Dispatch<React.SetStateAction<ComicPage[]>>;
  isLoading: boolean;
  error: string | null;
  createNewPage: () => Promise<void>;
  deletePage: (pageIndex: number) => Promise<void>;
  reorderPages: (fromIndex: number, toIndex: number) => Promise<void>;
  refreshPages: () => Promise<void>;
}

export const useComicPages = ({
  projectId,
  visualizations = []
}: UseComicPagesProps): UseComicPagesReturn => {
  const [pages, setPages] = useState<ComicPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pagesRef = useRef(pages);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const transformPageData = useCallback((pageData: PageData): ComicPage => {
    if (pageData.elements && pageData.elements.length > 0) {
      return deserializePageFromAPI(
        pageData.elements,
        pageData.id,
        pageData.page_number,
        pageData.preview_url
      );
    }
    
    const emptyPage = createEmptyPage(pageData.page_number);
    emptyPage.id = pageData.id;
    emptyPage.preview_url = pageData.preview_url;
    return emptyPage;
  }, []);

  const fetchPages = useCallback(async () => {
    if (!projectId) {
      if (visualizations.length > 0) {
        const initPages = visualizations
          .filter(viz => viz.imageUrl)
          .map((viz, index) => ({
            id: 0,
            page_number: index + 1,
            layout: 'single' as const,
            backgroundColor: '#ffffff',
            bubbles: [],
            panels: [{
              id: `panel-${index}-0`,
              imageUrl: viz.imageUrl || '',
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              rotation: 0,
            }],
            preview_url: null
          }));
        setPages(initPages);
      } else {
        setPages([createEmptyPage(1)]);
      }
      setIsLoading(false);
      return;
    }

    if (pagesRef.current.length === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await comicPageService.getPages(projectId);
      
      if (response.data && response.data.length > 0) {
        const transformedPages = response.data
          .sort((a, b) => a.page_number - b.page_number)
          .map(transformPageData);
        
        setPages(transformedPages);
      } else {
        if (pagesRef.current.length === 0) {
          setPages([createEmptyPage(1)]);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch pages:', err);
      setError(err.message || 'Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, transformPageData, visualizations]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const createNewPage = useCallback(async () => {
    if (!projectId) {
      const newPageNumber = pages.length + 1;
      const newPage = createEmptyPage(newPageNumber);
      setPages(prev => [...prev, newPage]);
      return;
    }

    if (pagesRef.current.length === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const newPageNumber = pages.length + 1;
      const response = await comicPageService.createPage(projectId, {
        notes: `Page ${newPageNumber}`
      });

      const newPage = transformPageData(response);
      setPages(prev => [...prev, newPage]);
    } catch (err: any) {
      console.error('Failed to create page:', err);
      setError(err.message || 'Failed to create page');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, pages.length, transformPageData]);

  const deletePage = useCallback(async (pageIndex: number) => {
    if (pages.length === 1) return;
    
    const targetPage = pages[pageIndex];
    
    if (!projectId || !targetPage.id || targetPage.id === 0) {
      setPages(prev => {
        const newPages = prev.filter((_, idx) => idx !== pageIndex);
        return newPages.map((page, idx) => ({
          ...page,
          page_number: idx + 1
        }));
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await comicPageService.deletePage(projectId, targetPage.id);
      
      const remainingPages = pages.filter((_, idx) => idx !== pageIndex);
      
      const updatePromises = remainingPages.map(async (page, idx) => {
        const newPageNumber = idx + 1;
        if (page.id && page.id !== 0 && page.page_number !== newPageNumber) {
          await comicPageService.updatePage(projectId, page.id, {
            page_number: newPageNumber
          });
        }
        return {
          ...page,
          page_number: newPageNumber
        };
      });

      const updatedPages = await Promise.all(updatePromises);
      setPages(updatedPages);
    } catch (err: any) {
      console.error('Failed to delete page:', err);
      setError(err.message || 'Failed to delete page');
      
      setPages(prev => {
        const newPages = prev.filter((_, idx) => idx !== pageIndex);
        return newPages.map((page, idx) => ({
          ...page,
          page_number: idx + 1
        }));
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, pages]);

  const reorderPages = useCallback(async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const reorderedPages = [...pages];
    const [movedPage] = reorderedPages.splice(fromIndex, 1);
    reorderedPages.splice(toIndex, 0, movedPage);
    
    const updatedPages = reorderedPages.map((page, idx) => ({
      ...page,
      page_number: idx + 1
    }));
    
    setPages(updatedPages);

    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatePromises = updatedPages
        .filter(page => page.id && page.id !== 0)
        .map(async (page, idx) => {
          await comicPageService.updatePage(projectId, page.id, {
            page_number: idx + 1
          });
        });

      await Promise.all(updatePromises);
    } catch (err: any) {
      console.error('Failed to reorder pages:', err);
      setError(err.message || 'Failed to reorder pages');
      await fetchPages();
    } finally {
      setIsLoading(false);
    }
  }, [projectId, pages, fetchPages]);

  const refreshPages = useCallback(async () => {
    await fetchPages();
  }, [fetchPages]);

  return {
    pages,
    setPages,
    isLoading,
    error,
    createNewPage,
    deletePage,
    reorderPages,
    refreshPages,
  };
};