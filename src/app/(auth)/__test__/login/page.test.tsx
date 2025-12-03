import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LoginPage from "../../login/page"; 
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// --- MOCKS & SETUP ---

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

// Mock path absolute/alias untuk menghindari error module not found
jest.mock("@/app/(auth)/components/AuthHeader", () => ({
  AuthHeader: () => <div data-testid="auth-header">Header</div>,
}), { virtual: true });

jest.mock("../../components/AuthHeader", () => ({
  AuthHeader: () => <div data-testid="auth-header">Header</div>,
}));

// Mock AuthInput: Perlu logika sederhana untuk menangani prop 'type' 
jest.mock("../../components/AuthInput", () => ({
  AuthInput: ({ id, value, onChange, placeholder, type, onTogglePassword, showPassword }: any) => {
    let effectiveType = type;
    if (typeof showPassword === 'boolean') {
        effectiveType = showPassword ? 'text' : 'password';
    }
    return (
      <div>
        <input
          data-testid={`input-${id}`}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={effectiveType} 
        />
        {onTogglePassword && (
          <button type="button" data-testid="toggle-password" onClick={onTogglePassword}>
            Toggle
          </button>
        )}
      </div>
    );
  },
}));

jest.mock("../../components/AuthButton", () => ({
  AuthButton: ({ children, onClick, type, disabled, isLoading }: any) => (
    <button data-testid="auth-button" type={type} onClick={onClick} disabled={disabled}>
      {isLoading ? "Loading..." : children}
    </button>
  ),
}));

// Mock SuccessModal: Menambahkan tombol close manual untuk memicu logika redirect di Page.
jest.mock("../../components/SuccessModal", () => ({
  SuccessModal: ({ isOpen, onClose }: any) => 
    isOpen ? (
      <div data-testid="success-modal">
        Success Modal
        <button data-testid="close-modal" onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../../components/ErrorAlert", () => ({
  ErrorAlert: ({ message }: any) => (message ? <div data-testid="error-alert">{message}</div> : null),
}));

// Mock SocialLoginButtons: Menghindari error GoogleOAuthProvider
jest.mock("../../components/SocialLoginButtons", () => ({
  SocialLoginButtons: () => <div data-testid="social-buttons">Social Buttons</div>,
}));

// --- TEST SUITE ---

describe("White Box Testing - Login Page", () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      googleLogin: jest.fn(),
      error: null,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // --- PATH 1: VALIDASI INPUT KOSONG ---
  // Skenario: User submit tanpa data -> Sistem validasi internal mencegah API call.
  it("Path 1: Menampilkan error validasi jika form dikirim kosong", () => {
    render(<LoginPage />);
    
    // 1. Trigger Submit tanpa isi form
    fireEvent.click(screen.getByTestId("auth-button"));

    // 2. Verifikasi Logic: API Login TIDAK boleh dipanggil
    expect(mockLogin).not.toHaveBeenCalled();
    
    // 3. Verifikasi UI: Pesan validasi muncul
    expect(screen.getByTestId("error-alert")).toHaveTextContent(/please fill in all fields/i);
  });

  // --- PATH 2: LOGIN GAGAL (API) ---
  // Skenario: Input valid -> API melempar error -> Pesan error API ditampilkan.
  it("Path 2: Menangani kegagalan login dari API", async () => {
    // 1. Setup Mock: API mengembalikan status gagal
    mockLogin.mockResolvedValue({ success: false, message: "Login failed." });

    render(<LoginPage />);

    // 2. User mengisi form dengan data (format benar)
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password123" } });

    // 3. Trigger Submit
    fireEvent.click(screen.getByTestId("auth-button"));

    // 4. Verifikasi State: Tombol disabled saat loading
    expect(screen.getByTestId("auth-button")).toBeDisabled();

    // 5. Verifikasi UI (Async): Tunggu alert muncul
    const errorAlert = await screen.findByTestId("error-alert");
    expect(errorAlert).toHaveTextContent("Login failed.");
    expect(mockLogin).toHaveBeenCalled();
  });

  // --- PATH 3: LOGIN BERHASIL ---
  // Skenario: Input valid -> API Sukses -> Modal Muncul -> Redirect ke Dashboard.
  it("Path 3: Login berhasil, tampilkan modal, dan redirect", async () => {
    // 1. Setup Mock: API mengembalikan status sukses
    mockLogin.mockResolvedValue({ success: true });

    render(<LoginPage />);

    // 2. User mengisi form
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password123" } });

    // 3. Trigger Submit
    fireEvent.click(screen.getByTestId("auth-button"));

    // 4. Verifikasi UI: Modal Sukses harus muncul
    const modal = await screen.findByTestId("success-modal");
    expect(modal).toBeInTheDocument();

    // 5. Simulasi Redirect: User/System menutup modal
    fireEvent.click(screen.getByTestId("close-modal"));

    // 6. Percepat waktu (skip setTimeout 350ms)
    act(() => {
      jest.runAllTimers();
    });

    // 7. Verifikasi Logic: Router push dipanggil ke /home
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  // --- LOGIC UI TAMBAHAN ---
  it("Logic: Toggle Password Visibility", () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByTestId("input-password");
    const toggleButton = screen.getByTestId("toggle-password");

    // Cek state awal (password hidden)
    expect(passwordInput).toHaveAttribute("type", "password");

    // Klik toggle -> jadi text
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Klik toggle lagi -> jadi password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});