import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('ADMIN_TOKEN');
    if (!token) navigate('/admin');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="p-4 shadow bg-white flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coffee Station • Admin</h1>
        <button
          className="text-sm px-3 py-1 rounded border"
          onClick={() => { localStorage.removeItem('ADMIN_TOKEN'); navigate('/admin'); }}
        >
          Logout
        </button>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
