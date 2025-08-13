export default function Cart({ cart, onInc, onDec, total, onCheckout, disabled }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 sticky bottom-0">
      <h2 className="text-lg font-semibold mb-3">Your Order</h2>
      {cart.length === 0 ? (
        <p className="text-slate-600">Add items to get started.</p>
      ) : (
        <div className="space-y-2">
          {cart.map(it => (
            <div key={it.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{it.name}</p>
                <p className="text-sm text-slate-600">₹ {it.price} × {it.qty}</p>
              </div>
              <div className="flex items-center gap-2 no-print">
                <button className="px-3 py-1 border rounded-xl" onClick={() => onDec(it.id)}>-</button>
                <span>{it.qty}</span>
                <button className="px-3 py-1 border rounded-xl" onClick={() => onInc(it.id)}>+</button>
              </div>
              <div className="w-20 text-right font-semibold">₹ {it.price * it.qty}</div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-semibold">Total</span>
            <span className="font-bold">₹ {total}</span>
          </div>
          <button
            className="w-full py-3 rounded-2xl bg-black text-white no-print"
            onClick={onCheckout}
            disabled={disabled}
          >Proceed to Pay</button>
        </div>
      )}
    </div>
  );
}
