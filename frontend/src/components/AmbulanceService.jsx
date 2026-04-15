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
        <div className="min-h-screen font-sans text-slate-800 bg-[#f8fafc] pt-20 pb-12">
            
            {/* Minimalist Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 h-16 flex items-center bg-white border-b border-slate-200">
                <div className="w-full">
                    <button onClick={() => navigate('/')} className="flex items-center text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>
                </div>
            </div>

            {/* Edge-to-Edge Main Container */}
            <div className="w-full px-4 md:px-8">
                
                <div className="mb-8 mt-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">Ambulance Dispatch</h1>
                    <p className="text-slate-500 text-sm md:text-base max-w-3xl">
                        Request immediate transport or schedule a specialized medical vehicle.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[550px] mb-8">
                    
                    {/* Left Panel: Booking Controls */}
                    <div className="w-full lg:w-[450px] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
                        
                        {/* Status: IDLE (Booking Form) */}
                        {dispatchState === "idle" && (
                            <div className="flex flex-col h-full">
                                {/* Clean Tabs */}
                                <div className="flex border-b border-slate-200 bg-slate-50/50">
                                    <button 
                                        onClick={() => setBookingMode("auto")}
                                        className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${bookingMode === "auto" ? "border-blue-600 text-blue-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Auto-Dispatch
                                    </button>
                                    <button 
                                        onClick={() => setBookingMode("manual")}
                                        className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${bookingMode === "manual" ? "border-blue-600 text-blue-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Manual Selection
                                    </button>
                                </div>

                                <div className="p-5 flex-1 flex flex-col overflow-y-auto">
                                    {/* Common Location Input */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pickup Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input 
                                                type="text" 
                                                value={pickupLocation}
                                                onChange={(e) => setPickupLocation(e.target.value)}
                                                placeholder="Enter full address or landmark"
                                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* AUTO MODE */}
                                    {bookingMode === "auto" && (
                                        <form onSubmit={handleAutoDispatch} className="flex flex-col flex-1">
                                            <div className="mb-6">
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Type</label>
                                                <select 
                                                    value={selectedType}
                                                    onChange={(e) => setSelectedType(e.target.value)}
                                                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                >
                                                    {ambulanceTypes.map(type => (
                                                        <option key={type.id} value={type.id}>{type.name}</option>
                                                    ))}
                                                </select>
                                                
                                                {/* Price Display */}
                                                <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
                                                    <span className="text-sm text-slate-600">Estimated Base Charge:</span>
                                                    <span className="font-semibold text-slate-900">{activeCharge}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4">
                                                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Find Nearest Ambulance
                                                </button>
                                                <p className="text-center text-xs text-slate-400 mt-3">System will dispatch the closest available unit.</p>
                                            </div>
                                        </form>
                                    )}

                                    {/* MANUAL MODE */}
                                    {bookingMode === "manual" && (
                                        <div className="flex flex-col flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Available Nearby</label>
                                            <div className="space-y-3">
                                                {nearbyUnits.map((unit) => (
                                                    <div key={unit.id} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors bg-white">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <div className="font-medium text-slate-900 text-sm">{unit.provider}</div>
                                                                <div className="text-xs text-slate-500 mt-0.5">{unit.type} • {unit.rating} ★</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-semibold text-blue-600 text-sm">{unit.eta}</div>
                                                                <div className="text-xs text-slate-500">{unit.distance}</div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleManualBooking(unit)}
                                                            className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
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
                                <Activity className="w-8 h-8 text-blue-500 animate-pulse mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-1">Scanning network...</h3>
                                <p className="text-sm text-slate-500">Contacting nearby drivers and confirming availability.</p>
                            </div>
                        )}

                        {/* Status: ASSIGNED (Active Tracking) */}
                        {dispatchState === "assigned" && assignedUnit && (
                            <div className="flex flex-col h-full p-5 bg-white">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-green-800 text-sm">Unit Dispatched</h4>
                                        <p className="text-green-700 text-xs mt-1 leading-relaxed">Driver has accepted the request and is en route to your location.</p>
                                    </div>
                                </div>

                                <div className="flex items-end gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <div className="bg-slate-900 text-white rounded-lg p-4 min-w-[90px] text-center">
                                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">ETA</div>
                                        <div className="text-2xl font-semibold">{etaCountdown}<span className="text-sm font-normal">m</span></div>
                                    </div>
                                    <div className="pb-1">
                                        <div className="text-slate-900 font-medium flex items-center gap-1.5">
                                            <Navigation className="w-4 h-4 text-blue-600" /> Approaching
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">Please keep your phone line clear.</div>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-500">Driver / Provider</div>
                                            <div className="text-slate-900 text-sm font-medium">{assignedUnit.driver}</div>
                                            <div className="text-slate-500 text-xs">{assignedUnit.provider}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                                            <Truck className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-500">Vehicle Info</div>
                                            <div className="text-slate-900 text-sm font-medium">{assignedUnit.vehicleNo}</div>
                                            <div className="text-slate-500 text-xs">{assignedUnit.type} • {assignedUnit.charge}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" /> Call Driver
                                    </button>
                                    <button 
                                        onClick={cancelBooking}
                                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> Cancel
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Fleet Information - Rendered from state for accuracy */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-slate-400" />
                            <h3 className="font-medium text-slate-900">Fleet Pricing Guide</h3>
                        </div>
                        <div className="space-y-4">
                            {ambulanceTypes.map(type => (
                                <div key={type.id} className="flex justify-between items-start border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                    <div className="pr-4">
                                        <div className="text-sm font-medium text-slate-800">{type.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{type.desc}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-sm font-semibold text-slate-900">{type.baseCharge}</div>
                                        <div className="text-[10px] text-slate-500 uppercase">{type.perKm}/km</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <h3 className="font-medium text-slate-900">Response Policy</h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                            The platform uses location-based routing to ensure the closest available unit is assigned. Trauma and cardiac emergencies are automatically flagged for priority routing.
                        </p>
                        <p className="text-slate-500 text-xs">
                            Note: Toll taxes and waiting charges (if applicable) are extra and settled directly with the provider.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-slate-400" />
                            <h3 className="font-medium text-slate-900">While you wait</h3>
                        </div>
                        <ul className="text-slate-600 text-sm space-y-2.5">
                            <li className="flex items-start gap-2">
                                <span className="text-slate-300 mt-0.5">•</span> 
                                Ensure building gates are open and elevators are ready if applicable.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-300 mt-0.5">•</span> 
                                Gather the patient's ID, insurance cards, and previous medical files.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-300 mt-0.5">•</span> 
                                Do not move a trauma patient unless they are in immediate physical danger.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}