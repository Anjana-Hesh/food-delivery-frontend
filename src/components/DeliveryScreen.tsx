import React, { useState } from 'react';
import { Truck, Star, Phone, MapPin, Plus, X, Upload, Clock, Search, User, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Driver } from '../types';

export const DeliveryScreen: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const driversPerPage = 8;

  const [drivers, setDrivers] = useState<Driver[]>([
    { id: "DRV-101", name: "Kamal Perera", age: 29, phone: "+94 77 123 4567", address: "123, Galle Road, Colombo 03", vehicleNo: "WP BAZ-4829", rating: 4.8, workingHours: "08:00 AM - 05:00 PM", experienceYears: 4, status: "AVAILABLE", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" },
    { id: "DRV-102", name: "Sunil Shantha", age: 34, phone: "+94 71 987 6543", address: "45, Kandy Road, Kadawatha", vehicleNo: "WP CAD-1102", rating: 4.5, workingHours: "10:00 AM - 07:00 PM", experienceYears: 6, status: "ON_DELIVERY", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80" },
    { id: "DRV-103", name: "Nimal Silva", age: 31, phone: "+94 75 444 8899", address: "88, Main Street, Galle", vehicleNo: "WP GAE-5521", rating: 4.9, workingHours: "07:00 AM - 04:00 PM", experienceYears: 5, status: "AVAILABLE", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" },
    { id: "DRV-104", name: "Ruwan Kumara", age: 27, phone: "+94 72 333 1122", address: "12, Beach Road, Matara", vehicleNo: "WP SP-9988", rating: 4.6, workingHours: "09:00 AM - 06:00 PM", experienceYears: 3, status: "AVAILABLE", imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80" },
    { id: "DRV-105", name: "Kasun Jayasuriya", age: 33, phone: "+94 76 555 4433", address: "67, Lake Road, Kurunegala", vehicleNo: "WP CP-1234", rating: 4.7, workingHours: "08:00 AM - 05:00 PM", experienceYears: 7, status: "AVAILABLE", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80" }
  ]);

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, startIndex + driversPerPage);

  const ratingChartData = drivers.map(d => ({ name: d.name.split(' ')[0], rating: d.rating }));

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Truck className="text-sky-400" /> Driver Dispatch & Fleet Registry
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
              <p className="text-xl font-black text-amber-400">4.70 ★</p>
            </div>
          </div>
        </div>

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

      {/* Driver Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" /> Active Fleet Registry ({filteredDrivers.length})
          </h3>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Name, ID, or Vehicle No..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* 4 Cards Per Row Driver Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {currentDrivers.map((drv) => (
            <div
              key={drv.id}
              className="bg-[#18181b] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-slate-700"
            >
              <div className="relative w-full h-44 overflow-hidden bg-slate-950">
                <img
                  src={drv.imageUrl}
                  alt={drv.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-slate-900 font-semibold text-[11px] px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                  {drv.id}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-white text-base tracking-wide line-clamp-1">
                    {drv.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{drv.vehicleNo}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Rating</p>
                    <p className="text-sm font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {drv.rating}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDriver(drv)}
                    className="bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Assign Driver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Driver Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{startIndex + 1}</strong> to <strong className="text-white">{Math.min(startIndex + driversPerPage, filteredDrivers.length)}</strong> of <strong className="text-white">{filteredDrivers.length}</strong> Drivers
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    currentPage === idx + 1
                      ? "bg-sky-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl">
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

      {/* Add Driver Modal */}
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