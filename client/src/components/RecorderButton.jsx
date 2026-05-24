const pad = (n) => String(n).padStart(2, '0');
const formatTime = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

const RecorderButton = ({ isRecording, recordingTime, onStart, onStop, disabled }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
    <button
      onClick={isRecording ? onStop : onStart}
      disabled={disabled}
      style={{ width: '80px', height: '80px', borderRadius: '50%', background: isRecording ? '#fee2e2' : '#f0fdf4', border: `2px solid ${isRecording ? '#ef4444' : '#22c55e'}`, cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '28px', opacity: disabled ? 0.5 : 1 }}>
      {isRecording ? '⏹' : '🎙'}
    </button>
    <span style={{ fontSize: '13px', color: '#6b7280' }}>
      {isRecording ? `Recording ${formatTime(recordingTime)}` : 'Click to record'}
    </span>
  </div>
);

export default RecorderButton;
