import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { hospitalsData } from './Hospitals'

export default function Listings() {
    const navigate = useNavigate()

    // Build listings directly from hospitalsData so bedsAvailable stays consistent
    const initialListings = hospitalsData.map(h => ({
        id: h.id,
        name: h.name,
        location: h.city || h.address || '',
        bedsAvailable: Number(h.bedsAvailable) || 0,
        oxygenCylinders: h.oxygenCylinders ?? Math.max(5, Math.floor((Number(h.bedsAvailable) || 0) * 1.5)),
        bloodUnits: h.bloodUnits ?? {
            'A+': Math.max(0, Math.floor((Number(h.bedsAvailable) || 0) / 3)),
            'B+': Math.max(0, Math.floor((Number(h.bedsAvailable) || 0) / 4)),
            'O+': Math.max(0, Math.floor((Number(h.bedsAvailable) || 0) / 5))
        },
        phone: h.phone || '',
        distanceKm: typeof h.distance === 'number' ? h.distance : parseFloat(String(h.distance || '').replace(/[^0-9.]/g, '')) || 0,
        lastUpdated: new Date().toISOString()
    }))

    const [listings] = useState(initialListings)

    // Filter / sort state
    const [query, setQuery] = useState('')
    const [minBeds, setMinBeds] = useState(0)
    const [bloodGroup, setBloodGroup] = useState('Any')
    const [minBloodUnits, setMinBloodUnits] = useState(0)
    const [onlyWithBlood] = useState(false)
    const [sortBy, setSortBy] = useState('beds')

    const bloodGroups = ['Any', 'A+', 'B+', 'O+']

    // Derived visible list
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
                case 'distance': return a.distanceKm - b.distanceKm
                case 'blood': {
                    if (bloodGroup === 'Any') return 0
                    return (b.bloodUnits?.[bloodGroup] || 0) - (a.bloodUnits?.[bloodGroup] || 0)
                }
                default: return 0
            }
        })
    }, [listings, query, minBeds, bloodGroup, minBloodUnits, onlyWithBlood, sortBy])

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-linear-to-b from-cyan-100 via-indigo-100 to-blue-200 border-t-2">
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
                    <div className="text-sm text-slate-500 p-3">Showing {visibleListings.length} facilities</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visibleListings.map((l) => (
                            <div key={l.id} className="bg-white rounded-3xl p-8 border-sky-700 border-2 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 flex flex-col h-full">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold text-sky-950">{l.name}</h2>
                                        <p className="text-sm text-slate-500">{l.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`px-2 py-1 rounded-md text-xs font-semibold ${l.bedsAvailable > 5 ? 'bg-emerald-100 text-emerald-800' : l.bedsAvailable > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                            ICU: {l.bedsAvailable}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                                        <div className="text-sm text-slate-600">Oxygen: <span className="font-semibold text-slate-800">{l.oxygenCylinders}</span></div>
                                        {l.phone && <div className="text-sm text-slate-600">Phone: <a className="font-medium text-sky-700 hover:underline" href={`tel:${l.phone}`}>{l.phone}</a></div>}
                                        {typeof l.distanceKm !== 'undefined' && <div className="text-sm text-slate-600">Distance: <span className="font-medium text-slate-700">{l.distanceKm} km</span></div>}
                                    </div>

                                    <div className="mt-4">
                                        <div className="text-sm text-slate-600 mb-2">Blood Units</div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(l.bloodUnits).map(([type, qty]) => (
                                                <div key={type} className={`px-2 py-1 rounded-full text-xs font-semibold ${qty > 3 ? 'bg-emerald-100 text-emerald-800' : qty > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                                    {type}: {qty}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <button onClick={() => navigate('/hospitals')} className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 transition-colors">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
