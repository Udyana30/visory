// 🔹 Unit test komponen hasil transkripsi
import { render, screen } from "@testing-library/react";
import ResultDisplay from "../sections/ResultDisplay";

describe("ResultDisplay Component", () => {
  test("shows success result", () => {
    // Mock data hasil transkripsi
    const result = {
      title: "Test Audio",
      output_raw_text: "Hello world",
      input_audio_url: "https://example.com/audio.mp3",
      output_srt_url: "https://example.com/subtitle.srt",
      language: "en",
      created_at: new Date(),
    };

    render(<ResultDisplay isLoading={false} error={null} result={result} />);

    // 🔹 Verifikasi teks & audio muncul sesuai hasil transkripsi
    expect(screen.getByText(/Test Audio/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello world/i)).toBeInTheDocument();

    // 🔹 Audio harus dirender dengan URL benar
    const audioEl = document.querySelector("audio");
    expect(audioEl).toBeTruthy();
    expect(audioEl.src).toContain("example.com/audio.mp3");
  });
});
