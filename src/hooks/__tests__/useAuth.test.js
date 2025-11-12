import { renderHook } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../useAuth";

describe("useAuth Hook", () => {
  test("mengembalikan context jika digunakan di dalam AuthProvider", () => {
    // Mock context yang disediakan oleh AuthProvider
    const mockContext = { user: { id: 1, name: "John" }, login: jest.fn() };

    // renderHook digunakan untuk mengetes custom hook di luar komponen React biasa
    // hook dibungkus oleh Provider agar dapat mengakses context
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockContext}>
          {children}
        </AuthContext.Provider>
      ),
    });

    // Pastikan hook mengembalikan context sesuai yang diberikan oleh Provider
    expect(result.current).toEqual(mockContext);
  });

  test("melempar error jika digunakan di luar AuthProvider", () => {
    // Jika hook dipanggil tanpa Provider, seharusnya throw error
    const renderWithoutProvider = () => renderHook(() => useAuth());

    // Validasi bahwa hook mengeluarkan error sesuai pesan yang diharapkan
    expect(renderWithoutProvider).toThrowError(
      "useAuth must be used within an AuthProvider"
    );
  });
});
