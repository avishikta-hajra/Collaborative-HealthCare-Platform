import React, { useState } from 'react';
import { Activity, Hospital, Building2, Code2, Database } from 'lucide-react';

const About = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (type) => {
        setActiveDropdown(activeDropdown === type ? null : type);
    };

    // Localized sample data for the prototype
    const healthCenters = [
        {
            id: 1,
            name: "Sector V Primary Health Clinic",
            location: "Salt Lake Sector V",
            phone: "+91 98765 43210",
            services: "Primary Care, First Aid, General Checkups"
        },
        {
            id: 2,
            name: "Community Wellness Outpost",
            location: "New Town",
            phone: "+91 98765 43211",
            services: "Vaccination, Nutrition Consulting"
        }
    ];

    const hospitals = [
        {
            id: 1,
            name: "Apollo Multispeciality Hospitals",
            location: "Kolkata",
            address: "58, Canal Circular Road, Kadapara",
            specialties: "Cardiology, Neurology, Emergency",
            emergency: "24/7",
            bedsAvailable: 12,
            phone: "+91 33 2320 3040",
            type: "Private"
        },
        {
            id: 2,
            name: "AMRI Hospitals",
            location: "Salt Lake",
            address: "JC 16 & 17, Sector III",
            specialties: "Gastroenterology, Pediatrics",
            emergency: "24/7",
            bedsAvailable: 5,
            phone: "+91 33 6680 0000",
            type: "Private"
        },
        {
            id: 3,
            name: "Fortis Hospital",
            location: "Anandapur",
            address: "730, E.M. Bypass Road",
            specialties: "General Surgery, Orthopedics",
            emergency: "24/7",
            bedsAvailable: 8,
            phone: "+91 33 6628 4444",
            type: "Private"
        },
        {
            id: 4,
            name: "Ruby General Hospital",
            location: "Kasba",
            address: "Kasba Golpark, E.M. Bypass",
            specialties: "Trauma Care, Oncology",
            emergency: "24/7",
            bedsAvailable: 15,
            phone: "+91 33 2398 7111",
            type: "Private"
        }
    ];

    const OrganizationCard = ({ org, type }) => (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col h-full">
            <h4 className="text-[17px] font-semibold text-slate-800 mb-2">
                {org.name}
            </h4>
            <div className="text-slate-600 text-sm leading-relaxed grow flex flex-col space-y-2">
                <div className="flex items-start gap-2">
                    <span className="shrink-0 text-slate-400">📍</span>
                    <span>{org.address || org.location}</span>
                </div>
                {org.phone && (
                    <div className="flex items-start gap-2">
                        <span className="shrink-0 text-slate-400">📞</span>
                        <span>{org.phone}</span>
                    </div>
                )}
                {org.website && (
                    <div className="flex items-start gap-2">
                        <span className="shrink-0 text-slate-400">🌐</span>
                        <span className="text-blue-600 hover:underline cursor-pointer">{org.website}</span>
                    </div>
                )}
                <div className="mt-auto pt-4 border-t-2 border-slate-100">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                        {type === 'hospital' ? 'Specialties' : 'Services'}
                    </p>
                    <p className="text-sm text-slate-700">
                        {org.specialties || org.services}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 mt-16">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Top Section - Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Main Project Details */}
                    <div className="md:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">HealthBridge Platform</h2>
                            <p className="text-slate-500">A collaborative health intelligence platform built by Team QuantumBeings.</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                Why We Built This
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Managing medical records and connecting with emergency services is often fragmented. 
                                We designed this platform to explore how modern web frameworks 
                                can bridge the gap between patients, local hospitals, and health centers. Our goal is to 
                                demonstrate a unified, accessible hub for medical profiles and real-time care connectivity.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-emerald-500" />
                                Core Features
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    Unified Patient Profiles
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    Live Telemedicine Pipeline
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    Location-Based Ambulance Services
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    AI-Powered Medical Report Summarization
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Project Stats */}
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-indigo-500" />
                                Project Status
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Development Phase</p>
                                    <p className="font-medium text-slate-800">Active Development</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-100">
                                        <p className="text-xl font-bold text-blue-600">45+</p>
                                        <p className="text-xs text-slate-500">Mock Users</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-100">
                                        <p className="text-xl font-bold text-emerald-600">6</p>
                                        <p className="text-xs text-slate-500">Test Facilities</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <p className="text-sm text-blue-800 leading-relaxed">
                                <strong>Note:</strong> The data populated in the network section below is 
                                currently using mock entries to demonstrate the live pipeline capabilities.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Connected Organizations Section */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Network Directory</h2>
                        <p className="text-slate-500">Explore the simulated healthcare providers mapped in our system.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Health Centers */}
                        <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
                            <button
                                onClick={() => toggleDropdown('healthCenters')}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <Hospital className="text-blue-600 w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-slate-800">
                                        Primary Health Centers ({healthCenters.length})
                                    </span>
                                </div>
                                <span className="text-sm text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded-md border border-slate-200">
                                    {activeDropdown === 'healthCenters' ? 'Hide' : 'Expand'}
                                </span>
                            </button>
                            {activeDropdown === 'healthCenters' && (
                                <div className="p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-slate-200">
                                    {healthCenters.map((center) => (
                                        <OrganizationCard key={center.id} org={center} type="healthCenter" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hospitals */}
                        <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
                            <button
                                onClick={() => toggleDropdown('hospitals')}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                        <Building2 className="text-indigo-600 w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-slate-800">
                                        Hospital Network Directory ({hospitals.length})
                                    </span>
                                </div>
                                <span className="text-sm text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded-md border border-slate-200">
                                    {activeDropdown === 'hospitals' ? 'Hide' : 'Expand'}
                                </span>
                            </button>
                            {activeDropdown === 'hospitals' && (
                                <div className="p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t-2 border-slate-200">
                                    {hospitals.map((hospital) => (
                                        <OrganizationCard key={hospital.id} org={hospital} type="hospital" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;