import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, MapPin, Phone, 
    Clock, AlertCircle, 
    CheckCircle2, Navigation, User, X, 
    Truck, Activity, Info, Loader2, LocateFixed, Filter, Star
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buildAbsoluteUrl } from "../services/runtimeConfig";

const ambulanceTypes = [
    { id: "bls", name: "Basic Life Support (BLS)", desc: "For stable patients requiring basic monitoring.", baseCharge: "₹800", perKm: "₹15" },
    { id: "als", name: "Advanced Life Support (ALS)", desc: "Includes ventilator, defibrillator, and paramedic.", baseCharge: "₹2,500", perKm: "₹25" },
    { id: "nicu", name: "Neonatal (NICU)", desc: "Specialized transport for critically ill newborns.", baseCharge: "₹3,000", perKm: "₹30" }
];

const ambulanceIcon = new L.DivIcon({
    className: "custom-ambulance-icon",
    html: `<div style="background-color: white; border: 2px solid #0891b2; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 18px;">🚑</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const userIcon = new L.DivIcon({
    className: "custom-user-pin",
    html: `
      <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 100%; height: 100%; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.4));">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 38],
    popupAnchor: [0, -40]
});

function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

export default function AmbulanceService() {
    const navigate = useNavigate();
    
    const [bookingMode, setBookingMode] = useState("auto");
    
    const [patientPhone, setPatientPhone] = useState(""); 
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropLocation, setDropLocation] = useState(""); 
    const [userCoords, setUserCoords] = useState(null); 
    const [selectedType, setSelectedType] = useState("als");
    const [manualTypeFilter, setManualTypeFilter] = useState("all");

    const [liveUnits, setLiveUnits] = useState([]);
    const [isLoadingUnits, setIsLoadingUnits] = useState(false);

    const [tripDetails, setTripDetails] = useState({ status: "DISPATCHED" });

    const [dispatchState, setDispatchState] = useState(() => sessionStorage.getItem('dispatchState') || "idle");
    const [activeOrderId, setActiveOrderId] = useState(() => sessionStorage.getItem('activeOrderId') || null);
    
    const [assignedUnit, setAssignedUnit] = useState(() => {
        const saved = sessionStorage.getItem('assignedUnit');
        return saved ? JSON.parse(saved) : null;
    });
    
    const [etaCountdown, setEtaCountdown] = useState(() => {
        const saved = sessionStorage.getItem('etaCountdown');
        return saved ? parseInt(saved) : 0;
    });

    // Rating states
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [hasRated, setHasRated] = useState(false);

    const defaultCenter = [22.5726, 88.3639];

    const clearActiveTrip = () => {
        setDispatchState("idle");
        setActiveOrderId(null);
        setAssignedUnit(null);
        setEtaCountdown(0);
        setRating(0);
        setReviewText("");
        setHasRated(false);
        sessionStorage.removeItem('dispatchState');
        sessionStorage.removeItem('activeOrderId');
        sessionStorage.removeItem('assignedUnit');
        sessionStorage.removeItem('etaCountdown');
    };

    useEffect(() => {
        handleFetchLocation();
    }, []);

    // Backend Polling Logic
    useEffect(() => {
        let interval;
        if (activeOrderId && dispatchState === "assigned") {
            const fetchStatus = () => {
                fetch(buildAbsoluteUrl(`/api/ambulances/trip/${activeOrderId}/status`))
                .then(res => res.json())
                .then(data => {
                    setTripDetails(data);
                    
                    if(data.status === "COMPLETED") {
                        setDispatchState("completed");
                        sessionStorage.setItem('dispatchState', "completed");
                    } else if (data.status === "CANCELLED") {
                        alert("This trip was cancelled.");
                        clearActiveTrip();
                    }
                })
                .catch(console.error);
            };

            fetchStatus(); 
            interval = setInterval(fetchStatus, 5000); 
        }
        return () => clearInterval(interval);
    }, [activeOrderId, dispatchState]);

    const fetchNearbyAmbulances = (lat, lng) => {
        fetch(buildAbsoluteUrl(`/api/ambulances/nearby?lat=${lat}&lng=${lng}&radius=2000.0`), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' } 
        })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
            setLiveUnits(data);
            setIsLoadingUnits(false);
        })
        .catch(() => setIsLoadingUnits(false));
    };

    const handleFetchLocation = () => {
        if ("geolocation" in navigator) {
            setIsLoadingUnits(true);
            setPickupLocation("Locating...");
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserCoords({ lat: latitude, lng: longitude });
                    setPickupLocation("Current Location (Live GPS)"); 
                    fetchNearbyAmbulances(latitude, longitude); 
                },
                () => {
                    alert("Could not fetch location. Please enable location services or enter manually.");
                    setPickupLocation("");
                    setIsLoadingUnits(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    };

    const executeBooking = (unit) => {
        setDispatchState("searching");

        fetch(buildAbsoluteUrl("/api/ambulances/book"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Removed Authorization header
            body: JSON.stringify({
                ambulanceId: unit.id,
                pickupLat: userCoords?.lat || 22.5726,
                pickupLng: userCoords?.lng || 88.3639,
                pickupAddress: pickupLocation,
                dropAddress: dropLocation,
                patientPhoneNumber: patientPhone 
            })
        })
        .then(async res => {
            const text = await res.text();
            let data = text ? JSON.parse(text) : {};
            if (!res.ok) throw new Error(data.error || "Failed to secure ambulance.");
            return data;
        })
        .then(data => {
            const unitDetails = {
                provider: unit.provider,
                driver: "Waiting for details...", 
                vehicleNo: "Tracking Enabled",
                phone: "",
                type: unit.type,
                charge: ambulanceTypes.find(t => t.id.toLowerCase() === unit.type.toLowerCase())?.baseCharge || "Standard",
                lat: unit.lat,
                lng: unit.lng
            };

            setActiveOrderId(data.orderId); 
            setTripDetails({ status: "DISPATCHED" }); 
            setAssignedUnit(unitDetails);
            setEtaCountdown(parseInt(unit.eta));
            setDispatchState("assigned");

            sessionStorage.setItem('activeOrderId', data.orderId);
            sessionStorage.setItem('dispatchState', "assigned");
            sessionStorage.setItem('assignedUnit', JSON.stringify(unitDetails));
            sessionStorage.setItem('etaCountdown', parseInt(unit.eta));
        })
        .catch(err => {
            alert("Booking failed: " + err.message);
            setDispatchState("idle");
        });
    };

    const handleAutoDispatch = (e) => {
        e.preventDefault();
        if (!patientPhone || !pickupLocation || !dropLocation) return alert("Please fill in Phone Number, Pickup, and Drop locations."); 
        const closestMatch = liveUnits.find(u => u.type.toLowerCase() === selectedType.toLowerCase());
        if (!closestMatch) return alert("No ambulances of this type available.");
        executeBooking(closestMatch); 
    };

    const handleManualBooking = (unit) => {
        if (!patientPhone || !pickupLocation || !dropLocation) return alert("Please fill in Phone Number, Pickup, and Drop locations."); 
        executeBooking(unit); 
    };

    const cancelBooking = () => {
        if(window.confirm("Cancel this emergency request?")) {
            fetch(buildAbsoluteUrl(`/api/ambulances/trip/${activeOrderId}/cancel`), {
                method: 'POST' // Removed Authorization header
            })
            .then(() => clearActiveTrip())
            .catch(err => alert("Failed to cancel trip: " + err.message));
        }
    };

    const submitRating = () => {
        fetch(buildAbsoluteUrl(`/api/ambulances/trip/${activeOrderId}/rate`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Removed Authorization header
            body: JSON.stringify({ rating, review: reviewText })
        })
        .then(res => {
            if (res.ok) setHasRated(true);
            else alert("Failed to submit rating.");
        })
        .catch(() => alert("Network error."));
    };

    useEffect(() => {
        let interval;
        if (dispatchState === "assigned" && etaCountdown > 1) {
            interval = setInterval(() => {
                setEtaCountdown((prev) => {
                    const next = prev - 1;
                    sessionStorage.setItem('etaCountdown', next); 
                    return next;
                });
            }, 60000);
        }
        return () => clearInterval(interval);
    }, [dispatchState, etaCountdown]);

    const activeCharge = ambulanceTypes.find(t => t.id === selectedType)?.baseCharge;
    
    let currentCenter = defaultCenter;
    if (dispatchState === "assigned" && assignedUnit?.lat && assignedUnit?.lng) {
        currentCenter = [assignedUnit.lat, assignedUnit.lng];
    } else if (userCoords) {
        currentCenter = [userCoords.lat, userCoords.lng];
    }

    const filteredLiveUnits = manualTypeFilter === "all" ? liveUnits : liveUnits.filter(unit => unit.type.toLowerCase() === manualTypeFilter.toLowerCase());

    return (
        <div className="min-h-screen font-sans text-slate-800 bg-slate-50 border-t-2 pt-24 pb-16 pl-10 pr-10">
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full">
                    <button onClick={() => navigate('/')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                    </button>
                </div>
            </div>

            <div className="w-full px-2 md:px-4">
                <div className="text-center mt-8 mb-10">
                    <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                        Ambulance <span className="text-blue-900">Dispatch</span>
                    </h1>
                    <p className="text-slate-600 text-[18px] leading-relaxed max-w-5xl mx-auto mb-6">
                        Request immediate transport or schedule a specialized medical vehicle.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 overflow-hidden flex flex-col lg:flex-row min-h-[550px] mb-10 relative z-10">
                    <div className="w-full lg:w-[450px] flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-sky-200 bg-white relative z-20">
                        
                        {dispatchState === "idle" && (
                            <div className="flex flex-col h-full">
                                <div className="flex border-b-2 border-sky-200 bg-blue-50/50">
                                    <button onClick={() => setBookingMode("auto")} className={`flex-1 py-4 text-[15px] font-bold text-center border-b-2 transition-colors cursor-pointer ${bookingMode === "auto" ? "border-cyan-600 text-cyan-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Auto-Dispatch</button>
                                    <button onClick={() => setBookingMode("manual")} className={`flex-1 py-4 text-[15px] font-bold text-center border-b-2 transition-colors cursor-pointer ${bookingMode === "manual" ? "border-cyan-600 text-cyan-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Manual Selection</button>
                                </div>

                                <div className="p-6 flex-1 flex flex-col overflow-y-auto">

                                    <div className="mb-4">
                                        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Patient Phone</label>
                                        <div className="relative flex items-center">
                                            <Phone className="absolute left-4 text-blue-500 w-5 h-5" />
                                            <input 
                                                type="text" 
                                                value={patientPhone}
                                                onChange={(e) => setPatientPhone(e.target.value)}
                                                placeholder="Enter patient's registered phone number"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pickup Location</label>
                                        <div className="relative flex items-center">
                                            <MapPin className="absolute left-4 text-cyan-500 w-5 h-5" />
                                            <input 
                                                type="text" 
                                                value={pickupLocation}
                                                onChange={(e) => {
                                                    setPickupLocation(e.target.value);
                                                    setUserCoords(null);
                                                }}
                                                placeholder="Enter full address or landmark"
                                                className="w-full pl-11 pr-12 py-3.5 bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] transition-all shadow-sm"
                                            />
                                            <button 
                                                type="button"
                                                onClick={handleFetchLocation}
                                                title="Fetch Current Location"
                                                className="absolute right-2 p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <LocateFixed className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-6 pb-6 border-b border-slate-100">
                                        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Drop Location (Hospital)</label>
                                        <div className="relative flex items-center">
                                            <Navigation className="absolute left-4 text-emerald-500 w-5 h-5" />
                                            <input 
                                                type="text" 
                                                value={dropLocation}
                                                onChange={(e) => setDropLocation(e.target.value)}
                                                placeholder="Enter destination hospital or address"
                                                className="w-full pl-11 pr-12 py-3.5 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[14px] transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

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

                                    {bookingMode === "manual" && (
                                        <div className="flex flex-col flex-1">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider">Available Nearby</label>
                                                <div className="relative flex items-center">
                                                    <Filter className="w-3 h-3 text-cyan-600 absolute left-2 pointer-events-none"/>
                                                    <select 
                                                        value={manualTypeFilter}
                                                        onChange={(e) => setManualTypeFilter(e.target.value)}
                                                        className="pl-6 pr-2 py-1 text-[12px] font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer appearance-none transition-colors"
                                                    >
                                                        <option value="all">All Types</option>
                                                        {ambulanceTypes.map(type => (
                                                            <option key={type.id} value={type.id}>{type.id.toUpperCase()}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            {isLoadingUnits ? (
                                                <div className="flex flex-col items-center justify-center py-10">
                                                    <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-2" />
                                                    <span className="text-[13px] text-slate-500 font-medium">Finding live ambulances...</span>
                                                </div>
                                            ) : filteredLiveUnits.length === 0 ? (
                                                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[14px]">
                                                    {liveUnits.length === 0 ? "No available units found nearby." : `No ${manualTypeFilter.toUpperCase()} units found.`}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {filteredLiveUnits.map((unit) => (
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
                                                            <button className="w-full mt-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[13px] font-bold rounded-lg transition-colors cursor-pointer">
                                                                Select this unit
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {dispatchState === "searching" && (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                                <Activity className="w-10 h-10 text-cyan-600 animate-pulse mb-4" />
                                <h3 className="font-poppins text-xl font-bold text-blue-950 mb-2">Locking order in database...</h3>
                                <p className="text-[15px] text-slate-500">Securing your ambulance and locking the driver's queue.</p>
                            </div>
                        )}

                        {dispatchState === "assigned" && assignedUnit && (
                            <div className="flex flex-col h-full p-6 bg-white overflow-y-auto">
                                
                                {/* Dynamic Status Header based on Driver Acceptance */}
                                {tripDetails?.status === "DISPATCHED" ? (
                                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                                        <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-amber-800 text-[15px]">Pending Driver Confirmation</h4>
                                            <p className="text-amber-700 text-[13px] font-medium mt-1 leading-relaxed">Waiting for the assigned driver to accept your request...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-emerald-800 text-[15px]">Unit Arriving</h4>
                                            <p className="text-emerald-700 text-[13px] font-medium mt-1 leading-relaxed">Driver has accepted the request and is en route to your location.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Dynamic ETA Box */}
                                <div className="flex items-end gap-5 mb-6 pb-6 border-b-2 border-slate-100">
                                    <div className="bg-blue-950 text-white rounded-2xl p-4 min-w-[100px] text-center shadow-md">
                                        <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-1">ETA</div>
                                        <div className="text-3xl font-poppins font-bold">{etaCountdown}<span className="text-lg font-medium">m</span></div>
                                    </div>
                                    <div className="pb-1">
                                        <div className="text-blue-950 font-bold text-[16px] flex items-center gap-1.5">
                                            {/* Conditionally render Awaiting vs Approaching */}
                                            {tripDetails?.status === "DISPATCHED" ? (
                                                <><Clock className="w-5 h-5 text-amber-500" /> Awaiting Driver</>
                                            ) : (
                                                <><Navigation className="w-5 h-5 text-cyan-600 animate-pulse" /> Approaching</>
                                            )}
                                        </div>
                                        <div className="text-[13px] font-medium text-slate-500 mt-1.5">
                                            {tripDetails?.status === "DISPATCHED" 
                                                ? "Please wait while we lock in a driver." 
                                                : "Please keep your phone line clear."}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 flex-1 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
                                            <User className="w-6 h-6 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Driver / Provider</div>
                                            <div className="text-blue-950 text-[15px] font-bold">{tripDetails?.driverName || assignedUnit?.driver}</div>
                                            <div className="text-slate-500 font-medium text-[13px]">{assignedUnit?.provider}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
                                            <Truck className="w-6 h-6 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Vehicle Info</div>
                                            <div className="text-blue-950 text-[15px] font-bold">{tripDetails?.vehicleNumber || assignedUnit?.vehicleNo}</div>
                                            <div className="text-slate-500 font-medium text-[13px]">{assignedUnit?.type} • {assignedUnit?.charge}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <a 
                                        href={`tel:${tripDetails?.driverPhone || ''}`} 
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white py-3.5 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                    >
                                        <Phone className="w-5 h-5" /> Call Driver
                                    </a>
                                    <button 
                                        onClick={cancelBooking}
                                        className="bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 py-3.5 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <X className="w-5 h-5" /> Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {dispatchState === "completed" && (
                            <div className="flex flex-col items-center justify-start h-full p-8 text-center bg-emerald-50 shadow-inner overflow-y-auto">
                                <div className="w-20 h-20 bg-emerald-200 rounded-full flex items-center justify-center mb-4 mt-4 shrink-0">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-700" />
                                </div>
                                <h3 className="font-poppins text-2xl font-bold text-blue-950 mb-2">Emergency Handled</h3>
                                <p className="text-[14px] text-slate-600 mb-6 max-w-sm">The driver has marked this trip as successfully completed. We hope the patient is safe and receiving proper medical care.</p>
                                
                                {/* New Rating System */}
                                <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 mb-6 flex-1 flex flex-col justify-center">
                                    {!hasRated ? (
                                        <>
                                            <h4 className="font-bold text-blue-950 mb-3 text-[15px]">Rate your experience</h4>
                                            <div className="flex justify-center gap-2 mb-4">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star 
                                                        key={star}
                                                        className={`w-8 h-8 cursor-pointer transition-colors ${star <= (hoverRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-slate-200"}`}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => setRating(star)}
                                                    />
                                                ))}
                                            </div>
                                            <textarea 
                                                value={reviewText}
                                                onChange={e => setReviewText(e.target.value)}
                                                placeholder="Leave an optional review for the driver..."
                                                className="w-full p-3 rounded-xl border border-slate-200 mb-4 text-[13px] focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none h-20"
                                            />
                                            <button 
                                                onClick={submitRating}
                                                disabled={rating === 0}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-[14px] shadow-md"
                                            >
                                                Submit Feedback
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div className="bg-emerald-100 text-emerald-800 font-bold p-4 rounded-xl flex flex-col items-center gap-2 w-full">
                                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                                Thank you for your feedback!
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={clearActiveTrip}
                                    className="w-full bg-blue-950 hover:bg-blue-900 text-white py-4 rounded-xl text-[15px] font-bold shadow-md transition-all cursor-pointer mt-auto"
                                >
                                    Return to Dispatch Dashboard
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex-1 bg-slate-200 relative min-h-[300px] z-0">
                        <MapContainer 
                            center={currentCenter} 
                            zoom={13} 
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            <MapUpdater center={currentCenter} />

                            {userCoords && (
                                <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
                                    <Popup>
                                        <div className="font-bold text-center">Your Location</div>
                                    </Popup>
                                </Marker>
                            )}

                            {dispatchState === "assigned" && assignedUnit?.lat && assignedUnit?.lng ? (
                                <Marker position={[assignedUnit.lat, assignedUnit.lng]} icon={ambulanceIcon}>
                                    <Popup>
                                        <div className="font-bold">{assignedUnit.provider}</div>
                                        <div className="text-sm">En Route to you</div>
                                    </Popup>
                                </Marker>
                            ) : (
                                liveUnits.map((unit) => (
                                    unit.lat && unit.lng && (
                                        <Marker key={unit.id} position={[unit.lat, unit.lng]} icon={ambulanceIcon}>
                                            <Popup>
                                                <div className="font-bold">{unit.provider}</div>
                                                <div className="text-sm">Type: {unit.type}</div>
                                                <div className="text-sm font-semibold text-cyan-600">ETA: {unit.eta}</div>
                                            </Popup>
                                        </Marker>
                                    )
                                ))
                            )}
                        </MapContainer>
                    </div>
                </div>

                {/* Information Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
