import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TextToSpeechPage from "@/app/(main)/tools/text-to-speech/page";
import { ttsService } from "@/services/ttsService";

// Mock service agar tidak memanggil API sungguhan
jest.mock("@/services/ttsService");

describe("TextToSpeechPage Integration", () => {
  test("memanggil ttsService dan memperbarui hasil", async () => {
    // Mock hasil sukses dari createTTS
    ttsService.createTTS.mockResolvedValue({
      data: { title: "AI Voice", public_url: "url", voice_name: "Ardi", created_at: new Date() },
    });

    render(<TextToSpeechPage />);

    // Isi teks dan klik tombol generate
    fireEvent.change(screen.getByLabelText(/Text to Convert/i), {
      target: { value: "Testing TTS" },
    });
    fireEvent.click(screen.getByText(/Generate Voice/i));

    // Tunggu hingga hasil tampil di UI
    await waitFor(() =>
      expect(screen.getByText(/Generation Successful/i)).toBeInTheDocument()
    );
  });
});
