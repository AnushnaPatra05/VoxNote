import { useState, useCallback } from 'react';
import { speechAPI } from '../api/services';

export const useTranscription = () => {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);

  const transcribe = useCallback(async (audioBlob) => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    setError(null);
    try {
      const { data } = await speechAPI.transcribe(audioBlob);
      setTranscript(data.data.transcript);
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Transcription failed.');
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return { transcript, isTranscribing, error, transcribe, clearTranscript };
};
