import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, MapPin, Phone, 
    Clock, AlertCircle, 
    CheckCircle2, Navigation, User, X, 
    Truck, Activity, Info
} from "lucide-react";

// Mock Data: Ambulance Types & Pricing
const ambulanceTypes = [
    { id: "bls", name: "Basic Life Support (BLS)", desc: "For stable patients requiring basic monitoring.", baseCharge: "₹800", perKm: "₹15" },
    { id: "als", name: "Advanced Life Support (ALS)", desc: "Includes ventilator, defibrillator, and paramedic.", baseCharge: "₹2,500", perKm: "₹25" },
    { id: "nicu", name: "Neonatal (NICU)", desc: "Specialized transport for critically ill newborns.", baseCharge: "₹3,000", perKm: "₹30" }
];

// Mock Data: Nearby available units for Manual Selection
const nearbyUnits = [
    { id: 1, provider: "City LifeCare Rescue", type: "ALS", distance: "1.2 km", eta: "4 mins", rating: 4.8 },
    { id: 2, provider: "Apollo Emergency Fleet", type: "ALS", distance: "2.5 km", eta: "8 mins", rating: 4.9 },
    { id: 3, provider: "QuickResponse BLS", type: "BLS", distance: "0.8 km", eta: "3 mins", rating: 4.5 },
    { id: 4, provider: "Hope Neo-natal Care", type: "NICU", distance: "3.1 km", eta: "11 mins", rating: 4.7 }
];

