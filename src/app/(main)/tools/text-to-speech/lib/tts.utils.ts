import { TTSFormData, TTSRequestData } from '@/types/tts';

export const formatSliderValue = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value}`;
};

export const formatPayload = (formData: TTSFormData): TTSRequestData => {
  return {
    title: formData.title,
    input_text: formData.input_text,
    voice_name: formData.voice_name,
    rate: `${formatSliderValue(formData.rate)}%`,
    volume: `${formatSliderValue(formData.volume)}%`,
    pitch: `${formatSliderValue(formData.pitch)}Hz`,
  };
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};