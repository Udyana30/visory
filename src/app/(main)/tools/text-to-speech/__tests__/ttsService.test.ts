import apiClient from "@/lib/apiClient";
import { ttsService } from "@/services/ttsService";

// Mock apiClient agar tidak benar-benar melakukan request HTTP
jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

describe("ttsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTTS memanggil API dengan payload benar dan mengembalikan data", async () => {
    const mockResponse = { data: { title: "Test Audio", success: true } };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const payload = { text: "Hello World" };
    const result = await ttsService.createTTS(payload);

    // Pastikan endpoint dan data yang dikirim benar
    expect(apiClient.post).toHaveBeenCalledWith("/service/tts/create", payload);
    // Pastikan hasil sesuai data dari server
    expect(result).toEqual(mockResponse.data);
  });
});
