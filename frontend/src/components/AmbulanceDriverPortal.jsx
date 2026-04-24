import { useState } from "react";
import { 
    MapPin, Navigation, Power, 
    Bell, CheckCircle2, Phone, 
    ShieldAlert, User, Clock
} from "lucide-react";

export default function AmbulanceDriverPortal() {
    // Driver States
    const [isOnline, setIsOnline] = useState(false);
    const [currentStatus, setCurrentStatus] = useState("AVAILABLE"); // AVAILABLE, ON_TRIP
    
    // Mock Assigned Trip Data (This would come from your backend / emergency requests)
    const [activeTrip, setActiveTrip] = useState({
        id: "EMG-8821",
        patientName: "Arindam Roy",
        contact: "+91 98765 43210",
        pickupAddress: "Salt Lake Sector V, Kolkata",
        dropAddress: "Apollo Gleneagles Hospital",
        distance: "4.2 km",
        eta: "12 mins",
        type: "Trauma - High Priority"
    });

    const toggleStatus = () => {
        setIsOnline(!isOnline);
        // Here you would make an API call to update the driver's availability status in the DB
    };

    const handleAcceptTrip = () => {
        setCurrentStatus("ON_TRIP");
        // API call to update emergency request status to ACCEPTED/DISPATCHED
    };

    const handleCompleteTrip = () => {
        setCurrentStatus("AVAILABLE");
        setActiveTrip(null);
        // API call to update emergency request status to COMPLETED
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20 md:pb-0">
            
            <div className="bg-blue-950 text-white px-5 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100/20 flex items-center justify-center border border-slate-100/30">
                        <User className="w-5 h-5 text-cyan-300"/>
                    </div>
                    <div>
                        <div className="text-[13px] font-medium text-cyan-200">Vehicle: WB 04 F 9988</div>
                        <div className="text-[15px] font-bold tracking-wide">Driver Dashboard</div>
                    </div>
                </div>
                <button className="relative p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <Bell className="w-5 h-5"/>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-950"></span>
                </button>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                
                
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-bold text-blue-950 mb-1">Shift Status</h2>
                        <p className={`text-[14px] font-semibold ${isOnline ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {isOnline ? "Online & Receiving Requests" : "Offline"}
                        </p>
                    </div>
                    <button 
                        onClick={toggleStatus}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isOnline ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}
                    >
                        <Power className="w-7 h-7 text-white"/>
                    </button>
                </div>

                
                {isOnline && activeTrip && currentStatus === "AVAILABLE" && (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-red-200 mb-6 animate-in slide-in-from-bottom-4">
                        <div className="bg-red-50 border-b border-red-100 p-4 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse"/>
                            <h3 className="font-bold text-red-800 text-[16px]">New Emergency Request</h3>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup Location</div>
                                    <div className="font-bold text-blue-950 text-[16px]">{activeTrip.pickupAddress}</div>
                                </div>
                                <div className="text-right shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Est. Time</div>
                                    <div className="font-bold text-cyan-600 text-[15px]">{activeTrip.eta}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[12px] font-bold rounded-md">
                                    {activeTrip.type}
                                </span>
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-md">
                                    {activeTrip.distance} away
                                </span>
                            </div>

                            <button 
                                onClick={handleAcceptTrip}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-[16px] font-bold transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5"/> Accept Emergency Trip
                            </button>
                        </div>
                    </div>
                )}

                
                {isOnline && currentStatus === "ON_TRIP" && activeTrip && (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-cyan-500 mb-6">
                        
                        <div className="w-full h-48 bg-slate-200 relative">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(activeTrip.pickupAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                title="Navigation"
                            ></iframe>
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[13px] font-bold text-slate-700">Live GPS Active</span>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Info</div>
                                    <div className="font-bold text-blue-950 text-[16px]">{activeTrip.patientName}</div>
                                </div>
                                <button className="w-12 h-12 bg-cyan-50 hover:bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 transition-colors">
                                    <Phone className="w-5 h-5"/>
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-cyan-600 mt-0.5"/>
                                    <div>
                                        <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup</div>
                                        <div className="font-semibold text-slate-700">{activeTrip.pickupAddress}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Navigation className="w-5 h-5 text-indigo-600 mt-0.5"/>
                                    <div>
                                        <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Destination</div>
                                        <div className="font-semibold text-slate-700">{activeTrip.dropAddress}</div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleCompleteTrip}
                                className="w-full bg-blue-950 hover:bg-blue-900 text-white py-4 rounded-xl text-[16px] font-bold transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5"/> Mark as Picked Up
                            </button>
                        </div>
                    </div>
                )}

                
                {isOnline && !activeTrip && currentStatus === "AVAILABLE" && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-cyan-200 rounded-full animate-ping opacity-20"></div>
                            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center border-2 border-cyan-100 relative z-10">
                                <Clock className="w-8 h-8 text-cyan-600"/>
                            </div>
                        </div>
                        <h3 className="text-[18px] font-bold text-blue-950 mb-2">Waiting for Requests...</h3>
                        <p className="text-[14px] text-slate-500 max-w-xs mx-auto">Keep your app open and stay near your assigned zone to receive dispatches quickly.</p>
                    </div>
                )}
                
            </div>
        </div>
    );
}