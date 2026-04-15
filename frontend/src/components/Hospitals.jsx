import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Search, MapPin, Star, Phone,
    Clock, Activity, Navigation, Filter, Hospital, ShieldCheck,
    Map as MapIcon, Route, Car, Info, X
} from "lucide-react";

// Hardcoded India-based hospital data
export const hospitalsData = [
    {
        id: 1,
        name: "Apollo Multispeciality Hospitals",
        city: "Kolkata",
        address: "58, Canal Circular Road, Kadapara, Phool Bagan",
        rating: 4.8,
        reviews: 1245,
        specialties: ["Cardiology", "Neurology", "Orthopedics"],
        emergency: "24/7",
        bedsAvailable: 42,
        phone: "+91 33 2320 3040",
        distance: "3.2 km",
        type: "Private",
        verified: true
    },
    {
        id: 2,
        name: "AMRI Hospitals",
        city: "Kolkata",
        address: "JC 16 & 17, Salt Lake City, Sector III",
        rating: 4.6,
        reviews: 890,
        specialties: ["Gastroenterology", "Oncology", "Pediatrics"],
        emergency: "24/7",
        bedsAvailable: 15,
        phone: "+91 33 6680 0000",
        distance: "5.1 km",
        type: "Private",
        verified: true
    },
    {
        id: 3,
        name: "Fortis Hospital",
        city: "Kolkata",
        address: "730, Anandapur, E.M. Bypass Road",
        rating: 4.7,
        reviews: 1102,
        specialties: ["Nephrology", "Urology", "General Surgery"],
        emergency: "24/7",
        bedsAvailable: 28,
        phone: "+91 33 6628 4444",
        distance: "7.4 km",
        type: "Private",
        verified: true
    },
    {
        id: 4,
        name: "All India Institute of Medical Sciences (AIIMS)",
        city: "New Delhi",
        address: "Sri Aurobindo Marg, Ansari Nagar",
        rating: 4.9,
        reviews: 8430,
        specialties: ["Multi-Specialty", "Research", "Trauma Care"],
        emergency: "24/7",
        bedsAvailable: 110,
        phone: "+91 11 2658 8500",
        distance: "1450 km",
        type: "Government",
        verified: true
    },
    {
        id: 5,
        name: "Manipal Hospital",
        city: "Bangalore",
        address: "98, HAL Old Airport Rd, Kodihalli",
        rating: 4.7,
        reviews: 2150,
        specialties: ["Cardiology", "Organ Transplant", "Obstetrics"],
        emergency: "24/7",
        bedsAvailable: 34,
        phone: "+91 80 2502 4444",
        distance: "1860 km",
        type: "Private",
        verified: true
    },
    {
        id: 6,
        name: "Tata Memorial Hospital",
        city: "Mumbai",
        address: "Dr. E Borges Road, Parel",
        rating: 4.8,
        reviews: 3200,
        specialties: ["Oncology", "Radiotherapy", "Surgical Oncology"],
        emergency: "24/7",
        bedsAvailable: 8,
        phone: "+91 22 2417 7000",
        distance: "1650 km",
        type: "Government-Aided",
        verified: true
    }
];

