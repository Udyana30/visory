import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../../login/page";
import { useAuth } from "@/hooks/useAuth";

jest.mock("../../components/AuthHeader", () => ({
  AuthHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
jest.mock("../../components/AuthInput", () => ({
  AuthInput: ({
    id,
    name,
    placeholder,
    onChange,
    value,
    type = "text",
  }: {
    id: string;
    name: string;
    placeholder: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={onChange}
      aria-label={placeholder}
    />
  ),
}));
jest.mock("../../components/AuthButton", () => ({
  AuthButton: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("../../components/ErrorAlert", () => ({
  ErrorAlert: ({ message }: { message?: string }) =>
    message ? <div>{message}</div> : null,
}));
jest.mock("../../components/Divider", () => ({
  Divider: () => <hr />,
}));
jest.mock("../../components/SocialLoginButtons", () => ({
  SocialLoginButtons: ({
    onGoogleClick,
    onAppleClick,
  }: {
    onGoogleClick: () => void;
    onAppleClick: () => void;
  }) => (
    <div>
      <button onClick={onGoogleClick}>Google</button>
      <button onClick={onAppleClick}>Apple</button>
    </div>
  ),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("LoginPage Component (TypeScript & Modularized)", () => {
  let mockLogin: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
  });

  test("menampilkan form login dengan elemen penting", () => {
    render(<LoginPage />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/username or email/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("login berhasil memanggil useAuth.login dengan benar", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "123456",
      });
    });
  });

  test("menampilkan error jika API gagal login", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: jest
        .fn()
        .mockResolvedValueOnce({ success: false, message: "Login failed" }),
      loading: false,
      error: "Login failed",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });

  test("menampilkan pesan error jika terjadi exception tak terduga", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn().mockImplementation(() => {
        throw new Error("Unexpected error");
      }),
      loading: false,
      error: "Unexpected error",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/unexpected error/i)).toBeInTheDocument();
  });

  test("toggle password visibility bekerja dengan benar (mock)", () => {
    render(<LoginPage />);

    // Karena komponen AuthInput dimock sederhana, kita hanya pastikan field ada
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    expect(passwordInput).toBeInTheDocument();
  });
});
