import { render, screen, fireEvent } from '@testing-library/react';
import HistorySection from '@/app/(main)/tools/speech-to-text/sections/HistorySection';
import { STTHistoryItem } from '@/types/stt';

// Mock Data History
const mockHistory: STTHistoryItem[] = [
  {
    id: 1,
    title: 'Project A',
    language: 'id',
    created_at: new Date().toISOString(),
    output_raw_text: 'Tes 123',
    input_audio_url: '',
    minio_bucket_name: '',
    input_minio_file_path: '',
    output_minio_file_path: '',
    output_srt_url: '',
    last_generated_url: ''
  },
  {
    id: 2,
    title: 'Project B',
    language: 'en',
    created_at: new Date().toISOString(),
    output_raw_text: 'Test 456',
    input_audio_url: '',
    minio_bucket_name: '',
    input_minio_file_path: '',
    output_minio_file_path: '',
    output_srt_url: '',
    last_generated_url: ''
  }
];

describe('White Box - HistorySection', () => {
  const mockOnPlay = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test Loading State
  it('renders loading spinner when isLoading is true', () => {
    render(
      <HistorySection 
        history={[]} 
        isLoading={true} 
        onPlay={mockOnPlay} 
      />
    );
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText(/history/i)).toBeInTheDocument();
  });

  // 2. Test Empty State
  it('renders empty message when history is empty', () => {
    render(
      <HistorySection 
        history={[]} 
        isLoading={false} 
        onPlay={mockOnPlay} 
      />
    );
    expect(screen.getByText(/no history yet/i)).toBeInTheDocument();
  });

  // 3. Test Data Rendering
  it('renders list of history items correctly', () => {
    render(
      <HistorySection 
        history={mockHistory} 
        isLoading={false} 
        onPlay={mockOnPlay} 
        onDelete={mockOnDelete}
      />
    );

    // Cek item muncul
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
    
    // Cek jumlah item (2 items + header text = mungkin ada multiple 'items' text)
    expect(screen.getAllByText(/language:/i)).toHaveLength(2);
  });

  // 4. Test Interaction (Play & Delete)
  it('handles play and delete actions', () => {
    render(
      <HistorySection 
        history={mockHistory} 
        isLoading={false} 
        onPlay={mockOnPlay} 
        onDelete={mockOnDelete}
      />
    );

    // Klik Item (Play) - Asumsi klik card memicu onPlay
    fireEvent.click(screen.getByText('Project A').closest('div')!); 
    // Note: .closest('div') mencari parent div card yang clickable
    
    expect(mockOnPlay).toHaveBeenCalledWith(mockHistory[0]);

    const deleteBtns = screen.getAllByTitle('Delete');
    fireEvent.click(deleteBtns[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockHistory[0].id);
  });
});