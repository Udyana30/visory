import { renderHook } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../useAuth";

describe("useAuth Hook", () => {
  test("mengembalikan context jika digunakan di dalam AuthProvider", () => {
    const mockContext = { user: { id: 1, name: "John" }, login: jest.fn() };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockContext}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current).toEqual(mockContext);
  });

  test("melempar error jika digunakan di luar AuthProvider", () => {
    const renderWithoutProvider = () => renderHook(() => useAuth());

    expect(renderWithoutProvider).toThrowError(
      "useAuth must be used within an AuthProvider"
    );
  });
});