export default function Hospitals() {
    const navigate = useNavigate();

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("All");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");

    // Map & Routing State
    const [showMap, setShowMap] = useState(true);
    const [userLocation, setUserLocation] = useState("");
    const [selectedDestination, setSelectedDestination] = useState(hospitalsData[0].name);
    const [isRouting, setIsRouting] = useState(false);
    const [routeResult, setRouteResult] = useState(null);

    // Extract unique cities and specialties
    const cities = ["All", ...new Set(hospitalsData.map(h => h.city))];
    const specialties = ["All", ...new Set(hospitalsData.flatMap(h => h.specialties))].sort();

    // Filter logic
    const filteredHospitals = useMemo(() => {
        return hospitalsData.filter(hospital => {
            const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity === "All" || hospital.city === selectedCity;
            const matchesSpecialty = selectedSpecialty === "All" || hospital.specialties.includes(selectedSpecialty);

            return matchesSearch && matchesCity && matchesSpecialty;
        });
    }, [searchQuery, selectedCity, selectedSpecialty]);

    // Handle Route Simulation
    const handleGetRoute = (e) => {
        e.preventDefault();
        if (!userLocation || !selectedDestination) return;

        setIsRouting(true);
        setRouteResult(null);

        // Simulate API calculation delay
        setTimeout(() => {
            const destHospital = hospitalsData.find(h => h.name === selectedDestination);
            setIsRouting(false);
            setRouteResult({
                time: "18 mins",
                traffic: "Light traffic",
                distance: destHospital ? destHospital.distance : "5.4 km"
            });
        }, 1200);
    };

    const activeHospitalForMap = hospitalsData.find(h => h.name === selectedDestination) || hospitalsData[0];
    const mapQuery = encodeURIComponent(`${activeHospitalForMap.name}, ${activeHospitalForMap.city}, India`);

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

            {/* Main Content Wrapper - Set to full width with zero visual side-spaces */}
            <div className="w-full px-2 md:px-4">

                {/* Header Section */}
                <div className="text-center mt-8">
                    <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                        Locate <span className="text-blue-900">Healthcare Facilities</span>
                    </h1>
                    <p className="text-slate-600 text-[18px] leading-relaxed max-w-5xl mx-auto mb-6">
                        Find verified hospitals, monitor critical care bed availability, and generate immediate routing for emergency situations.
                    </p>
                </div>

                {/* Map & Routing Section (Toggleable) */}
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-800 text-[14px] font-semibold rounded-lg border-sky-700 border-2 hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
                    >
                        {showMap ? <><X className="w-5 h-5" /> Hide Map</> : <><MapIcon className="w-5 h-5" /> Show Map & Routes</>}
                    </button>
                </div>

                {showMap && (
                    <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 overflow-hidden mb-10 flex flex-col lg:flex-row h-auto lg:h-[420px]">
                        {/* Map iframe */}
                        <div className="w-full lg:w-2/3 h-[300px] lg:h-full bg-slate-100 relative">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                title="Hospital Location Map"
                            ></iframe>
                        </div>

                        {/* Routing Panel */}
                        <div className="w-full lg:w-1/3 p-5 flex flex-col bg-linear-to-br from-cyan-50 to-blue-50 border-l-2 border-sky-200">
                            <div className="flex items-center gap-2 mb-5">
                                <Route className="w-6 h-6 text-cyan-600" />
                                <h3 className="font-poppins font-bold text-xl text-blue-950">Route Planner</h3>
                            </div>

                            <form onSubmit={handleGetRoute} className="flex flex-col gap-4 flex-1">
                                <div>
                                    <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Starting Point</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            required
                                            value={userLocation}
                                            onChange={(e) => setUserLocation(e.target.value)}
                                            placeholder="Your current location"
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Destination</label>
                                    <div className="relative">
                                        <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                                        <select
                                            value={selectedDestination}
                                            onChange={(e) => setSelectedDestination(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] truncate transition-all appearance-none shadow-sm cursor-pointer"
                                        >
                                            {hospitalsData.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isRouting}
                                    className="mt-3 w-full bg-blue-950 hover:bg-blue-800 text-white py-2.5 rounded-xl text-[15px] font-semibold tracking-widest transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                                >
                                    {isRouting ? "Calculating route..." : "Get Directions"}
                                </button>
                            </form>

                            {/* Simulated Route Result */}
                            {routeResult && (
                                <div className="mt-4 p-3.5 bg-white border border-emerald-200 rounded-xl shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[14px]">
                                            <Car className="w-5 h-5" /> {routeResult.time}
                                        </span>
                                        <span className="text-slate-600 font-semibold text-sm">{routeResult.distance}</span>
                                    </div>
                                    <p className="text-emerald-600 text-xs font-medium flex items-center gap-1 mt-1">
                                        <Info className="w-4 h-4" /> {routeResult.traffic} via fastest route
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 p-4 mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search hospitals or localities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] transition-all"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="relative w-full md:w-48">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer transition-all"
                            >
                                {cities.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>

                        <div className="relative w-full md:w-56">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer transition-all"
                            >
                                {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Hospital Grid - Strictly locked to 3 columns max */}
                {filteredHospitals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
                        {filteredHospitals.map((hospital) => (
                            <div key={hospital.id} className="bg-white border-sky-700 border-2 rounded-2xl p-4 md:p-5 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 flex flex-col group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h3 className="font-poppins text-[16px] md:text-[18px] font-bold text-sky-950 group-hover:text-cyan-700 transition-colors leading-tight">{hospital.name}</h3>
                                            {hospital.verified && <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" title="Verified Facility" />}
                                        </div>
                                        <p className="text-slate-500 text-[12px] flex items-center gap-1.5 leading-snug">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            {hospital.address}, {hospital.city}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end pl-2 shrink-0">
                                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200 mb-1">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                                            <span className="font-bold text-yellow-700 text-xs">{hospital.rating}</span>
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400">{hospital.reviews} rev</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {hospital.specialties.map((spec, index) => (
                                        <span key={index} className="px-2 py-1 bg-cyan-50 text-blue-800 text-[10px] font-bold rounded-md border border-cyan-100">
                                            {spec}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 mb-5 mt-auto">
                                    <div className="flex items-center gap-2 p-2 rounded-xl border-2 border-slate-100 bg-slate-50">
                                        <Activity className="w-4 h-4 text-cyan-600 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5 line-clamp-1">ICU Beds</p>
                                            <p className="text-sky-950 text-[12px] font-bold">{hospital.bedsAvailable} Available</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-xl border-2 border-slate-100 bg-slate-50">
                                        <Clock className="w-4 h-4 text-red-500 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5 line-clamp-1">Emergency</p>
                                            <p className="text-sky-950 text-[12px] font-bold">{hospital.emergency}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 border-t-2 border-slate-100 pt-4">
                                    <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-colors cursor-pointer">
                                        Book Appoinment
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowMap(true);
                                            setSelectedDestination(hospital.name);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="p-2 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-800 rounded-xl transition-colors cursor-pointer"
                                        title="Get Directions"
                                    >
                                        <Navigation className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-800 rounded-xl transition-colors cursor-pointer" title="Contact Hospital">
                                        <Phone className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border-sky-700 border-2 rounded-3xl shadow-xl">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="font-poppins text-2xl font-bold text-sky-950 mb-2">No facilities found</h3>
                        <p className="text-slate-500 text-[16px]">We couldn't find any hospitals matching your current filters.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCity("All"); setSelectedSpecialty("All"); }}
                            className="mt-6 text-cyan-600 text-[16px] font-bold hover:text-blue-900 transition-colors cursor-pointer"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}