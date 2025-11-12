// React Testing Library (RTL) || Jest DOM || Mocking
import authService from "../authService";
import apiClient from "../../lib/apiClient";

jest.mock("../../lib/apiClient");

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("login() menyimpan token dan user ke localStorage", async () => {
    // Simulasi respons dari API login
    const mockResponse = {
      data: {
        access_token: "abc123",
        user: { id: 1, name: "John Doe" },
      },
    };

    // Mock response dari apiClient.post
    apiClient.post.mockResolvedValueOnce(mockResponse);

    // Jalankan fungsi login dari service
    const credentials = { email: "john@example.com", password: "123456" };
    const result = await authService.login(credentials);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", credentials);
    expect(localStorage.getItem("access_token")).toBe("abc123");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({
      id: 1,
      name: "John Doe",
    });

    // Hasil fungsi login harus mengembalikan data yang sama dengan dari server
    expect(result).toEqual(mockResponse.data);
  });

  test("logout() menghapus token dan user dari localStorage", () => {
    localStorage.setItem("access_token", "abc123");
    localStorage.setItem("user", JSON.stringify({ id: 1 }));

    authService.logout();

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("getCurrentUser() mengembalikan user yang tersimpan", () => {
    const user = { id: 2, name: "Alice" };
    localStorage.setItem("user", JSON.stringify(user));

    const result = authService.getCurrentUser();

    // Mengembalikan data user sesuai penyimpanan
    expect(result).toEqual(user);
  });

  test("getCurrentUser() mengembalikan null jika data rusak", () => {
    // Simulasi data rusak (JSON tidak valid)
    localStorage.setItem("user", "{invalid-json");

    const result = authService.getCurrentUser();

    // Mengembalikan null agar app tidak crash
    expect(result).toBeNull();
  });
});
