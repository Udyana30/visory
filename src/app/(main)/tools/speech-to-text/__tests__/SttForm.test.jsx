// 🔹 Unit test untuk form input STT
import { render, fireEvent } from "@testing-library/react";
import SttForm from "../sections/SttForm";

describe("SttForm Component", () => {
  beforeAll(() => {
    // Mock URL.createObjectURL agar tidak error di lingkungan test
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
  });

  test("calls onSubmit when form is submitted with valid audio", () => {
    const mockOnSubmit = jest.fn();
    const { container } = render(<SttForm isLoading={false} onSubmit={mockOnSubmit} />);

    // 🔹 Buat file palsu & simulasikan upload
    const file = new File(["dummy audio"], "sample.wav", { type: "audio/wav" });
    const fileInput = container.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 🔹 Isi judul agar form valid
    const titleInput = container.querySelector('input[name="title"]');
    fireEvent.change(titleInput, { target: { value: "Test Project" } });

    // 🔹 Submit form
    const form = container.querySelector("form");
    fireEvent.submit(form);

    // 🔹 Verifikasi callback `onSubmit` dipanggil
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
