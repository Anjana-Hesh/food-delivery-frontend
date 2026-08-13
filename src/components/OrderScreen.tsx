import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, UserPlus, RefreshCw } from 'lucide-react';
import type { Order } from '../types';
import { fetchOrders, updateOrderStatus } from '../api';

interface Props {
  onNavigateToDrivers: () => void;
}

const STATIC_ORDERS: Order[] = [
  { id: 'ORD-9482', items: ['Gourmet Cheese Burger (x2)'], total: 2580.00, status: 'PENDING' },
  { id: 'ORD-9483', items: ['Artisan Pepperoni Pizza (x1)'], total: 2850.00, status: 'CONFIRMED' },
];

export const OrderScreen: React.FC<Props> = ({ onNavigateToDrivers }) => {
  const [orders, setOrders] = useState<Order[]>(STATIC_ORDERS);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.log("Using static data fallback for Orders Screen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignDriver = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "DISPATCHED");
      await loadData();
      onNavigateToDrivers();
    } catch (err) {
      console.error("Failed to update status, moving screen anyway", err);
      // Fallback
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'DELIVERING' } : o));
      onNavigateToDrivers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-panel p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-orange-400" />
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-wide">Incoming Live Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time status updates and dispatcher controls</p>
          </div>
        </div>

        <button 
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2.5 bg-slate-950/60 border border-white/5 text-slate-300 hover:text-white rounded-xl flex items-center gap-2 font-bold text-xs cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((ord) => (
          <div key={ord.id} className="glass-panel rounded-2xl p-6 space-y-4 shadow-xl hover:border-orange-500/25 transition-all duration-300 group">
            <div className="flex justify-between items-center">
              <span className="font-mono font-black text-orange-400 text-lg text-glow-orange">{ord.id}</span>
              <span className={`text-[9px] px-3 py-1 rounded-full border flex items-center gap-1 font-extrabold tracking-wider uppercase ${
                ord.status === 'PENDING' 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                  : ord.status === 'CONFIRMED' || ord.status === 'PAID'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse'
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
              }`}>
                <Clock className="w-3 h-3" /> {ord.status}
              </span>
            </div>

            <p className="text-sm text-slate-200 font-medium bg-slate-950/40 p-3 rounded-xl border border-white/5">{ord.items.join(', ')}</p>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                <p className="text-base font-black text-white mt-0.5">RS {ord.total.toFixed(2)}</p>
              </div>

              {/* Direct Navigation Button to Drivers Screen */}
              <button 
                onClick={() => handleAssignDriver(ord.id)}
                className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all duration-300 border-none cursor-pointer glow-btn-orange"
              >
                <UserPlus className="w-3.5 h-3.5" /> Assign Driver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};