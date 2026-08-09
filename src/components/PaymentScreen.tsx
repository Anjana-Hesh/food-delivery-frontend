import React from 'react';
import { CreditCard, ShieldCheck, DollarSign } from 'lucide-react';
import "../App.css";


export const PaymentScreen: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 p-3">
          <CreditCard className="w-8 h-8 text-orange-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-black text-white">Payment Gateway Service</h2>
        <p className="text-xs text-slate-400">PostgreSQL Billing Database Endpoint</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Order Reference ID</label>
          <input type="text" defaultValue="ORD-9482" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-orange-500" />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Amount ($)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="number" defaultValue="31.97" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Method</label>
          <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500">
            <option>Visa / MasterCard</option>
            <option>Cash On Delivery</option>
          </select>
        </div>

        <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Process Payment API
        </button>
      </div>
    </div>
  );
};