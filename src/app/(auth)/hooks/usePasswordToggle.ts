import { useState } from 'react';

interface UsePasswordToggleReturn {
  showPassword: boolean;
  togglePassword: () => void;
}

export const usePasswordToggle = (): UsePasswordToggleReturn => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    showPassword,
    togglePassword,
  };
};