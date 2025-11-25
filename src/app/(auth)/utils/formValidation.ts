export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
  
export const validateEmail = (email: string): ValidationResult => {
    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  
    return { isValid: true };
};
  
export const validatePassword = (
    password: string,
    minLength: number = 6
  ): ValidationResult => {
    if (!password.trim()) {
      return { isValid: false, error: 'Password is required' };
    }
  
    if (password.length < minLength) {
      return {
        isValid: false,
        error: `Password must be at least ${minLength} characters`,
      };
    }
  
    return { isValid: true };
};
  
export const validateStrongPassword = (password: string): ValidationResult => {
    const basicValidation = validatePassword(password, 8);
    if (!basicValidation.isValid) {
      return basicValidation;
    }
  
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        error: 'Password must contain uppercase, lowercase, and number',
      };
    }
  
    return { isValid: true };
};
  
export const validatePasswordMatch = (
    password: string,
    confirmPassword: string
  ): ValidationResult => {
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }
  
    return { isValid: true };
};
  
export const validateName = (name: string, minLength: number = 2): ValidationResult => {
    if (!name.trim()) {
      return { isValid: false, error: 'Name is required' };
    }
  
    if (name.trim().length < minLength) {
      return {
        isValid: false,
        error: `Name must be at least ${minLength} characters long`,
      };
    }
  
    return { isValid: true };
};
  
export const validateRequiredFields = (fields: Record<string, string>): ValidationResult => {
    const emptyFields = Object.entries(fields).filter(([_, value]) => !value.trim());
    
    if (emptyFields.length > 0) {
      return { isValid: false, error: 'Please fill in all fields' };
    }
  
    return { isValid: true };
};