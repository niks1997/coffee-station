import React from 'react';

export default function SummaryModal({ cart, orderType, details, phone, onSelect, onClose }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        <div className="mb-4">
          <p><strong>{orderType === 'inside' ? 'Table' : 'Vehicle'}:</strong> {details}</p>
          <p><strong>Phone:</strong> {phone}</p>
        </div>

        <div className="mb-4 space-y-2 max-h-64 overflow-y-auto">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name} x {item.qty}</span>
              <span>₹ {(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-300 pt-4 space-y-1">
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

        <div className="mt-6 flex justify-between">
          <button
            className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              className="px-6 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
              onClick={() => onSelect('cash')}
            >
              Cash
            </button>
            <button
              className="px-6 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => onSelect('online')}
            >
              Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
