import { useMemo, useState } from "react";
import OrderTypeSelector from "./components/OrderTypeSelector.jsx";
import Cart from "./components/Cart.jsx";
import Receipt from "./components/Receipt.jsx";
import SummaryModal from "./components/SummaryModal.jsx";
import { ShoppingCart } from "lucide-react";

// Coffee-themed colors
const bgGradient = "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100";

// Full menu grouped by category
const MENU = [
  {
    category: "SOUPS",
    items: [
      { id: 1, name: "MUSHROOM & THYME SCENTED", description: "Chopped button Mushroom scented with Thyme & enriched with cream", price: 220 },
      { id: 2, name: "BROCCOLLI ALMOND", description: "Three types of greens, enriched with cream, sprinkled with garlic and garnished with almond", price: 220 },
      { id: 3, name: "BURNT GARLIC", description: "Vegetables cooked with the delightful flavour and aroma of Burnt Garlic", price: 230 },
    ]
  },
  {
    category: "WRAPS & ROLLS",
    items: [
      { id: 4, name: "SCHEZWAN CHILLI WRAP", description: "Whole Wheat Bread loaded with spicy Chilli patty, Hot Garlic Sauce, Sliced Onions, Capsicum & Crispy Jalapeno", price: 239 },
      { id: 5, name: "GRILLED MEXICANA", description: "Spicy Mexican Style wrap loaded with Patty, Fries, Refined Beans, Lettuce, Cheddar Cheese, Jalapeno in a whole wheat bread", price: 239 },
      { id: 6, name: "TANDOORI PANEER TIKKA WRAP", description: "Grilled Paneer, Capsicum, Tomato in masala loaded in wrap", price: 249 },
    ]
  },
  {
    category: "FRIES",
    items: [
      { id: 10, name: "PERI PERI FRIES", description: "", price: 220 },
      { id: 11, name: "SALTED FRIES", description: "", price: 220 },
      { id: 12, name: "CHEESY FRIES", description: "", price: 230 },
    ]
  }
];

export default function App() {
  const [orderType, setOrderType] = useState("inside");
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [cart, setCart] = useState([]);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);

  const total = useMemo(() => cart.reduce((sum, it) => sum + it.price * it.qty, 0), [cart]);

  function addItem(item) {
    setCart(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function inc(id) {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  }

  function dec(id) {
    setCart(prev => prev.flatMap(p => p.id === id ? (p.qty > 1 ? [{ ...p, qty: p.qty - 1 }] : []) : [p]));
  }

  function handleCheckout() {
    if (!phone.trim()) return alert("Please enter your phone number");
    if (orderType === "inside" && !details.trim()) return alert("Please enter your table number");
    if (cart.length === 0) return alert("Cart is empty");
    setSummaryModalVisible(true);
  }

  async function handlePaymentSelect(method) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const newOrder = {
      id: Date.now(),
      cart,
      subtotal,
      gst,
      total,
      orderType,
      details,
      phone,
      payment: { method, status: "Success" },
      placedAt: new Date().toISOString()
    };

    setConfirmedOrder(newOrder);
    setCart([]);
    setSummaryModalVisible(false);

    try {
      const API = import.meta.env.VITE_API_URL || "https://coffee-station-4ant.onrender.com/";
      const res = await fetch(`${API}/new-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });

      if (!res.ok) {
        console.error("Order POST failed");
      }
    } catch (err) {
      console.error("Failed to place order", err);
    }
  }

  if (confirmedOrder) {
    return (
      <div className={`${bgGradient} min-h-screen p-4`}>
        <div className="max-w-md mx-auto">
          <Receipt order={confirmedOrder} onNew={() => setConfirmedOrder(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgGradient} min-h-screen p-4`}>
      <header className="max-w-4xl mx-auto mb-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-amber-900">Coffee Station</h1>
        <p className="text-lg text-amber-700">EATS & ESPRESSOS</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <OrderTypeSelector
          orderType={orderType}
          details={details}
          setOrderType={setOrderType}
          setDetails={setDetails}
          phone={phone}
          setPhone={setPhone}
        />

        {MENU.map(section => (
          <div key={section.category}>
            <h2 className="text-2xl font-bold mb-4 text-amber-800">{section.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {section.items.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900">{item.name}</h3>
                    {item.description && <p className="text-sm text-amber-700 mt-1">{item.description}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg text-amber-900">₹ {item.price}</span>
                    <button
                      onClick={() => addItem(item)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 active:scale-95 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Cart cart={cart} onInc={inc} onDec={dec} total={total} onCheckout={handleCheckout} />
      </main>

      {/* Floating Cart Button for mobile */}
      {cart.length > 0 && (
        <button
          onClick={handleCheckout}
          className="fixed bottom-5 right-5 bg-amber-700 text-white p-4 rounded-full shadow-lg sm:hidden flex items-center space-x-2"
        >
          <ShoppingCart />
          <span>{cart.length}</span>
        </button>
      )}

      {summaryModalVisible && (
        <SummaryModal
          cart={cart}
          orderType={orderType}
          details={details}
          phone={phone}
          onSelect={handlePaymentSelect}
          onClose={() => setSummaryModalVisible(false)}
        />
      )}

      <footer className="text-center text-xs text-amber-800 mt-8">
        © {new Date().getFullYear()} Coffee Station
      </footer>
    </div>
  );
}
