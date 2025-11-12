// 🔹 Import tools testing & komponen utama STT Page
import { render, fireEvent, waitFor } from "@testing-library/react";
import SttPage from "../page";
import { sttService } from "../../../../../services/sttService";

// 🔹 Mock service supaya tidak memanggil API asli
jest.mock("../../../../../services/sttService", () => ({
  sttService: { createSTT: jest.fn() },
}));

// 🔹 Mock router Next.js agar tidak benar-benar melakukan navigasi
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("STTPage Integration", () => {
  beforeAll(() => {
    // Siapkan fungsi global yang tidak ada di lingkungan test (JSDOM)
    global.alert = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
  });

  test("calls sttService and updates result", async () => {
    // 🔹 Mock respons API yang sukses
    sttService.createSTT.mockResolvedValue({
      title: "Audio Project",
      output_raw_text: "Speech recognized successfully",
      input_audio_url: "https://example.com/audio.mp3",
    });

    const { container } = render(<SttPage />);

    // 🔹 Ambil form dari DOM
    const form = container.querySelector("form");
    expect(form).not.toBeNull();

    // 🔹 Simulasikan user memilih file dan mengisi judul
    const fileInput = container.querySelector('input[type="file"]');
    const titleInput = container.querySelector('input[name="title"]');
    const file = new File(["audio"], "sample.wav", { type: "audio/wav" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(titleInput, { target: { value: "My Audio" } });

    // 🔹 Submit form
    fireEvent.submit(form);

    // 🔹 Pastikan fungsi service dipanggil → menandakan integrasi berhasil
    await waitFor(() => {
      expect(sttService.createSTT).toHaveBeenCalled();
    });
  });
});
