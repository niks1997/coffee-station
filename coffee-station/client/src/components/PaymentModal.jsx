export default function PaymentModal({ visible, onClose, onSelect }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Select Payment Method</h2>
        <div className="space-y-3">
          <button
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-lg"
            onClick={() => onSelect('Cash')}
          >
            Cash
          </button>
          <button
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg"
            onClick={() => onSelect('Online Payment')}
          >
            Online Payment
          </button>
        </div>
        <button
          className="mt-4 w-full py-2 rounded-xl border border-gray-400 text-gray-600"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
