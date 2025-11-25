"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { usePasswordToggle } from "../hooks/usePasswordToggle";
import {
  validateEmail,
  validateName,
  validateStrongPassword,
  validatePasswordMatch,
  validateRequiredFields,
} from "../utils/formValidation";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { ErrorAlert } from "../components/ErrorAlert";
import { Divider } from "../components/Divider";
import { SocialLoginButtons } from "../components/SocialLoginButtons";
import { SuccessModal } from "../components/SuccessModal";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { formData, handleChange } = useForm<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { showPassword, togglePassword } = usePasswordToggle();
  const {
    showPassword: showConfirmPassword,
    togglePassword: toggleConfirmPassword,
  } = usePasswordToggle();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    if (formError) setFormError("");
  };

  const validateForm = (): boolean => {
    const requiredValidation = validateRequiredFields(formData);
    if (!requiredValidation.isValid) {
      setFormError(requiredValidation.error || "");
      return false;
    }

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      setFormError(nameValidation.error || "");
      return false;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setFormError(emailValidation.error || "");
      return false;
    }

    const passwordValidation = validateStrongPassword(formData.password);
    if (!passwordValidation.isValid) {
      setFormError(passwordValidation.error || "");
      return false;
    }

    const matchValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (!matchValidation.isValid) {
      setFormError(matchValidation.error || "");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError("");

    try {
      const result = await register(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        },
        false
      );

      if (result.success) {
        setRegisteredEmail(formData.email.trim());
        setShowSuccessModal(true);
      } else {
        setFormError(result.message || "Registration failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/login");
    }, 350);
  };

  const handleGoogleSignup = () => {
    alert("Google signup will be implemented soon");
  };

  const handleAppleSignup = () => {
    alert("Apple signup will be implemented soon");
  };

  return (
    <>
      <div className="w-full flex items-center justify-center px-6">
        <div className="w-full max-w-md py-8">
          <AuthHeader
            title="Create Account"
            subtitle="Join us and start creating amazing videos"
          />

          <ErrorAlert message={formError} />

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoComplete="name"
            />

            <AuthInput
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoComplete="email"
            />

            <AuthInput
              id="password"
              name="password"
              placeholder="Password (min. 8 characters)"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoComplete="new-password"
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={togglePassword}
            />

            <AuthInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoComplete="new-password"
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={toggleConfirmPassword}
            />

            <AuthButton
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingText="Creating account..."
            >
              Sign up
            </AuthButton>
          </form>

          <Divider />

          <SocialLoginButtons
            onGoogleClick={handleGoogleSignup}
            onAppleClick={handleAppleSignup}
            disabled={isSubmitting}
          />

          <p className="mt-10 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gray-900 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        userEmail={registeredEmail}
        title="Account Created!"
        message="You've successfully registered as"
        autoCloseDuration={3000}
      />
    </>
  );
}