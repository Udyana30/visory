'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TopBar from '@/components/layout/TopBar';
import { SuccessModal } from '@/components/ui/SuccessModal';

import { ComicOverview } from './sections/ComicOverview';
import { ReferencesSetup } from './sections/ReferencesSetup';
import { SceneVisualization } from './sections/SceneVisualization';
import { ComicEditor } from './sections/ComicEditor';
import { ComicReview } from './sections/ComicReview';

import { useComicProjectRestore, RestoredData } from './hooks/useProjectRestore';
import { useCreateProject } from './hooks/project/useCreateProject';
import { useUpdateProject } from './hooks/project/useUpdateProject';
import { sceneService } from './services/sceneService';
import { referenceService } from './services/referenceService';
import { EditorProvider } from './context/EditorContext';
import { mapToDomain as mapReferenceToDomain } from './utils/referenceMapper';

import { TIMELINE_STEPS } from './constants/comic';
import { PAGE_SIZES_MAP, ART_STYLES } from './constants/project';
import { Project, ProjectFormData } from './types/domain/project';
import { SceneVisualization as SceneType } from './types/domain/scene';
import { Reference } from './types/domain/reference';

interface ComicGeneratorProps {
  initialRestoredData?: RestoredData | null;
}

export const ComicGenerator: React.FC<ComicGeneratorProps> = ({ initialRestoredData }) => {
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [projectReferences, setProjectReferences] = useState<Reference[]>([]);
  const [externalReferences, setExternalReferences] = useState<Reference[]>([]);
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<string[]>([]);
  const [scenes, setScenes] = useState<SceneType[]>([]);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    genre: '',
    language: '',
    description: '',
    pageSizeLabel: '',
    artStyleIndex: null
  });

  const { createProject, loading: isCreating } = useCreateProject();
  const { updateProject, loading: isUpdating } = useUpdateProject();
  const { restoredData, isRestoring, hasProjectId } = useComicProjectRestore(initialRestoredData);

  useEffect(() => {
    if (hasProjectId && restoredData.project && !isRestoring) {
      const { project, references, externalReferences: extRefs, scenes: restoredScenes } = restoredData;
      
      setCurrentProject(project);
      setProjectReferences(references);
      setExternalReferences(extRefs);

      const styleIndex = ART_STYLES.findIndex(
        s => s.apiValue.toLowerCase() === project.artStyle.toLowerCase()
      );

      const foundPageSizeLabel = Object.keys(PAGE_SIZES_MAP).find(key => 
        PAGE_SIZES_MAP[key].width === project.pageSize.width && 
        PAGE_SIZES_MAP[key].height === project.pageSize.height
      );

      setFormData({
        name: project.name,
        genre: project.genre || 'Action',
        language: project.language || 'English',
        description: project.description || '',
        pageSizeLabel: foundPageSizeLabel || '',
        artStyleIndex: styleIndex !== -1 ? styleIndex : 0
      });

      const allRefs = [...references, ...extRefs];
      if (allRefs.length > 0) {
        setSelectedReferenceIds(allRefs.map(r => r.id));
      }

      if (restoredScenes.length > 0) {
        setScenes(restoredScenes);
      }

      setCurrentTimelineStep(0);
    } else if (!hasProjectId && !isRestoring) {
      setCurrentProject(null);
      setProjectReferences([]);
      setExternalReferences([]);
      setFormData({
        name: '',
        genre: '',
        language: '',
        description: '',
        pageSizeLabel: '',
        artStyleIndex: null
      });
      setSelectedReferenceIds([]);
      setScenes([]);
      setCurrentTimelineStep(0);
    }
  }, [hasProjectId, restoredData, isRestoring]);

  const refreshReferences = useCallback(async () => {
    if (!currentProject) return;
    try {
      const data = await referenceService.getAllByProject(Number(currentProject.id));
      const mapped = data
        .map(mapReferenceToDomain)
        .filter(r => r.projectId === Number(currentProject.id));
      setProjectReferences(mapped);
    } catch (error) {
      console.error(error);
    }
  }, [currentProject]);

  const refreshExternalReferences = () => {
    if (!currentProject) return;
    const storageKey = `comic_project_${currentProject.id}_external_refs`;
    const storedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setExternalReferences(prev => prev.filter(ref => storedIds.includes(ref.id)));
    setSelectedReferenceIds(prev => prev.filter(id => 
      projectReferences.some(pr => pr.id === id) || storedIds.includes(id)
    ));
  };

  const handleImportLibrary = async (ids: string[]) => {
    if (!currentProject) return;

    try {
      const newIds = ids.filter(id => 
        !projectReferences.some(r => r.id === id) && 
        !externalReferences.some(r => r.id === id)
      );

      if (newIds.length === 0) return;

      const results = await Promise.all(
        newIds.map(id => referenceService.getById(Number(id)))
      );

      const newRefs = results.map(mapReferenceToDomain);

      setExternalReferences(prev => [...prev, ...newRefs]);

      const storageKey = `comic_project_${currentProject.id}_external_refs`;
      const currentStored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedStored = [...new Set([...currentStored, ...newIds])];
      localStorage.setItem(storageKey, JSON.stringify(updatedStored));

    } catch (error) {
      console.error(error);
    }
  };

  const refreshScenes = useCallback(async () => {
    if (!currentProject) return;
    try {
      const scenesData = await sceneService.getAll(Number(currentProject.id));
      const mappedScenes: SceneType[] = scenesData.map((scene) => ({
        id: String(scene.id),
        prompt: scene.prompt,
        aspectRatio: scene.aspect_ratio,
        shotType: scene.shot_type,
        shotSize: scene.shot_size,
        shotAngle: scene.shot_angle,
        lighting: scene.lighting,
        mood: scene.mood,
        composition: scene.composition,
        characters: scene.character_ids ? scene.character_ids.map(String) : [],
        imageUrl: scene.image_url,
        negativePrompt: scene.negative_prompt,
      }));
      setScenes(mappedScenes);
    } catch (error) {
      console.error(error);
    }
  }, [currentProject]);

  const isFormDirty = useMemo(() => {
    if (!currentProject) return false;
    
    const styleIndex = ART_STYLES.findIndex(
      s => s.apiValue.toLowerCase() === currentProject.artStyle.toLowerCase()
    );
    const currentSize = PAGE_SIZES_MAP[formData.pageSizeLabel];
    
    const isNameChanged = formData.name !== currentProject.name;
    const isGenreChanged = formData.genre !== (currentProject.genre);
    const isLanguageChanged = formData.language !== (currentProject.language || 'English');
    const isDescriptionChanged = formData.description !== (currentProject.description || '');
    const isStyleChanged = formData.artStyleIndex !== styleIndex;
    const isSizeChanged = currentSize && (
      currentSize.width !== currentProject.pageSize.width || 
      currentSize.height !== currentProject.pageSize.height
    );

    return isNameChanged || isGenreChanged || isLanguageChanged || isDescriptionChanged || isStyleChanged || !!isSizeChanged;
  }, [formData, currentProject]);

  const saveAndNavigate = async (targetStep: number) => {
    if (currentProject && isFormDirty) {
      const updatedProject = await updateProject(Number(currentProject.id), formData);
      if (updatedProject) {
        setCurrentProject(updatedProject);
        navigateToStep(targetStep);
      }
    } else {
      navigateToStep(targetStep);
    }
  };

  const navigateToStep = (stepIndex: number) => {
    setCurrentTimelineStep(stepIndex);
    if (stepIndex === 3) refreshScenes();
  };

  const handleCreateOrUpdate = async () => {
    if (currentProject) {
      await saveAndNavigate(currentTimelineStep + 1);
    } else {
      const project = await createProject(formData);
      if (project) {
        setCurrentProject(project);
        setShowSuccessModal(true);
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (currentProject) {
      saveAndNavigate(stepIndex);
    } else if (stepIndex < currentTimelineStep) {
      setCurrentTimelineStep(stepIndex);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigateToStep(1);
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReferenceSelect = (id: string) => {
    setSelectedReferenceIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const currentProgress = (currentTimelineStep / (TIMELINE_STEPS.length - 1)) * 100;
  
  const allDisplayReferences = useMemo(() => 
    [...projectReferences, ...externalReferences], 
  [projectReferences, externalReferences]);

  const renderCurrentSection = () => {
    switch(currentTimelineStep) {
      case 0:
        return (
          <ComicOverview
            key={currentProject ? 'edit' : 'create'}
            formData={formData}
            onInputChange={handleInputChange}
            onCreateOrUpdate={handleCreateOrUpdate}
            currentProgress={currentProgress}
            currentTimelineStep={currentTimelineStep}
            onStepClick={handleStepClick}
            existingProject={currentProject}
            isLoading={isCreating || isUpdating}
          />
        );
      case 1:
        return (
          <ReferencesSetup
            projectId={currentProject ? Number(currentProject.id) : null}
            userId={1}
            references={allDisplayReferences}
            selectedReferenceIds={selectedReferenceIds}
            currentTimelineStep={currentTimelineStep}
            currentProgress={currentProgress}
            onRefresh={refreshReferences}
            onSelectReference={handleReferenceSelect}
            onImportLibrary={handleImportLibrary}
            onUpdateExternalRefs={refreshExternalReferences}
            onNext={() => navigateToStep(2)}
            onStepClick={handleStepClick}
          />
        );
      case 2:
        return (
          <SceneVisualization
            projectId={currentProject ? Number(currentProject.id) : null}
            references={allDisplayReferences}
            selectedReferenceIds={selectedReferenceIds}
            currentTimelineStep={currentTimelineStep}
            currentProgress={currentProgress}
            onNext={() => navigateToStep(3)}
            onStepClick={handleStepClick}
          />
        );
      case 3:
        return (
          <ComicEditor
            visualizations={scenes} 
            projectId={currentProject ? Number(currentProject.id) : null}
            projectName={currentProject?.name}
            onBack={() => setCurrentTimelineStep(2)}
            onNext={() => navigateToStep(4)}
            onPageModified={() => {}} 
          />
        );
      case 4:
        return (
          <ComicReview
            projectId={currentProject ? Number(currentProject.id) : null}
            projectName={currentProject?.name}
            currentProject={currentProject}
            onBack={() => setCurrentTimelineStep(3)}
            currentTimelineStep={currentTimelineStep}
            onStepClick={handleStepClick}
          />
        );
      default:
        return null;
    }
  };

  if (isRestoring) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Restoring your masterpiece...</p>
        </div>
      </div>
    );
  }

  return (
    <EditorProvider>
      <div className="px-4 mx-auto pb-20">
        <SuccessModal 
          isOpen={showSuccessModal} 
          projectName={currentProject?.name || ''} 
          onClose={handleSuccessModalClose} 
        />

        <TopBar 
          showSearch={false}
          showUpgrade={true}
          showNotifications={true}
          pageTitle="Comic Generator"
          pageSubtitle={
            <>
              Turn your ideas into visuals. From lifelike scenes to <br />
              creative comic art, make anything you imagine.
            </>
          }
        />

        <div className="px-15 mx-auto">
          {renderCurrentSection()}
        </div>
      </div>
    </EditorProvider>
  );
};