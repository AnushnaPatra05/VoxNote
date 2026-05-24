import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

const AuthPage = () => {
  const { login, signup, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '40px 36px', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎙</div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>VoxNote</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>AI-powered speech to text</p>
        </div>

        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
          {['login', 'signup'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: mode === m ? '#fff' : 'transparent', fontWeight: mode === m ? 600 : 400, cursor: 'pointer', fontSize: '14px', boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '13px', color: '#374151', display: 'block', marginBottom: '4px' }}>Name</label>
              <input name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          )}
          <div>
            <label style={{ fontSize: '13px', color: '#374151', display: 'block', marginBottom: '4px' }}>Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#374151', display: 'block', marginBottom: '4px' }}>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 12px', color: '#dc2626', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ padding: '11px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
