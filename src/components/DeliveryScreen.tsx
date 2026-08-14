import React, { useState, useEffect } from 'react';
import { Truck, Star, Phone, MapPin, Plus, X, Upload, Clock, Search, User, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Driver } from '../types';
import { fetchDrivers, registerDriver, updateDriverStatus, uploadFoodItemImage } from '../api';

export const DeliveryScreen: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const driversPerPage = 12;

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadError, setLoadError] = useState('');
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formVehicleNo, setFormVehicleNo] = useState('');

  const loadData = () => {
    fetchDrivers()
      .then(data => {
        setDrivers(data);
        setLoadError('');
      })
      .catch(() => setLoadError('Drivers could not be loaded from the database.'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formVehicleNo) return;

    try {
      let imageUrl = "";
      if (selectedImage) {
        imageUrl = await uploadFoodItemImage(selectedImage);
      }

      const payload: Partial<Driver> = {
        name: formName,
        age: parseInt(formAge) || 30,
        phone: formPhone,
        address: formAddress || "Colombo, Sri Lanka",
        vehicleNo: formVehicleNo,
        rating: 5.0,
        workingHours: "08:00 AM - 05:00 PM",
        experienceYears: 2,
        status: "AVAILABLE",
        ...(imageUrl && { imageUrl })
      };

      const saved = await registerDriver(payload);
      setDrivers([...drivers, saved]);
      setIsAddModalOpen(false);

      // Reset Form
      setFormName('');
      setFormAge('');
      setFormPhone('');
      setFormAddress('');
      setFormVehicleNo('');
      setSelectedImage(null);
    } catch (err) {
      console.error("Error registering driver", err);
    }
  };

  const handleAssignDriverToJob = async (drv: Driver) => {
    try {
      await updateDriverStatus(drv.id, "ON_DELIVERY");
      loadData();
      setSelectedDriver(null);
    } catch (err) {
      console.error("Error assigning driver", err);
      setDrivers(drivers.map(d => d.id === drv.id ? { ...d, status: "ON_DELIVERY" } : d));
      setSelectedDriver(null);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, startIndex + driversPerPage);

  const ratingChartData = drivers.map(d => ({ name: d.name.split(' ')[0], rating: d.rating }));
  const averageRating = drivers.length
    ? (drivers.reduce((sum, driver) => sum + driver.rating, 0) / drivers.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Truck className="text-sky-400" /> Driver Dispatch & Fleet Registry
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Monitor driver efficiency and service metrics</p>
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4.5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all duration-300 border-none cursor-pointer glow-btn-sky"
            >
              <Plus className="w-4 h-4" /> Add New Driver
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Active</p>
              <p className="text-lg font-black text-white mt-0.5">{drivers.length}</p>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Available</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{drivers.filter(d => d.status === 'AVAILABLE').length}</p>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg Rating</p>
              <p className="text-lg font-black text-amber-400 mt-0.5">{averageRating} ★</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Driver Performance Rates</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingChartData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }} />
                <Bar dataKey="rating" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Driver Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-4 rounded-2xl shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" /> Active Fleet Registry ({filteredDrivers.length})
          </h3>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Name, ID, or Vehicle No..."
              className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 focus:bg-slate-950 transition-all duration-300"
            />
          </div>
        </div>

        {loadError && (
          <div className="glass-panel rounded-2xl p-6 text-center shadow-xl border-rose-500/20">
            <p className="text-sm font-extrabold text-rose-300">{loadError}</p>
            <p className="text-xs text-slate-400 mt-2">Please check the backend connection and try again.</p>
          </div>
        )}

        {!loadError && currentDrivers.length === 0 && (
          <div className="glass-panel rounded-2xl p-6 text-center text-sm font-bold text-slate-300 shadow-xl">
            No drivers found.
          </div>
        )}

        {/* Driver Grid */}
        {!loadError && currentDrivers.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3.5">
          {currentDrivers.map((drv) => (
            <div
              key={drv.id}
              className="glass-panel w-[178px] h-[236px] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-sky-500/25 hover:shadow-[0_12px_30px_rgba(56,189,248,0.12)] group"
            >
              <div className="relative w-full h-[92px] overflow-hidden bg-slate-950 shrink-0">
                {drv.imageUrl ? (
                  <img
                    src={drv.imageUrl}
                    alt={drv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <User className="h-7 w-7" />
                  </div>
                )}
                <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate bg-slate-950/80 backdrop-blur-md text-slate-300 font-extrabold text-[8px] px-2 py-1 rounded-full shadow-md border border-white/10 uppercase tracking-widest">
                  {drv.id}
                </span>
                <span className={`absolute bottom-2 right-2 text-[8px] font-extrabold px-2 py-1 rounded-full border uppercase tracking-wider ${
                  drv.status === 'AVAILABLE' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : drv.status === 'ON_DELIVERY' 
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' 
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {drv.status}
                </span>
              </div>

              <div className="p-2.5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-[11px] leading-snug min-h-7 line-clamp-2 group-hover:text-sky-400 transition-colors" title={drv.name}>
                    {drv.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono font-bold mt-1 uppercase tracking-wider truncate">{drv.vehicleNo}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                    <p className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {drv.rating}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDriver(drv)}
                    className="w-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-[11px] px-3 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 border-none cursor-pointer glow-btn-sky"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Driver Pagination Bar */}
        {!loadError && totalPages > 1 && (
          <div className="flex justify-between items-center glass-panel p-4 rounded-2xl shadow-xl">
            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{startIndex + 1}</strong> to <strong className="text-white">{Math.min(startIndex + driversPerPage, filteredDrivers.length)}</strong> of <strong className="text-white">{filteredDrivers.length}</strong> Drivers
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 bg-slate-950/80 border border-white/5 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-300 ${
                    currentPage === idx + 1
                      ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md shadow-sky-500/10"
                      : "bg-slate-950/85 text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 bg-slate-950/80 border border-white/5 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedDriver(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer bg-transparent border-none">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img src={selectedDriver.imageUrl} alt={selectedDriver.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
              <div>
                <span className="text-[9px] font-extrabold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 tracking-wider uppercase">{selectedDriver.id}</span>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedDriver.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium"><Phone className="w-3.5 h-3.5 text-sky-400" /> {selectedDriver.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Age & Exp</span>
                <p className="font-bold text-white mt-0.5">{selectedDriver.age} Yrs old • {selectedDriver.experienceYears} Yrs Exp</p>
              </div>
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Working Hours</span>
                <p className="font-bold text-white flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5 text-sky-400" /> {selectedDriver.workingHours}</p>
              </div>
            </div>

            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Address</span>
              <p className="font-bold text-white mt-0.5">{selectedDriver.address}</p>
            </div>

            <div className="flex justify-between items-center bg-slate-950/50 p-3.5 rounded-xl border border-white/5 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Performance Rating</span>
              <span className="font-black text-amber-400 text-sm flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400" /> {selectedDriver.rating} Stars</span>
            </div>

            {selectedDriver.status === 'AVAILABLE' && (
              <button 
                onClick={() => handleAssignDriverToJob(selectedDriver)}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 font-bold text-xs text-white rounded-xl shadow-lg border-none cursor-pointer glow-btn-sky transition-all duration-300"
              >
                Dispatch to Active Delivery Job
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer bg-transparent border-none">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Register New Driver</h3>

            <form className="space-y-4" onSubmit={handleRegisterDriver}>
              <input type="text" placeholder="Full Name" value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500 focus:bg-slate-950 transition-all duration-300" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Age" value={formAge} onChange={e => setFormAge(e.target.value)} className="bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500 focus:bg-slate-950 transition-all duration-300" required />
                <input type="text" placeholder="Phone Number" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500 focus:bg-slate-950 transition-all duration-300" required />
              </div>
              <input type="text" placeholder="Residential Address" value={formAddress} onChange={e => setFormAddress(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500 focus:bg-slate-950 transition-all duration-300" required />
              <input type="text" placeholder="Vehicle Number" value={formVehicleNo} onChange={e => setFormVehicleNo(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500 focus:bg-slate-950 transition-all duration-300" required />

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Driver Photo (Upload to GCP Bucket)</label>
                <label className="border-2 border-dashed border-white/5 hover:border-sky-500/40 rounded-xl p-3.5 text-center cursor-pointer bg-slate-950/20 hover:bg-slate-950/40 block transition-all duration-300">
                  <Upload className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 font-bold">Choose Image</span>
                  <input type="file" className="hidden" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
                  {selectedImage && <p className="text-[10px] text-sky-400 font-bold mt-1.5">{selectedImage.name}</p>}
                </label>
              </div>

              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 font-bold text-xs text-white rounded-xl shadow-lg border-none cursor-pointer glow-btn-sky transition-all duration-300">
                Save & Register Driver
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
