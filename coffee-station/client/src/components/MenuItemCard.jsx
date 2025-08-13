export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
      <div>
        <h3 className="text/base font-semibold">{item.name}</h3>
        <p className="text-sm text-slate-600">₹ {item.price}</p>
      </div>
      <button className="px-4 py-2 rounded-xl border no-print" onClick={() => onAdd(item)}>Add</button>
    </div>
  );
}
