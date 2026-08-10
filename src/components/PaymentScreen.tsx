import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, DollarSign, ShieldAlert, RefreshCw } from 'lucide-react';
import { fetchPaymentLogs, processPayment } from '../api';
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

export const PaymentScreen: React.FC = () => {
  const [orderId, setOrderId] = useState('ORD-1');
  const [amount, setAmount] = useState('1490.00');
  const [customerName, setCustomerName] = useState('Amara Perera');
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
  }, []);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !amount) return;

    setProcessing(true);
    setPaymentStatus(null);
    try {
      const result = await processPayment(orderId, parseFloat(amount), customerName);
      if (result.success) {
        setPaymentStatus({ success: true, msg: `Transaction Success! ID: ${result.transactionId}` });
      } else {
        setPaymentStatus({ success: false, msg: `Transaction Denied: ${result.message}` });
      }
      loadLogs();
    } catch (err) {
      setPaymentStatus({ success: false, msg: "Failed to connect to gateway API." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto space-y-0">
      
      {/* Left Form card */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block bg-orange-500/10 rounded-2xl border border-orange-500/20 p-3">
            <CreditCard className="w-8 h-8 text-orange-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-black text-white">Payment Gateway</h2>
          <p className="text-xs text-slate-400">PostgreSQL Billing Database Endpoint</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Order Ref ID</label>
                <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-orange-500" required />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (RS)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500" required />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Method</label>
              <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500">
                <option>Visa / MasterCard</option>
                <option>Cash On Delivery</option>
              </select>
            </div>

            {paymentStatus && (
              <div className={`p-3 border rounded-xl text-xs font-bold flex items-center gap-2 ${
                paymentStatus.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {paymentStatus.success ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                {paymentStatus.msg}
              </div>
            )}

            <button type="submit" disabled={processing} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" /> {processing ? "Processing Transact..." : "Process Payment API"}
            </button>
          </form>
        </div>
      </div>

      {/* Right List Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between min-h-[400px]">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Billing Transaction Logs</h3>
              <p className="text-[10px] text-slate-400">Real-time ledger updates from PostgreSQL</p>
            </div>
            <button 
              onClick={loadLogs} 
              disabled={loading}
              className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Refresh ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5">TX ID</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5 text-right">Amount</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">No transactions recorded yet</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-800/40 text-slate-200">
                      <td className="py-3 font-mono text-[10px] text-orange-400">{log.transactionId || `TXN-${log.id}`}</td>
                      <td className="py-3 font-medium">{log.customerName}</td>
                      <td className="py-3 text-right font-bold">RS {log.amount.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
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