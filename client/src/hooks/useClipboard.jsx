import { useState, useCallback } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
};
