import React, { useState } from 'react';
import { Truck, Star, Phone, MapPin, Plus, X, Upload, Award, Briefcase, Clock, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Driver } from '../types';

export const DeliveryScreen: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "DRV-101",
      name: "Kamal Perera",
      age: 29,
      phone: "+94 77 123 4567",
      address: "123, Galle Road, Colombo 03",
      vehicleNo: "WP BAZ-4829",
      rating: 4.8,
      workingHours: "08:00 AM - 05:00 PM",
      experienceYears: 4,
      status: "AVAILABLE",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "DRV-102",
      name: "Sunil Shantha",
      age: 34,
      phone: "+94 71 987 6543",
      address: "45, Kandy Road, Kadawatha",
      vehicleNo: "WP CAD-1102",
      rating: 4.5,
      workingHours: "10:00 AM - 07:00 PM",
      experienceYears: 6,
      status: "ON_DELIVERY",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
    }
  ]);

  const ratingChartData = drivers.map(d => ({ name: d.name.split(' ')[0], rating: d.rating }));

  return (
    <div className="space-y-8">
      {/* Top Section: Header & Driver Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Truck className="text-sky-400" /> Driver Dispatch & Analytics
              </h2>
              <p className="text-xs text-slate-400">Monitor driver efficiency and service metrics</p>
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Driver
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400">Total Active</p>
              <p className="text-xl font-black text-white">{drivers.length}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400">Available</p>
              <p className="text-xl font-black text-emerald-400">{drivers.filter(d => d.status === 'AVAILABLE').length}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400">Avg Rating</p>
              <p className="text-xl font-black text-amber-400">4.65 ★</p>
            </div>
          </div>
        </div>

        {/* Rating Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Driver Performance Rates</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Bar dataKey="rating" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((drv) => (
          <div 
            key={drv.id}
            onClick={() => setSelectedDriver(drv)}
            className="bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 space-y-4 hover:shadow-xl group"
          >
            <div className="flex items-center gap-4">
              <img src={drv.imageUrl} alt={drv.name} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors">{drv.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{drv.vehicleNo}</p>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {drv.rating} Rating
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                drv.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-sky-500/10 text-sky-400'
              }`}>
                {drv.status}
              </span>
              <span className="text-xs text-sky-400 font-semibold group-hover:underline">View Full Profile →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl animate-fade-in">
            <button onClick={() => setSelectedDriver(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img src={selectedDriver.imageUrl} alt={selectedDriver.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-700" />
              <div>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">{selectedDriver.id}</span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedDriver.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {selectedDriver.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Age & Exp</span>
                <p className="font-bold text-white">{selectedDriver.age} Yrs old • {selectedDriver.experienceYears} Yrs Exp</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Working Hours</span>
                <p className="font-bold text-white flex items-center gap-1"><Clock className="w-3 h-3 text-sky-400" /> {selectedDriver.workingHours}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> Address</span>
              <p className="font-bold text-white">{selectedDriver.address}</p>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Performance Rating</span>
              <span className="font-black text-amber-400 text-sm flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400" /> {selectedDriver.rating} Stars</span>
            </div>
          </div>
        </div>
      )}

      {/* Add New Driver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Register New Driver</h3>

            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Age" className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" required />
                <input type="text" placeholder="Phone Number" className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" required />
              </div>
              <input type="text" placeholder="Residential Address" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" required />
              <input type="text" placeholder="Vehicle Number" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" required />

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Driver Photo (Upload to GCP Bucket)</label>
                <label className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl p-3 text-center cursor-pointer bg-slate-950 block">
                  <Upload className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-300">Choose Image</span>
                  <input type="file" className="hidden" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
                  {selectedImage && <p className="text-xs text-sky-400 font-bold mt-1">{selectedImage.name}</p>}
                </label>
              </div>

              <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white rounded-xl shadow-lg">
                Save & Register Driver
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};