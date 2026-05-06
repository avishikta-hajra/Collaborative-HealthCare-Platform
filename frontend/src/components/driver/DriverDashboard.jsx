import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Power, CheckCircle2, Phone, ShieldAlert, Clock } from "lucide-react";

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(false); 
    const [currentStatus, setCurrentStatus] = useState("AVAILABLE");
    const [activeTrip, setActiveTrip] = useState(null);
    
    const activeTripRef = useRef(null);

    const getAuthToken = () => {
        const authDataStr = localStorage.getItem("healthbridge.auth") || sessionStorage.getItem("healthbridge.auth");
        return authDataStr ? JSON.parse(authDataStr).accessToken : "";
    };

    // Make driver offline if tab/browser is closed
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isOnline) {
                fetch('http://localhost:8080/api/ambulances/driver/status', {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${getAuthToken()}` },
                    keepalive: true // Crucial: ensures request finishes even when closing tab
                }).catch(() => {});
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isOnline]);

    useEffect(() => {
        fetch('http://localhost:8080/api/ambulances/driver/me', {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setIsOnline(data.isOnline); })
        .catch(console.error);
    }, []);

    useEffect(() => {
        if (!isOnline) return;

        const fetchTrip = () => {
            fetch('http://localhost:8080/api/ambulances/driver/active-trip', {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            })
            .then(res => {
                if (res.status === 204) {
                    if (activeTripRef.current !== null) {
                        alert("The patient has cancelled the emergency request.");
                    }
                    setActiveTrip(null);
                    activeTripRef.current = null;
                    setCurrentStatus("AVAILABLE");
                    throw new Error("No trip");
                }
                return res.json();
            })
            .then(data => {
                if (data && data.id) {
                    setActiveTrip(data);
                    activeTripRef.current = data; 
                    
                    if (data.status === "DISPATCHED") setCurrentStatus("AVAILABLE");
                    else if (data.status === "ACCEPTED") setCurrentStatus("ON_TRIP");
                }
            })
            .catch(() => {});
        };

        fetchTrip(); 
        const interval = setInterval(fetchTrip, 5000); 
        return () => clearInterval(interval);
    }, [isOnline]);

    const toggleStatus = () => {
        const nextStatus = !isOnline;
        // Optimistic UI Update: change state instantly to fix the lag
        setIsOnline(nextStatus); 

        fetch('http://localhost:8080/api/ambulances/driver/status', {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        })
        .then(res => res.json())
        .then(data => setIsOnline(data.isOnline))
        .catch(() => {
            alert("Failed to update status.");
            setIsOnline(!nextStatus); // Revert on failure
        });
    };

    const handleAcceptTrip = () => {
        setCurrentStatus("ON_TRIP");
        const updatedTrip = {...activeTrip, status: "ACCEPTED"};
        setActiveTrip(updatedTrip);
        activeTripRef.current = updatedTrip; 

        fetch(`http://localhost:8080/api/ambulances/trip/${activeTrip.id}/accept`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        })
        .then(res => {
            if(!res.ok) alert("Failed to accept the trip.");
        })
        .catch(() => alert("Network error while accepting trip."));
    };

    const handleCompleteTrip = () => {
        const tripId = activeTrip.id;
        activeTripRef.current = null;

        fetch(`http://localhost:8080/api/ambulances/trip/${tripId}/complete`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        })
        .then(res => {
            if (res.ok) {
                setCurrentStatus("AVAILABLE");
                setActiveTrip(null);
            } else {
                alert("Failed to complete trip. Please try again.");
                activeTripRef.current = activeTrip; 
            }
        })
        .catch(err => {
            alert("Error completing trip");
            activeTripRef.current = activeTrip;
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-2">
            <div className="bg-white rounded-3xl p-6 shadow-xl border-sky-700 border-2 mb-6 flex items-center justify-between transition-all duration-300">
                <div>
                    <h2 className="text-[18px] font-bold text-sky-950 mb-1">Shift Status</h2>
                    <p className={`text-[14px] font-bold ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isOnline ? "Online • Polling DB for orders..." : "Offline"}
                    </p>
                </div>
                <button 
                    onClick={toggleStatus}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                        isOnline 
                        ? 'bg-red-500 hover:bg-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.4)]' 
                        : 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.4)]'
                    }`}
                >
                    <Power className="w-7 h-7 text-white"/>
                </button>
            </div>

            {isOnline && activeTrip && currentStatus === "AVAILABLE" && (
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-red-500 mb-6 animate-fade-in hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-red-50 border-b border-red-100 p-4 flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse"/>
                        <h3 className="font-bold text-red-800 text-[16px]">New Emergency Dispatch!</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup Location</div>
                                <div className="font-bold text-sky-950 text-[18px] leading-tight">{activeTrip.pickupAddress}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-3 py-1.5 bg-red-100 text-red-800 text-[13px] font-bold rounded-lg border border-red-200">
                                Patient: {activeTrip.patientName}
                            </span>
                        </div>

                        <button 
                            onClick={handleAcceptTrip}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl text-[16px] font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                            <CheckCircle2 className="w-5 h-5"/> Accept Emergency Request
                        </button>
                    </div>
                </div>
            )}

            {isOnline && currentStatus === "ON_TRIP" && activeTrip && (
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-cyan-600 mb-6 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-full h-56 bg-slate-200 relative">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(activeTrip.pickupAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                            title="Navigation">
                        </iframe>
                        <div className="absolute top-4 left-4 bg-white/95 px-4 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[14px] font-bold text-sky-950">Live GPS Active</span>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                            <div>
                                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Name</div>
                                <div className="font-bold text-sky-950 text-[18px]">{activeTrip.patientName}</div>
                            </div>
                            <a 
                                href={`tel:${activeTrip.patientPhone}`} 
                                className="w-12 h-12 bg-cyan-50 text-cyan-600 border border-cyan-200 hover:bg-cyan-100 rounded-full flex justify-center items-center cursor-pointer transition-colors"
                            >
                                <Phone className="w-5 h-5"/>
                            </a>
                        </div>

                        <div className="space-y-5 mb-8">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-cyan-600 mt-0.5"/>
                                <div>
                                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup Address</div>
                                    <div className="font-bold text-slate-800 text-[15px]">{activeTrip.pickupAddress}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Navigation className="w-6 h-6 text-emerald-600 mt-0.5"/>
                                <div>
                                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Destination</div>
                                    <div className="font-bold text-slate-800 text-[15px]">{activeTrip.dropAddress}</div>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleCompleteTrip}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl text-[16px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                        >
                            <CheckCircle2 className="w-5 h-5"/> Mark as Picked Up & Complete Trip
                        </button>
                    </div>
                </div>
            )}

            {isOnline && !activeTrip && currentStatus === "AVAILABLE" && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-xl border-sky-700 border-2">
                    <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center border-2 border-cyan-200 mb-6">
                        <Clock className="w-10 h-10 text-cyan-600 animate-pulse"/>
                    </div>
                    <h3 className="text-[20px] font-bold text-sky-950 mb-2">Waiting for Dispatches</h3>
                    <p className="text-[15px] text-slate-500 max-w-xs mx-auto">Keep your app open and stay near your assigned zone.</p>
                </div>
            )}
        </div>
    );
}