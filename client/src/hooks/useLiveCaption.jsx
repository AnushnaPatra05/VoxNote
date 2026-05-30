import { useState, useRef, useCallback } from 'react';

export const useLiveCaption = () => {
  const [liveTranscript, setLiveTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('Auto');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startLiveCaption = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setDetectedLanguage('Not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = '';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
          if (result[0].lang) setDetectedLanguage(result[0].lang.toUpperCase());
        } else {
          interim += result[0].transcript;
        }
      }

      setLiveTranscript((prev) => (prev + final).trimStart() + (interim ? ` ${interim}` : ''));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopLiveCaption = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const resetLiveCaption = useCallback(() => {
    setLiveTranscript('');
    setDetectedLanguage('Auto');
  }, []);

  return {
    liveTranscript,
    detectedLanguage,
    isListening,
    startLiveCaption,
    stopLiveCaption,
    resetLiveCaption,
  };
};
