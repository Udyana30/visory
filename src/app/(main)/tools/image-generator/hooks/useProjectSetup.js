import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  projectName: '',
  scriptDescription: '',
  model: '',
  style: '',
  orientation: '16:9',
  character: '',
  aspectRatio: '16:9',
  gridAmount: '4',
};

export function useProjectSetup() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  }, [errors]);

  const updateMultipleFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.scriptDescription.trim()) {
      newErrors.scriptDescription = 'Script description is required';
    }

    if (!formData.model) {
      newErrors.model = 'Please select a model';
    }

    if (!formData.style) {
      newErrors.style = 'Please select a style';
    }

    if (!formData.character) {
      newErrors.character = 'Please select a character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_STATE);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isLoading,
    setIsLoading,
    updateField,
    updateMultipleFields,
    validateForm,
    resetForm,
  };
}