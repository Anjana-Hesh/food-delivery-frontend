import { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';
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

export const PaymentScreen = () => {
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
          <div className="inline-block bg-orange-500/10 rounded-2xl border border-orange-500/20 p-3 shadow-md">
            <CreditCard className="w-8 h-8 text-orange-400 mx-auto text-glow-orange" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">Payment Gateway</h2>
          <p className="text-xs text-slate-400">Process microservice billing orders securely</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-xl">
          <form onSubmit={handleProcessPayment} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Order Ref ID</label>
                <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300" required />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Amount (RS)</label>
                <div className="relative">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300" required />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Method</label>
              <select className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300">
                <option>Visa / MasterCard</option>
                <option>Cash On Delivery</option>
              </select>
            </div>

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

            <button type="submit" disabled={processing} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg border-none cursor-pointer glow-btn-emerald transition-all duration-300 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> {processing ? "Processing Transact..." : "Process Payment API"}
            </button>
          </form>
        </div>
      </div>

      {/* Right List Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[400px]">
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

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
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
