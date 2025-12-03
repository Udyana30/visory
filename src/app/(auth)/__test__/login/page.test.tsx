import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LoginPage from "../../login/page"; 
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// --- MOCKS & SETUP ---
// Kita memalsukan (mock) modul eksternal dan komponen anak agar pengujian fokus 
// hanya pada logika integrasi di halaman Login (White Box Isolation).

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

// 1. Mock Local Components (Authentication Specific)
// Mengganti komponen UI kompleks dengan div sederhana agar render lebih cepat dan mudah dideteksi.
jest.mock("../../components/AuthHeader", () => ({
  AuthHeader: () => <div data-testid="auth-header">Header</div>,
}));

jest.mock("../../components/ErrorAlert", () => ({
  ErrorAlert: ({ message }: any) => message ? <div data-testid="error-alert">{message}</div> : null,
}));

jest.mock("../../components/SuccessModal", () => ({
  // Menambahkan tombol close manual untuk mensimulasikan user menutup modal
  // atau trigger otomatis 'onClose' yang dibutuhkan untuk logika redirect.
  SuccessModal: ({ isOpen, onClose }: any) => 
    isOpen ? (
      <div data-testid="success-modal">
        Success Modal
        <button data-testid="close-modal" onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../../components/SocialLoginButtons", () => ({
  SocialLoginButtons: () => <div data-testid="social-buttons">Social Buttons</div>,
}));

// 2. Mock UI Components (Input & Button)
jest.mock("../../components/AuthInput", () => ({
  AuthInput: ({ id, value, onChange, placeholder, type, onTogglePassword, showPassword }: any) => {
    // Simulasi Logika Visual: Menentukan type input (text/password) berdasarkan props 'showPassword'.
    // Ini penting agar test case "Toggle Password" bisa berjalan pada komponen Mock.
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

  // [SKENARIO 1] Validasi Input Kosong
  // Tujuan: Memastikan fungsi login TIDAK dipanggil jika form belum lengkap.
  it("Path 1: Menampilkan error validasi jika form dikirim kosong", () => {
    render(<LoginPage />);
    
    // Action: User langsung klik login tanpa mengisi data
    fireEvent.click(screen.getByTestId("auth-button"));

    // Verifikasi Logic: API login tidak boleh terpanggil
    expect(mockLogin).not.toHaveBeenCalled();
    // Verifikasi UI: Pesan error validasi harus muncul
    expect(screen.getByTestId("error-alert")).toHaveTextContent(/please fill in all fields/i);
  });

  // [SKENARIO 2] Login Gagal
  // Tujuan: Memastikan halaman menangani respons error dari API dengan benar.
  it("Path 2: Menangani kegagalan login dari API", async () => {
    // Setup: Mock API mengembalikan status gagal
    mockLogin.mockResolvedValue({ success: false, message: "Login failed." });

    render(<LoginPage />);

    // Action: User mengisi form dengan format yang benar
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password123" } });

    fireEvent.click(screen.getByTestId("auth-button"));

    // Verifikasi State: Tombol harus disabled saat proses loading
    expect(screen.getByTestId("auth-button")).toBeDisabled();

    // Verifikasi UI: Menunggu pesan error muncul dari state error
    const errorAlert = await screen.findByTestId("error-alert");
    expect(errorAlert).toHaveTextContent("Login failed.");
    expect(mockLogin).toHaveBeenCalled();
  });

  // [SKENARIO 3] Login Berhasil
  // Tujuan: Memastikan alur sukses (Modal muncul -> Redirect halaman).
  it("Path 3: Login berhasil, tampilkan modal, dan redirect", async () => {
    // Setup: Mock API mengembalikan status sukses
    mockLogin.mockResolvedValue({ success: true });

    render(<LoginPage />);

    // Action: User mengisi form & submit
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password123" } });

    fireEvent.click(screen.getByTestId("auth-button"));

    // Verifikasi UI: Modal Sukses harus muncul
    const modal = await screen.findByTestId("success-modal");
    expect(modal).toBeInTheDocument();

    // Action: Simulasi menutup modal (memicu logika redirect)
    fireEvent.click(screen.getByTestId("close-modal"));

    // Logic Check: Menjalankan timer (setTimeout) secara manual
    act(() => {
      jest.runAllTimers();
    });

    // Verifikasi Logic: Fungsi router.push harus dipanggil ke '/home'
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  // Logic Toggle Password
  // Tujuan: Memastikan interaksi tombol mata mengubah tipe input.
  it("Logic: Toggle Password Visibility", () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByTestId("input-password");
    const toggleButton = screen.getByTestId("toggle-password");

    // Cek Awal: Type harus password (tersembunyi)
    expect(passwordInput).toHaveAttribute("type", "password");

    // Action: Klik toggle -> Harusnya jadi text
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Action: Klik toggle lagi -> Harusnya kembali jadi password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});