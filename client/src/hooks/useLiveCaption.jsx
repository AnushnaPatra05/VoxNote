import { useState, useRef, useCallback } from 'react';

export const useLiveCaption = () => {
  const [liveTranscript, setLiveTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('Auto');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const activeRef = useRef(false);
  const finalRef = useRef('');

  const startLiveCaption = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setDetectedLanguage('Not supported'); return; }

    activeRef.current = true;
    finalRef.current = '';

    const createAndStart = () => {
      if (!activeRef.current) return;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = '';

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalRef.current += result[0].transcript + ' ';
            if (result[0].lang) setDetectedLanguage(result[0].lang.toUpperCase());
          } else {
            interim += result[0].transcript;
          }
        }
        setLiveTranscript(finalRef.current + interim);
      };

      recognition.onerror = (e) => {
        if (e.error === 'no-speech' && activeRef.current) { recognition.stop(); return; }
        if (e.error === 'aborted') return;
        setIsListening(false);
      };

      recognition.onend = () => {
        if (activeRef.current) setTimeout(createAndStart, 200);
        else setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    };

    createAndStart();
  }, []);

  const stopLiveCaption = useCallback(() => {
    activeRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const resetLiveCaption = useCallback(() => {
    finalRef.current = '';
    setLiveTranscript('');
    setDetectedLanguage('Auto');
  }, []);

  return { liveTranscript, detectedLanguage, isListening, startLiveCaption, stopLiveCaption, resetLiveCaption };
};
