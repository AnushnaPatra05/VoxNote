import { useClipboard } from '../hooks/useClipboard.jsx';

const TranscriptBox = ({ transcript, isLoading, error }) => {
  const { copied, copy } = useClipboard();
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Transcript</span>
        {transcript && (
          <button onClick={() => copy(transcript)} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: copied ? '#dcfce7' : '#fff', color: copied ? '#16a34a' : '#374151', cursor: 'pointer' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div style={{ padding: '16px', minHeight: '120px' }}>
        {isLoading && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6b7280' }}><div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><span style={{ fontSize: '14px' }}>Transcribing with Whisper AI…</span></div>}
        {!isLoading && error && <p style={{ color: '#ef4444', fontSize: '14px' }}>⚠️ {error}</p>}
        {!isLoading && !error && transcript && <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#111827', margin: 0 }}>{transcript}</p>}
        {!isLoading && !error && !transcript && <p style={{ color: '#9ca3af', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>Your transcript will appear here…</p>}
      </div>
    </div>
  );
};

export default TranscriptBox;
