import { useState, useRef, useCallback, useEffect } from 'react';

const MIME_TYPES = ['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/mp4'];
const getSupportedMime = () => MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || '';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBlob(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mime = getSupportedMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime || 'audio/webm' });
        setAudioBlob(blob);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch (err) {
      setError(err.name === 'NotAllowedError' ? 'Microphone permission denied.' : `Microphone error: ${err.message}`);
    }
  }, []);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    setError(null);
  }, []);

  return { isRecording, audioBlob, recordingTime, error, startRecording, stopRecording, resetRecording };
};
