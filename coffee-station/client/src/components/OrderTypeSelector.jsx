export default function OrderTypeSelector({ orderType, details, setOrderType, setDetails, phone, setPhone }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="flex space-x-2">
        <button
          className={`flex-1 py-2 rounded-xl ${orderType === 'inside' ? 'bg-black text-white' : 'bg-slate-100'}`}
          onClick={() => { setOrderType('inside'); setDetails(''); }}
        >
          Inside Cafe
        </button>
        <button
          className={`flex-1 py-2 rounded-xl ${orderType === 'outside' ? 'bg-black text-white' : 'bg-slate-100'}`}
          onClick={() => { setOrderType('outside'); setDetails(''); }}
        >
          Outside Cafe
        </button>
      </div>

      {orderType === 'inside' ? (
        <div>
          <label className="block text-sm font-medium mb-1">Table Number</label>
          <select
            className="w-full border rounded-xl p-2"
            value={details}
            onChange={e => setDetails(e.target.value)}
            required
          >
            <option value="">Select Table</option>
            {[...Array(10)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Number</label>
          <input
            type="text"
            className="w-full border rounded-xl p-2"
            placeholder="Enter Vehicle Number"
            value={details}
            onChange={e => setDetails(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <div className="flex items-center border rounded-xl p-2">
          <span className="mr-2 text-slate-600">+91</span>
          <input
            type="tel"
            className="flex-1 outline-none"
            placeholder="10-digit number"
            value={phone}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhone(val);
            }}
            maxLength={10}
            required
          />
        </div>
      </div>
    </div>
  );
}
