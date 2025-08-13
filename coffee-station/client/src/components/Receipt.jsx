import React from 'react';

export default function Receipt({ order, onNew }) {
  const { cart, subtotal, gst, total, orderType, details, phone, payment, placedAt } = order;

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto font-mono text-sm">
      {/* Cafe Name */}
      <h1 className="text-2xl font-bold text-center mb-2">Coffie Station</h1>
      <p className="text-center text-slate-600 mb-4">Thank you for your order!</p>

      {/* Order Info */}
      <div className="mb-4 border-b border-slate-300 pb-2">
        <p><strong>{orderType === 'inside' ? 'Table' : 'Vehicle'}:</strong> {details}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Placed At:</strong> {new Date(placedAt).toLocaleString()}</p>
      </div>

      {/* Items */}
      <div className="mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="pb-1">Item</th>
              <th className="pb-1 text-center">Qty</th>
              <th className="pb-1 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index} className="border-b border-slate-200">
                <td className="py-1">{item.name}</td>
                <td className="py-1 text-center">{item.qty}</td>
                <td className="py-1 text-right">₹ {(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-slate-300 pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (18%):</span>
          <span>₹ {gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="mt-3 border-t border-slate-300 pt-2 space-y-1">
        <p><strong>Payment Method:</strong> {payment.method}</p>
        <p><strong>Status:</strong> {payment.status}</p>
      </div>

      {/* New Order Button */}
      <button
        className="mt-6 w-full px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
        onClick={onNew}
      >
        New Order
      </button>
    </div>
  );
}
