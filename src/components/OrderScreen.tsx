import React from 'react';
import { ShoppingBag, Clock, UserPlus } from 'lucide-react';
import type { Order } from '../types';

interface Props {
  onNavigateToDrivers: () => void;
}

export const OrderScreen: React.FC<Props> = ({ onNavigateToDrivers }) => {
  const orders: Order[] = [
    { id: 'ORD-9482', items: ['Gourmet Cheese Burger (x2)'], total: 2580.00, status: 'PENDING' },
    { id: 'ORD-9483', items: ['Artisan Pepperoni Pizza (x1)'], total: 2850.00, status: 'CONFIRMED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Incoming Live Orders</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((ord) => (
          <div key={ord.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono font-black text-orange-400 text-lg">{ord.id}</span>
              <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5" /> {ord.status}
              </span>
            </div>

            <p className="text-sm text-slate-200 font-medium">{ord.items.join(', ')}</p>

            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                <p className="text-lg font-black text-white">RS {ord.total.toFixed(2)}</p>
              </div>

              {/* Direct Navigation Button to Drivers Screen */}
              <button 
                onClick={onNavigateToDrivers}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all"
              >
                <UserPlus className="w-4 h-4" /> Assign Driver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};