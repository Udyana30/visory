import { render, screen } from "@testing-library/react";
import ResultDisplay from "@/app/(main)/tools/text-to-speech/sections/ResultDisplay";

describe("ResultDisplay Component", () => {
  test("menampilkan loading state", () => {
    render(<ResultDisplay isLoading={true} error={null} result={null} />);
    // Saat proses TTS sedang berjalan
    expect(screen.getByText(/Generating audio/i)).toBeInTheDocument();
  });

  test("menampilkan pesan error", () => {
    render(<ResultDisplay isLoading={false} error="Server Error" result={null} />);
    // Jika terjadi error
    expect(screen.getByText(/Server Error/i)).toBeInTheDocument();
  });

  test("menampilkan hasil audio saat sukses", () => {
    const mockResult = {
      title: "Demo Voice",
      public_url: "https://example.com/audio.mp3",
      voice_name: "Ardi",
      created_at: new Date().toISOString(),
    };
    render(<ResultDisplay isLoading={false} error={null} result={mockResult} />);

    // Pastikan judul dan elemen audio muncul
    expect(screen.getByText(/Demo Voice/i)).toBeInTheDocument();
    const audioEl = document.querySelector("audio");
    expect(audioEl).toBeInTheDocument();
    expect(audioEl).toHaveAttribute("src", mockResult.public_url);
  });
});
