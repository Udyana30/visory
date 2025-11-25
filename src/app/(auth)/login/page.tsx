"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { usePasswordToggle } from "../hooks/usePasswordToggle";
import { validateEmail, validatePassword, validateRequiredFields } from "../utils/formValidation";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { ErrorAlert } from "../components/ErrorAlert";
import { Divider } from "../components/Divider";
import { SocialLoginButtons } from "../components/SocialLoginButtons";
import { SuccessModal } from "../components/SuccessModal";

interface LoginFormData {
  email: string;
  password: string;
  [key: string]: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, error } = useAuth();
  const { formData, handleChange } = useForm<LoginFormData>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const { showPassword, togglePassword } = usePasswordToggle();

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

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setFormError(emailValidation.error || "");
      return false;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setFormError(passwordValidation.error || "");
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
      const result = await login(
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        false
      );

      if (result.success) {
        setLoggedInEmail(formData.email.trim());
        setShowSuccessModal(true);
      } else {
        setFormError(result.message || "Login failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleLoginSuccess = async (token: string) => {
    setIsSubmitting(true);
    setFormError("");

    try {
      const result = await googleLogin(token);

      if (result.success) {
        setLoggedInEmail("Google User"); 
        setShowSuccessModal(true);
      } else {
        setFormError(result.message || "Google login failed.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setFormError("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/home");
    }, 350);
  };

  const handleAppleLogin = () => {
    alert("Apple login will be implemented soon");
  };

  return (
    <>
      <div className="w-full flex items-center justify-center px-6">
        <div className="w-full max-w-md py-8">
          <AuthHeader 
            title="Welcome Back"
            subtitle=" " 
          />

          <ErrorAlert message={formError || error || ""} />

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="email"
              name="email"
              type="text"
              placeholder="Username or email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoComplete="email"
            />

            <div>
              <AuthInput
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                autoComplete="current-password"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={togglePassword}
              />
              <div className="text-right mt-3">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <AuthButton
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingText="Logging in..."
            >
              Log in
            </AuthButton>
          </form>

          <Divider />

          <SocialLoginButtons
            onGoogleSuccess={handleGoogleLoginSuccess}
            onAppleClick={handleAppleLogin}
            disabled={isSubmitting}
          />

          <p className="mt-10 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-gray-900 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        userEmail={loggedInEmail}
        title="Welcome Back!"
        message="You've successfully logged in as"
        autoCloseDuration={2500}
      />
    </>
  );
}