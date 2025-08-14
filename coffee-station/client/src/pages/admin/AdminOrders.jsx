import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const NS = import.meta.env.VITE_ADMIN_SOCKET_NS || '/admin';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  READY: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const NEXT_ACTIONS = ['IN_PROGRESS','READY','COMPLETED','CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('ADMIN_TOKEN');

  useEffect(() => {
    if (!token) navigate('/admin');
  }, [token, navigate]);

  // Load existing orders
  useEffect(() => {
    if (!token) return;

    fetch(`${API}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('ADMIN_TOKEN');
          navigate('/admin');
          return [];
        }
        return res.json();
      })
      .then(data => setOrders(Array.isArray(data) ? data : data?.orders || []))
      .catch(console.error);
  }, [token, navigate]);

  // Listen for new orders via socket
  useEffect(() => {
    const socket = io(`${API}${NS}`, { transports: ['websocket'] });
    socket.on('connect', () => console.log('Admin socket connected'));
    socket.on('order-received', (order) => {
      setOrders(prev => [order, ...prev]);
    });
    return () => socket.disconnect();
  }, []);

  // Update order status
  async function updateStatus(id, status) {
    const res = await fetch(`${API}/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('ADMIN_TOKEN');
      navigate('/admin');
      return;
    }

    const updated = await res.json();
    setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
  }

  const counts = useMemo(() => {
    const c = { PENDING:0, IN_PROGRESS:0, READY:0, COMPLETED:0, CANCELLED:0 };
    orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(counts).map(([k,v]) => (
          <div key={k} className="bg-white rounded-2xl shadow p-4">
            <div className="text-xs text-slate-500">{k}</div>
            <div className="text-2xl font-bold">{v}</div>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Orders</h2>
          <div className="text-sm text-slate-500">{orders.length} total</div>
        </div>

        <div className="divide-y">
          {orders.map(o => (
            <div key={o.id} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Order ID and time */}
              <div className="md:col-span-2">
                <div className="font-semibold">#{o.id}</div>
                <div className="text-xs text-slate-500">
                  {new Date(o.placedAt || o.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Customer info */}
              <div className="md:col-span-3">
                <div className="text-sm">
                  {o.orderType === 'inside' ? `Table ${o.details}` : `Vehicle ${o.details}`}
                </div>
                <div className="text-xs text-slate-500">{o.phone}</div>
              </div>

              {/* Items */}
              <div className="md:col-span-3 text-sm">
                {o.cart.map(it => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.name} x{it.qty}</span>
                    <span>₹{(it.price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-1 border-t pt-1 text-xs text-slate-500">
                  Subtotal ₹{o.subtotal.toFixed(2)} • GST ₹{o.gst.toFixed(2)} •
                  Total <span className="font-semibold">₹{o.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${STATUS_COLORS[o.status] || ''}`}
                >
                  {o.status}
                </span>
              </div>

              {/* Actions */}
              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {NEXT_ACTIONS.map(a => (
                    <button
                      key={a}
                      onClick={() => updateStatus(o.id, a)}
                      className="text-xs px-3 py-1 rounded-xl border"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-slate-500">No orders yet…</div>
          )}
        </div>
      </div>
    </div>
  );
}
