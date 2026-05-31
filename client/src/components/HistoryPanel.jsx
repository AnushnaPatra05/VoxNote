import { useState, useEffect, useCallback } from 'react';
import { transcriptAPI } from '../api/services';
import { useClipboard } from '../hooks/useClipboard.jsx';

const HistoryPanel = ({ refreshTrigger }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { copy } = useClipboard();

  const fetchHistory = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const { data } = await transcriptAPI.getAll(p, 10);
      setTranscripts(data.data);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(page); }, [page, refreshTrigger, fetchHistory]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await transcriptAPI.delete(id);
      setTranscripts((prev) => prev.filter((t) => t._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>History</h3>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>{pagination?.total ?? 0} transcripts</span>
      </div>
      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading…</p>
      ) : transcripts.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '14px', fontStyle: 'italic' }}>No transcripts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transcripts.map((t) => (
            <li key={t._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(t.createdAt).toLocaleString()}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => copy(t.transcript)} style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer', background: '#fff' }}>Copy</button>
                  <button onClick={() => handleDelete(t._id)} disabled={deletingId === t._id} style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fca5a5', color: '#ef4444', cursor: 'pointer', background: '#fff' }}>
                    {deletingId === t._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                {t.transcript.length > 120 ? `${t.transcript.slice(0, 120)}…` : t.transcript}
              </p>
            </li>
          ))}
        </ul>
      )}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', background: '#fff' }}>← Prev</button>
          <span style={{ fontSize: '13px', color: '#6b7280', alignSelf: 'center' }}>{page} / {pagination.pages}</span>
          <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', background: '#fff' }}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
