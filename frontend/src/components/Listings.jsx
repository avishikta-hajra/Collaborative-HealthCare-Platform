import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft, X, MapPin, Phone, ShieldCheck,
    Star, Activity, Clock, Droplet, Wind, Loader2
} from 'lucide-react'

export default function Listings() {
    const navigate = useNavigate()

    // State for live listings and loading status
    const [listings, setListings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedListing, setSelectedListing] = useState(null)

    // Filter / sort state
    const [query, setQuery] = useState('')
    const [minBeds, setMinBeds] = useState(0)
    const [bloodGroup, setBloodGroup] = useState('Any')
    const [minBloodUnits, setMinBloodUnits] = useState(0)
    const [onlyWithBlood] = useState(false)
    const [sortBy, setSortBy] = useState('beds')

    const bloodGroups = ['Any', 'A+', 'B+', 'O+']

    const getAuthToken = () => {
        const authDataStr = localStorage.getItem("healthbridge.auth") || sessionStorage.getItem("healthbridge.auth");
        return authDataStr ? JSON.parse(authDataStr).accessToken : "";
    };

    useEffect(() => {
        const fetchListings = async (lat = null, lng = null) => {
            try {
                const token = getAuthToken();
                if (!token) {
                    setError("Unauthorized: Please log in to view live listings.");
                    setIsLoading(false);
                    return;
                }

                // Append coordinates to URL if we have them
                let url = 'http://localhost:8080/api/hospitals/live-listings';
                if (lat && lng) {
                    url += `?lat=${lat}&lng=${lng}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch listings. Please ensure you are logged in.');

                const data = await response.json();
                setListings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        // Try to get user's location before fetching
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchListings(position.coords.latitude, position.coords.longitude),
                (error) => {
                    console.warn("Location denied or failed, using fallback distances.");
                    fetchListings(); // Proceed without location
                },
                { timeout: 5000 }
            );
        } else {
            fetchListings();
        }
    }, []);

    // Derived visible list based on filters and sorting
    const visibleListings = useMemo(() => {
        const q = query.trim().toLowerCase()
        return listings.filter(l => {
            if (q && !(l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q))) return false
            if (Number(minBeds) && l.bedsAvailable < Number(minBeds)) return false
            if (onlyWithBlood && bloodGroup !== 'Any' && (!l.bloodUnits || (l.bloodUnits[bloodGroup] || 0) <= 0)) return false
            if (Number(minBloodUnits) && bloodGroup !== 'Any' && (l.bloodUnits?.[bloodGroup] || 0) < Number(minBloodUnits)) return false
            return true
        }).sort((a, b) => {
            switch (sortBy) {
                case 'beds': return b.bedsAvailable - a.bedsAvailable
                case 'distance': return (a.distanceKm || 0) - (b.distanceKm || 0)
                case 'blood': {
                    if (bloodGroup === 'Any') return 0
                    return (b.bloodUnits?.[bloodGroup] || 0) - (a.bloodUnits?.[bloodGroup] || 0)
                }
                default: return 0
            }
        })
    }, [listings, query, minBeds, bloodGroup, minBloodUnits, onlyWithBlood, sortBy])

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-slate-50">
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                    </button>
                </div>
            </div>

            <main className="pt-28 pb-8 px-4 md:px-10 lg:px-20">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-blue-950">Live Listings & Availability</h1>
                        <p className="text-slate-600 mt-2">Check real-time availability of hospital beds, oxygen cylinders, blood banks, and critical care units before you arrive.</p>
                    </header>

                    {/* Filter Section */}
                    <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search hospitals or locations" className="px-3 py-2 rounded-lg border border-slate-200 w-full md:w-80" />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-sm text-slate-600">Min Beds</label>
                                <input type="number" min={0} value={minBeds} onChange={(e) => setMinBeds(e.target.value)} className="px-2 py-1 w-20 rounded-lg border border-slate-200" />

                                <label className="text-sm text-slate-600">Blood Group</label>
                                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="px-2 py-1 rounded-lg border border-slate-200">
                                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                                <label className="text-sm text-slate-600 flex items-center gap-1">Number</label>
                                <input type="number" min={0} value={minBloodUnits} onChange={(e) => setMinBloodUnits(e.target.value)} className="px-2 py-1 w-20 rounded-lg border border-slate-200" />
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <label className="text-sm text-slate-600">Sort</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-1 rounded-lg border border-slate-200">
                                    <option value="beds">Beds (desc)</option>
                                    <option value="blood">Selected Blood Group (desc)</option>
                                    <option value="distance">Distance (asc)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium text-lg">Fetching live availability...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
                            <p className="text-red-600 font-bold text-lg mb-2">Error Loading Data</p>
                            <p className="text-red-500">{error}</p>
                            <button onClick={() => navigate('/login')} className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-sm text-slate-500 p-3">Showing {visibleListings.length} facilities</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {visibleListings.map((l) => (
                                    <div key={l.id} className="bg-white rounded-3xl p-6 border-sky-700 border-2 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 flex flex-col h-full group">
                                        
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h2 className="text-lg font-bold text-sky-950 group-hover:text-cyan-700 transition-colors leading-tight">{l.name}</h2>
                                                    {l.verified && <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" title="Verified Facility" />}
                                                </div>
                                                <p className="text-[13px] text-slate-500 flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {l.address}, {l.location}
                                                </p>
                                            </div>
                                            
                                            {/* Dynamic Ratings and Reviews on Card */}
                                            <div className="flex flex-col items-end pl-2 shrink-0">
                                                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200 mb-1">
                                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                                                    <span className="font-bold text-yellow-700 text-xs">{l.rating}</span>
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-400">{l.reviews} rev</span>
                                            </div>
                                        </div>

                                        {/* Dynamic Specialties on Card */}
                                        {l.specialties && l.specialties.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {l.specialties.map((spec, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-cyan-50 text-blue-800 text-[10px] font-bold rounded-md border border-cyan-100">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                                    <Activity className="w-4 h-4 text-cyan-600"/> ICU Beds: <span className="font-bold text-slate-800">{l.bedsAvailable}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                                    <Wind className="w-4 h-4 text-cyan-600"/> Oxygen: <span className="font-bold text-slate-800">{l.oxygenCylinders}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center gap-3 flex-wrap">
                                                {l.phone && <div className="text-[13px] text-slate-600 flex items-center gap-1.5"><Phone className="w-4 h-4 text-cyan-600"/> <a className="font-medium text-sky-700 hover:underline" href={`tel:${l.phone}`}>{l.phone}</a></div>}
                                                {typeof l.distanceKm !== 'undefined' && <div className="text-[13px] text-slate-600 font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">{l.distanceKm} km away</div>}
                                            </div>

                                            <div className="mt-5">
                                                <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">Blood Bank Units</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {l.bloodUnits && Object.entries(l.bloodUnits).map(([type, qty]) => (
                                                        <div key={type} className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${qty > 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : qty > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                            {type}: {qty}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button onClick={() => setSelectedListing(l)} className="w-full px-4 py-2.5 bg-cyan-600 font-bold text-white rounded-xl hover:bg-cyan-700 transition-colors shadow-sm cursor-pointer">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Modal for showing specific hospital details */}
            {selectedListing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedListing(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl border-2 border-sky-700 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-up" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Header */}
                        <div className="bg-white border-b-2 border-slate-100 p-6 flex items-center justify-between z-10 shrink-0">
                            <h2 className="text-xl md:text-2xl font-bold text-sky-950 flex items-center gap-2">
                                {selectedListing.name}
                                {selectedListing.verified && <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" title="Verified Facility" />}
                            </h2>
                            <button onClick={() => setSelectedListing(null)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors cursor-pointer shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Location & Contact */}
                            <div className="flex flex-col md:flex-row gap-4 justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div className="space-y-3">
                                    <p className="text-slate-600 flex items-start gap-2 font-medium">
                                        <MapPin className="w-5 h-5 text-cyan-600 shrink-0" />
                                        <span>{selectedListing.address}, {selectedListing.location} <br /><span className="text-[13px] font-bold text-slate-400">{selectedListing.distanceKm} km away</span></span>
                                    </p>
                                    <p className="text-slate-600 flex items-center gap-2 font-medium">
                                        <Phone className="w-5 h-5 text-cyan-600 shrink-0" />
                                        <a href={`tel:${selectedListing.phone}`} className="hover:text-cyan-700 font-bold transition-colors">{selectedListing.phone}</a>
                                    </p>
                                </div>
                                <div className="flex flex-row md:flex-col items-start md:items-end gap-3 flex-wrap">
                                    <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-yellow-700">{selectedListing.rating}</span>
                                        <span className="text-xs text-slate-500 ml-1 font-medium">({selectedListing.reviews} rev)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                                        <Clock className="w-4 h-4 text-red-500" />
                                        <span className="font-bold text-red-700 text-sm">Emergency: {selectedListing.emergency}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resources Grid */}
                            <div>
                                <h3 className="text-[18px] font-bold text-sky-950 mb-3">Live Availability Resources</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center">
                                        <Activity className="w-8 h-8 text-cyan-600 mb-2" />
                                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">ICU Beds</span>
                                        <span className={`text-2xl font-bold ${selectedListing.bedsAvailable > 5 ? 'text-emerald-600' : selectedListing.bedsAvailable > 0 ? 'text-amber-500' : 'text-red-500'}`}>{selectedListing.bedsAvailable}</span>
                                    </div>
                                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center">
                                        <Wind className="w-8 h-8 text-cyan-600 mb-2" />
                                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Oxygen Cylinders</span>
                                        <span className="text-2xl font-bold text-slate-800">{selectedListing.oxygenCylinders}</span>
                                    </div>
                                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center">
                                        <Droplet className="w-8 h-8 text-red-500 mb-2" />
                                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Blood Units</span>
                                        <div className="flex flex-wrap justify-center gap-1.5">
                                            {selectedListing.bloodUnits && Object.entries(selectedListing.bloodUnits).map(([type, qty]) => (
                                                <span key={type} className={`px-2 py-0.5 rounded-md text-[13px] font-bold border ${qty > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{type}: {qty}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Specialties */}
                            {selectedListing.specialties && selectedListing.specialties.length > 0 && (
                                <div>
                                    <h3 className="text-[18px] font-bold text-sky-950 mb-3">Medical Specialties</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedListing.specialties.map((spec, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-cyan-50 text-cyan-800 text-[13px] font-bold rounded-lg border border-cyan-100">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions (Ambulance Request Removed) */}
                        <div className="bg-white border-t-2 border-slate-100 p-6 flex shrink-0">
                            <button onClick={() => navigate('/telemedicine')} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3.5 rounded-xl text-[14px] font-bold transition-colors shadow-md cursor-pointer">
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}