import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useAudioRecorder } from '../hooks/useAudioRecorder.jsx';
import { useTranscription } from '../hooks/useTranscription.jsx';
import RecorderButton from '../components/RecorderButton.jsx';
import TranscriptBox from '../components/TranscriptBox.jsx';
import HistoryPanel from '../components/HistoryPanel.jsx';
import { useLiveCaption } from '../hooks/useLiveCaption.jsx';

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const { isRecording, audioBlob, recordingTime, error: recorderError, startRecording, stopRecording, resetRecording } = useAudioRecorder();
  const { transcript, isTranscribing, error: transcriptError, transcribe, clearTranscript } = useTranscription();
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const {
  liveTranscript,
  detectedLanguage,
  startLiveCaption,
  stopLiveCaption,
} = useLiveCaption();

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    try {
      await transcribe(audioBlob);
      await refreshUser();
      setHistoryRefresh((n) => n + 1);
      resetRecording();
    } catch { }
  };

  const isAtLimit = user?.planType === 'free' && user?.usageCount >= 10;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }`}</style>

      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>🎙</span>
          <span style={{ fontWeight: 700, fontSize: '18px' }}>VoxNote</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>{user?.name}</span>
          {user?.planType === 'free' && <span style={{ fontSize: '12px', color: '#9ca3af' }}>{user?.usageCount}/10 today</span>}
          <button onClick={logout} style={{ fontSize: '13px', color: '#6b7280', background: 'none', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 700 }}>Speech to Text</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
  Record audio and get instant AI transcription
</p>

<p
  style={{
    marginTop: '8px',
    fontSize: '13px',
    color: '#6366f1',
    fontWeight: 600,
  }}
>
  🌐 Language: {detectedLanguage}
</p>
        </div>

        {isAtLimit && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', color: '#dc2626', fontSize: '14px' }}>
            ⚡ Daily limit reached. Upgrade to Pro for unlimited transcriptions.
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <RecorderButton
  isRecording={isRecording}
  recordingTime={recordingTime}
  onStart={() => {
    startRecording();
    startLiveCaption();
  }}
  onStop={() => {
    stopRecording();
    stopLiveCaption();
  }}
  disabled={isTranscribing || isAtLimit}
/>

          {recorderError && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{recorderError}</p>}

          {audioBlob && !isRecording && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <audio controls src={URL.createObjectURL(audioBlob)} style={{ width: '100%', maxWidth: '400px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleTranscribe} disabled={isTranscribing || isAtLimit}
                  style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  {isTranscribing ? 'Transcribing…' : '✨ Transcribe'}
                </button>
                <button onClick={() => { resetRecording(); clearTranscript(); }}
                  style={{ padding: '10px 16px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>

        <TranscriptBox
  transcript={
    isRecording
      ? liveTranscript
      : transcript || liveTranscript
  }
  isLoading={isTranscribing}
  error={transcriptError}
/>
        <HistoryPanel refreshTrigger={historyRefresh} />
      </main>
    </div>
  );
};

export default Dashboard;
