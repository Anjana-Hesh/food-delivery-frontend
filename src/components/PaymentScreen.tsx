import { useState, useEffect, useMemo } from 'react';
import { CreditCard, ShieldCheck, ShieldAlert, RefreshCw, ShoppingCart, Plus, Trash2, Search } from 'lucide-react';
import { fetchPaymentLogs, processPayment, fetchFoodItems, createOrder } from '../api';
import type { FoodItem } from '../types';
import "../App.css";

interface BillingLog {
  id: number;
  orderId: string;
  customerName: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
}

export const PaymentScreen = () => {
  const [customerName, setCustomerName] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ item: FoodItem; quantity: number }[]>([]);

  const [logs, setLogs] = useState<BillingLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchPaymentLogs();
      setLogs(data);
    } catch (err) {
      console.log("Error loading billing logs. Standalone mode.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    fetchFoodItems()
      .then(setFoodItems)
      .catch(err => console.error("Error fetching food items:", err));
  }, []);

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [foodItems, searchQuery]);

  const handleAddItemToCart = () => {
    if (!selectedItemId) return;
    const item = foodItems.find(i => i.id === selectedItemId);
    if (!item) return;

    const existingIndex = cart.findIndex(c => c.item.id === selectedItemId);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += itemQuantity;
      setCart(newCart);
    } else {
      setCart([...cart, { item, quantity: itemQuantity }]);
    }
    setSelectedItemId('');
    setItemQuantity(1);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(c => c.item.id !== id));
  };

  const totalCartAmount = useMemo(() => {
    return cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  }, [cart]);

  const handleCreateOrderAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName) return;

    setProcessing(true);
    setPaymentStatus(null);

    const itemsString = cart.map(c => `${c.item.name} (x${c.quantity})`).join(', ');

    try {
      // 1. Create order
      const orderRes = await createOrder(customerName, itemsString, totalCartAmount);
      const orderIdString = `ORD-${orderRes.id}`;

      // 2. Process payment immediately
      const paymentRes = await processPayment(orderIdString, totalCartAmount, customerName);

      if (paymentRes.success) {
        setPaymentStatus({ success: true, msg: `Order ${orderIdString} Created & Paid successfully! Transaction ID: ${paymentRes.transactionId}` });
        setCart([]);
        setCustomerName('');
      } else {
        setPaymentStatus({ success: false, msg: `Order Created (${orderIdString}) but Payment Denied: ${paymentRes.message}` });
      }
      loadLogs();
    } catch (err) {
      console.error(err);
      setPaymentStatus({ success: false, msg: "Failed to connect to gateway API." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1500px] mx-auto space-y-0">
      
      {/* Left Form card */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block bg-orange-500/10 rounded-2xl border border-orange-500/20 p-3 shadow-md">
            <ShoppingCart className="w-8 h-8 text-orange-400 mx-auto text-glow-orange" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">Place Order & Pay</h2>
          <p className="text-xs text-slate-400">Select items from catalog to place order and process billing</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-5 shadow-xl">
          <form onSubmit={handleCreateOrderAndPay} className="space-y-5">
            {/* Customer name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Name</label>
              <input 
                type="text" 
                placeholder="Enter customer name"
                value={customerName} 
                onChange={e => setCustomerName(e.target.value)} 
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300" 
                required 
              />
            </div>

            {/* Cart item add section */}
            <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5 space-y-3">
              <label className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Add Items to Cart</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Search box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search item..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300"
                  />
                </div>

                {/* Dropdown */}
                <select
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300"
                >
                  <option value="">-- Select Item --</option>
                  {filteredFoodItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - RS {item.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                {/* Quantity */}
                <div className="w-24">
                  <input 
                    type="number" 
                    min="1" 
                    value={itemQuantity} 
                    onChange={e => setItemQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white text-center font-bold focus:outline-none"
                  />
                </div>
                {/* Add button */}
                <button
                  type="button"
                  onClick={handleAddItemToCart}
                  disabled={!selectedItemId}
                  className="flex-1 py-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Order
                </button>
              </div>
            </div>

            {/* Cart list table */}
            {cart.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Items</label>
                <div className="overflow-x-auto max-h-48 border border-white/5 rounded-xl">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-950/40 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[8px]">
                        <th className="p-3">Item</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Total</th>
                        <th className="p-3 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((c) => (
                        <tr key={c.item.id} className="border-b border-white/5 text-slate-200 hover:bg-white/[0.01]">
                          <td className="p-3 font-bold truncate max-w-[150px]">{c.item.name}</td>
                          <td className="p-3 text-right">RS {c.item.price.toFixed(2)}</td>
                          <td className="p-3 text-center font-bold">{c.quantity}</td>
                          <td className="p-3 text-right font-extrabold text-orange-400">RS {(c.item.price * c.quantity).toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(c.item.id)}
                              className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</span>
                  <span className="text-lg font-black text-white">RS {totalCartAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {paymentStatus && (
              <div className={`p-3.5 border rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse ${
                paymentStatus.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {paymentStatus.success ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                {paymentStatus.msg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={processing || cart.length === 0} 
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg border-none cursor-pointer glow-btn-emerald transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> {processing ? "Processing Order & Payment..." : "Place Order & Pay Now"}
            </button>
          </form>
        </div>
      </div>

      {/* Right List Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[500px]">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-wide">Billing Transaction Logs</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-time ledger audit trail</p>
            </div>
            <button 
              onClick={loadLogs} 
              disabled={loading}
              className="p-2 bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Refresh ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto max-h-[400px] overflow-y-auto pr-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-3">TX ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3 text-right">Amount</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500 font-bold">No transactions recorded yet</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 text-slate-200 hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 font-mono text-[9px] text-orange-400 font-bold">{log.transactionId || `TXN-${log.id}`}</td>
                      <td className="py-3.5 font-bold">{log.customerName}</td>
                      <td className="py-3.5 text-right font-extrabold text-slate-200">RS {log.amount.toFixed(2)}</td>
                      <td className="py-3.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border uppercase tracking-wider ${
                          log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
};

