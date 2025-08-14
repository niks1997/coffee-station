import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
  const [token, setToken] = useState(localStorage.getItem('ADMIN_TOKEN') || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmed = token.trim();
    if (!trimmed) {
      setError('Please paste the admin token');
      return;
    }

    // Optional: validate token with /api/admin/ping
    try {
      const res = await fetch(`${API}/api/admin/ping`, {
        headers: { Authorization: `Bearer ${trimmed}` }
      });
      if (!res.ok) {
        setError('Invalid token');
        return;
      }
    } catch {
      // If server not reachable, still save and try to continue (useful in dev)
    }

    localStorage.setItem('ADMIN_TOKEN', trimmed);
    navigate('/admin/orders');
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Admin Login</h2>
        <input
          type="password"
          className="w-full border rounded-xl p-3"
          placeholder="Paste Admin Token"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button className="w-full rounded-xl border px-4 py-2">Enter</button>
        <p className="text-xs text-slate-500">
          Use the token from <code>server/.env</code> — <code>ADMIN_TOKEN</code>.
        </p>
      </form>
    </div>
  );
}
