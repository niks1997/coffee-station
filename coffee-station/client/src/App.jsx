import { useMemo, useState } from 'react';
import OrderTypeSelector from './components/OrderTypeSelector.jsx';
import Cart from './components/Cart.jsx';
import Receipt from './components/Receipt.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import SummaryModal from './components/SummaryModal.jsx';

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
      { id: 7, name: "SPICY COTTAGE CHEESE WRAP", description: "Fresh soft tortilla filled with paneer, Bell Pepper, Jalapeno, Red Onion, Lettuce & Sriracha Mayo", price: 279 },
      { id: 8, name: "PESTO COTTAGE CHEESE WRAP", description: "Fresh soft tortilla filled with marinated Cottage Cheese, Basil Rice, Onion, Lettuce and Garlic Mayo", price: 279 },
      { id: 9, name: "TANDOORI PANEER WRAP", description: "Fresh soft tortilla filled with Tandoori Paneer, Onion, Capsicum, Tomato and Tandoori Mayo", price: 279 },
    ]
  },
  {
    category: "FRIES",
    items: [
      { id: 10, name: "PERI PERI FRIES", description: "", price: 220 },
      { id: 11, name: "SALTED FRIES", description: "", price: 220 },
      { id: 12, name: "CHEESY FRIES", description: "", price: 230 },
    ]
  },
  {
    category: "APPETIZERS - SUPER STARTERS",
    items: [
      { id: 13, name: "MELTING NACHOS", description: "Crispy Tortilla Chips drizzled with Mexican Queso and Salsa", price: 249 },
      { id: 14, name: "FULLY LOADED NACHOS", description: "Nachos Topped with chilli, refried beans, tangy salsa sauce, Jalapenos, Fresh Onions, Capsicum & Cheesy Queso", price: 289 },
      { id: 15, name: "GRILLED QUESADILLAS", description: "Bell pepper, Corn, Cheese, Olives, Jalapenos, Stuffed in grilled Tortillas, served with Salsa and Sour Cream", price: 249 },
      { id: 16, name: "ITALIAN CROSTINI", description: "Italian Plum Tomatoes, Cheese, Olive Oil, Basil topped on sliced French Bread", price: 249 },
      { id: 17, name: "SPICY CRACKLING CORNS", description: "Crispy golden corn tossed in a bold Spicy Thai Style Sauce", price: 249 },
      { id: 18, name: "PESTO PANEER SKILLET", description: "Chargrilled Cottage Cheese tossed with Bell Peppers in the Chef’s Special Creamy Pesto Sauce", price: 320 },
      { id: 19, name: "SAUTEED VEGETABLES", description: "Exotic vegetables tossed in mix spicy herbs & served with garlic bread", price: 299 },
      { id: 20, name: "CORN CHEESE BALL", description: "Mashed corn mixed with cheese, chilli & crumb fried to perfection, served with spicy dip and salsa", price: 299 },
      { id: 21, name: "VEGETABLES & CHEESE BRUSCHETTA", description: "Sliced farmer’s bread topped with exotic veggies, cheese & herbs", price: 279 },
      { id: 22, name: "CHING MAI MUSHROOM", description: "Thai Style Crispy Mushrooms & Bell Peppers tossed in Spicy Ching Mai Sauce", price: 249 },
      { id: 23, name: "SIGNATURE CHEESY GARLIC BREAD", description: "Fresh Italian Loaf topped with Garlic Butter and Speciality Cheese", price: 249 },
    ]
  }
  // ...continue remaining categories exactly like your list
];

export default function App() {
  const [orderType, setOrderType] = useState('inside');
  const [details, setDetails] = useState(''); // table/vehicle
  const [phone, setPhone] = useState('');
  const [cart, setCart] = useState([]);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

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

  // Updated handleCheckout to show summary modal
 function handleCheckout() {
    if (!phone.trim()) {
        alert('Please enter your phone number');
        return;
    }
    if (orderType === 'inside' && !details.trim()) { // Only validate if orderType is 'inside'
        alert('Please enter your table number');
        return;
    }
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }
    setSummaryModalVisible(true);
}

  // Updated payment handler from summary
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
      phone, // Make sure this is E.164: +91XXXXXXXXXX
      payment: { method, status: 'Success' },
      placedAt: new Date().toISOString()
    };

    setConfirmedOrder(newOrder);
    setCart([]);
    setSummaryModalVisible(false);

    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API}/new-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error('Order POST failed', data);
        alert(`Failed to place order: ${data?.error || res.status}`);
        return;
      }

      // Success (even if WhatsApp failed, the order is stored/emitted)
      if (data.whatsappSent) {
        console.log('Order placed! Receipt sent via WhatsApp.');
      } else if (data.reason === 'WhatsApp disabled') {
        console.log('Order placed! (WhatsApp sending is disabled on server.)');
      } else {
        console.log('Order placed! (WhatsApp failed to send; check server logs.)');
      }
    } catch (err) {
      console.error(err);
      console.log('Failed to place order (network error). Make sure the server is running and CORS is allowed.');
    }
  }


  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-md mx-auto">
          <Receipt order={confirmedOrder} onNew={() => setConfirmedOrder(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <header className="max-w-md mx-auto mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Coffie Station</h1>
        <p className="text-slate-600">EATS & ESPRESSOS</p>
      </header>

      <main className="max-w-md mx-auto space-y-6">
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
            <h2 className="text-xl font-bold mb-3">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.description && <p className="text-sm text-slate-600">{item.description}</p>}
                    </div>
                    <span className="font-bold whitespace-nowrap">₹ {item.price}</span>
                  </div>
                  <button
                    className="mt-2 px-4 py-2 rounded-xl border no-print"
                    onClick={() => addItem(item)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Cart cart={cart} onInc={inc} onDec={dec} total={total} onCheckout={handleCheckout} />

        <footer className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} Coffie Station
        </footer>
      </main>

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
    </div>
  );
}