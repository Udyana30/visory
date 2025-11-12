import { render, screen, fireEvent } from "@testing-library/react";
import TtsForm from "@/app/(main)/tools/text-to-speech/sections/TtsForm";

describe("TtsForm Component", () => {
  test("menampilkan field input dengan benar", () => {
    render(<TtsForm isLoading={false} onSubmit={jest.fn()} />);
    // Pastikan field penting muncul
    expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Text to Convert/i)).toBeInTheDocument();
  });

  test("dapat menangani perubahan input teks", () => {
    render(<TtsForm isLoading={false} onSubmit={jest.fn()} />);
    const textarea = screen.getByPlaceholderText(/Enter the text/i);
    fireEvent.change(textarea, { target: { value: "Hello world" } });
    // Verifikasi bahwa input berubah sesuai
    expect(textarea.value).toBe("Hello world");
  });

  test("memanggil onSubmit dengan payload benar", () => {
    const mockSubmit = jest.fn();
    render(<TtsForm isLoading={false} onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Text to Convert/i), {
      target: { value: "Testing AI voice" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Generate Voice/i }));

    // Pastikan fungsi onSubmit dipanggil dengan data input yang benar
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        input_text: "Testing AI voice",
        rate: expect.stringMatching(/\+\d+%/),
      })
    );
  });
});
