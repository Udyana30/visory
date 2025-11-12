// 🔹 Unit test untuk service komunikasi API STT
import { sttService } from "../../../../../services/sttService";
import apiClient from "../../../../../lib/apiClient";

// Mock apiClient agar tidak benar-benar memanggil server
jest.mock("../../../../../lib/apiClient", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe("sttService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createSTT() memanggil endpoint yang benar dan mengembalikan data", async () => {
    const mockResponse = {
      data: {
        title: "Audio Project",
        output_raw_text: "Hello world",
        input_audio_url: "https://example.com/audio.mp3",
      },
    };

    // 🔹 Simulasikan API success
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const fakeFormData = new FormData();
    fakeFormData.append("file", new Blob(["dummy audio"]), "test.wav");

    const result = await sttService.createSTT(fakeFormData);

    // 🔹 Pastikan endpoint dan header benar
    expect(apiClient.post).toHaveBeenCalledWith(
      "/service/stt/create",
      fakeFormData,
      expect.objectContaining({
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    // 🔹 Verifikasi hasil sesuai mock
    expect(result).toEqual(mockResponse.data);
  });

  test("getSTT() memanggil endpoint default dan mengembalikan data", async () => {
    const mockResponse = { data: [{ id: 1, title: "Sample 1" }] };
    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await sttService.getSTT();

    // 🔹 Verifikasi query string default
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining("/service/stt?order_by=id&order_dir=asc&page=1&limit=10")
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("createSTT() melempar error jika request gagal", async () => {
    // 🔹 Mock API gagal
    (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error("Request failed"));

    const fakeFormData = new FormData();
    fakeFormData.append("file", new Blob(["dummy audio"]), "test.wav");

    // 🔹 Pastikan fungsi melempar error sesuai harapan
    await expect(sttService.createSTT(fakeFormData)).rejects.toThrow("Request failed");
  });
});