export default function AmbulanceService() {
    const navigate = useNavigate();
    
    // Core States
    const [bookingMode, setBookingMode] = useState("auto"); // 'auto' | 'manual'
    const [dispatchState, setDispatchState] = useState("idle"); // 'idle' | 'searching' | 'assigned'
    
    // Form States
    const [pickupLocation, setPickupLocation] = useState("");
    const [selectedType, setSelectedType] = useState("als");
    
    // Tracking States
    const [assignedUnit, setAssignedUnit] = useState(null);
    const [etaCountdown, setEtaCountdown] = useState(0);

    // Auto-Dispatch Flow
    const handleAutoDispatch = (e) => {
        e.preventDefault();
        if (!pickupLocation) return alert("Please enter a pickup location.");
        
        setDispatchState("searching");
        setTimeout(() => {
            setAssignedUnit({
                provider: "System Assigned ALS",
                driver: "Rajesh Kumar",
                vehicleNo: "WB 04 F 1234",
                phone: "+91 98765 43210",
                type: "ALS",
                charge: "₹2,500 (Base)"
            });
            setEtaCountdown(5);
            setDispatchState("assigned");
        }, 2000);
    };

    // Manual Selection Flow
    const handleManualBooking = (unit) => {
        if (!pickupLocation) return alert("Please enter a pickup location first.");
        
        setAssignedUnit({
            provider: unit.provider,
            driver: "Allocated Driver",
            vehicleNo: "Pending Allocation",
            phone: "+91 98765 00000",
            type: unit.type,
            charge: ambulanceTypes.find(t => t.id.toLowerCase() === unit.type.toLowerCase())?.baseCharge || "Standard"
        });
        setEtaCountdown(parseInt(unit.eta));
        setDispatchState("assigned");
    };

    const cancelBooking = () => {
        if(window.confirm("Cancel this emergency request?")) {
            setDispatchState("idle");
            setAssignedUnit(null);
            setEtaCountdown(0);
        }
    };

    // Simulate ETA Countdown
    useEffect(() => {
        let interval;
        if (dispatchState === "assigned" && etaCountdown > 1) {
            interval = setInterval(() => {
                setEtaCountdown((prev) => prev - 1);
            }, 60000);
        }
        return () => clearInterval(interval);
    }, [dispatchState, etaCountdown]);

    const activeCharge = ambulanceTypes.find(t => t.id === selectedType)?.baseCharge;
    const mapLocation = dispatchState === "assigned" ? "Apollo Hospital, Kolkata" : (pickupLocation || "Kolkata, India");

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-slate-50 border-t-2 pt-24 pb-16 pl-10 pr-10">
            
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full">
                    <button onClick={() => navigate('/')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                    </button>
                </div>
            </div>

            {/* Edge-to-Edge Main Container */}
            <div className="w-full px-2 md:px-4">
                
                <div className="text-center mt-8 mb-10">
                    <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                        Ambulance <span className="text-blue-900">Dispatch</span>
                    </h1>
                    <p className="text-slate-600 text-[18px] leading-relaxed max-w-5xl mx-auto mb-6">
                        Request immediate transport or schedule a specialized medical vehicle.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 overflow-hidden flex flex-col lg:flex-row min-h-[550px] mb-10">
                    
                    {/* Left Panel: Booking Controls */}
                    <div className="w-full lg:w-[450px] flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-sky-200 bg-white">
                        
                        {/* Status: IDLE (Booking Form) */}
                        {dispatchState === "idle" && (
                            <div className="flex flex-col h-full">
                                {/* Clean Tabs */}
                                <div className="flex border-b-2 border-sky-200 bg-blue-50/50">
                                    <button 
                                        onClick={() => setBookingMode("auto")}
                                        className={`flex-1 py-4 text-[15px] font-bold text-center border-b-2 transition-colors cursor-pointer ${bookingMode === "auto" ? "border-cyan-600 text-cyan-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Auto-Dispatch
                                    </button>
                                    <button 
                                        onClick={() => setBookingMode("manual")}
                                        className={`flex-1 py-4 text-[15px] font-bold text-center border-b-2 transition-colors cursor-pointer ${bookingMode === "manual" ? "border-cyan-600 text-cyan-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Manual Selection
                                    </button>
                                </div>

                                <div className="p-6 flex-1 flex flex-col overflow-y-auto">
                                    {/* Common Location Input */}
                                    <div className="mb-6">
                                        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pickup Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5" />
                                            <input 
                                                type="text" 
                                                value={pickupLocation}
                                                onChange={(e) => setPickupLocation(e.target.value)}
                                                placeholder="Enter full address or landmark"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* AUTO MODE */}
                                    {bookingMode === "auto" && (
                                        <form onSubmit={handleAutoDispatch} className="flex flex-col flex-1">
                                            <div className="mb-6">
                                                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Required Type</label>
                                                <select 
                                                    value={selectedType}
                                                    onChange={(e) => setSelectedType(e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] transition-all shadow-sm appearance-none cursor-pointer"
                                                >
                                                    {ambulanceTypes.map(type => (
                                                        <option key={type.id} value={type.id}>{type.name}</option>
                                                    ))}
                                                </select>
                                                
                                                {/* Price Display */}
                                                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center shadow-inner">
                                                    <span className="text-[14px] font-semibold text-slate-600">Estimated Base Charge:</span>
                                                    <span className="font-bold text-[16px] text-blue-950">{activeCharge}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4">
                                                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl text-[15px] font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                                                    <AlertCircle className="w-5 h-5" />
                                                    Find Nearest Ambulance
                                                </button>
                                                <p className="text-center text-[12px] font-medium text-slate-400 mt-3">System will dispatch the closest available unit.</p>
                                            </div>
                                        </form>
                                    )}

                                    {/* MANUAL MODE */}
                                    {bookingMode === "manual" && (
                                        <div className="flex flex-col flex-1">
                                            <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Available Nearby</label>
                                            <div className="space-y-4">
                                                {nearbyUnits.map((unit) => (
                                                    <div key={unit.id} className="p-4 border-2 border-slate-100 rounded-xl hover:border-cyan-300 transition-colors bg-white group cursor-pointer" onClick={() => handleManualBooking(unit)}>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <div className="font-bold text-blue-950 text-[15px] group-hover:text-cyan-700 transition-colors">{unit.provider}</div>
                                                                <div className="text-[13px] font-medium text-slate-500 mt-0.5">{unit.type} • {unit.rating} ★</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold text-cyan-600 text-[15px]">{unit.eta}</div>
                                                                <div className="text-[12px] font-semibold text-slate-400">{unit.distance}</div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            className="w-full mt-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Select this unit
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Status: SEARCHING */}
                        {dispatchState === "searching" && (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                                <Activity className="w-10 h-10 text-cyan-600 animate-pulse mb-4" />
                                <h3 className="font-poppins text-xl font-bold text-blue-950 mb-2">Scanning network...</h3>
                                <p className="text-[15px] text-slate-500">Contacting nearby drivers and confirming availability.</p>
                            </div>
                        )}

                        {/* Status: ASSIGNED (Active Tracking) */}
                        {dispatchState === "assigned" && assignedUnit && (
                            <div className="flex flex-col h-full p-6 bg-white">
                                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-emerald-800 text-[15px]">Unit Dispatched</h4>
                                        <p className="text-emerald-700 text-[13px] font-medium mt-1 leading-relaxed">Driver has accepted the request and is en route to your location.</p>
                                    </div>
                                </div>

                                <div className="flex items-end gap-5 mb-6 pb-6 border-b-2 border-slate-100">
                                    <div className="bg-blue-950 text-white rounded-2xl p-4 min-w-[100px] text-center shadow-md">
                                        <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-1">ETA</div>
                                        <div className="text-3xl font-poppins font-bold">{etaCountdown}<span className="text-lg font-medium">m</span></div>
                                    </div>
                                    <div className="pb-1">
                                        <div className="text-blue-950 font-bold text-[16px] flex items-center gap-1.5">
                                            <Navigation className="w-5 h-5 text-cyan-600" /> Approaching
                                        </div>
                                        <div className="text-[13px] font-medium text-slate-500 mt-1.5">Please keep your phone line clear.</div>
                                    </div>
                                </div>

                                <div className="space-y-5 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
                                            <User className="w-6 h-6 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Driver / Provider</div>
                                            <div className="text-blue-950 text-[15px] font-bold">{assignedUnit.driver}</div>
                                            <div className="text-slate-500 font-medium text-[13px]">{assignedUnit.provider}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
                                            <Truck className="w-6 h-6 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Vehicle Info</div>
                                            <div className="text-blue-950 text-[15px] font-bold">{assignedUnit.vehicleNo}</div>
                                            <div className="text-slate-500 font-medium text-[13px]">{assignedUnit.type} • {assignedUnit.charge}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-3.5 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
                                        <Phone className="w-5 h-5" /> Call Driver
                                    </button>
                                    <button 
                                        onClick={cancelBooking}
                                        className="bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 py-3.5 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <X className="w-5 h-5" /> Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Map */}
                    <div className="w-full flex-1 bg-slate-200 relative min-h-[300px]">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            loading="lazy" 
                            allowFullScreen 
                            src={`https://maps.google.com/maps?q=$${encodeURIComponent(mapLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            title="Tracking Map"
                        ></iframe>
                    </div>
                </div>

                {/* Information Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Fleet Information */}
                    <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center border border-cyan-200">
                                <Info className="w-5 h-5 text-cyan-700" />
                            </div>
                            <h3 className="font-poppins text-lg font-bold text-blue-950">Fleet Pricing Guide</h3>
                        </div>
                        <div className="space-y-4">
                            {ambulanceTypes.map(type => (
                                <div key={type.id} className="flex justify-between items-start border-b-2 border-slate-50 pb-3 last:border-0 last:pb-0">
                                    <div className="pr-4">
                                        <div className="text-[14px] font-bold text-slate-800">{type.name}</div>
                                        <div className="text-[12px] font-medium text-slate-500 mt-0.5">{type.desc}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-[14px] font-bold text-blue-950">{type.baseCharge}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{type.perKm}/km</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                <Clock className="w-5 h-5 text-indigo-700" />
                            </div>
                            <h3 className="font-poppins text-lg font-bold text-blue-950">Response Policy</h3>
                        </div>
                        <p className="text-slate-600 text-[14px] font-medium leading-relaxed mb-4">
                            The platform uses location-based routing to ensure the closest available unit is assigned. Trauma and cardiac emergencies are automatically flagged for priority routing.
                        </p>
                        <p className="text-slate-500 text-[12px] font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                            Note: Toll taxes and waiting charges (if applicable) are extra and settled directly with the provider.
                        </p>
                    </div>

                    <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                                <AlertCircle className="w-5 h-5 text-blue-700" />
                            </div>
                            <h3 className="font-poppins text-lg font-bold text-blue-950">While you wait</h3>
                        </div>
                        <ul className="text-slate-600 text-[14px] font-medium space-y-3 pl-1">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div> 
                                Ensure building gates are open and elevators are ready if applicable.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div> 
                                Gather the patient's ID, insurance cards, and previous medical files.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div> 
                                Do not move a trauma patient unless they are in immediate physical danger.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}