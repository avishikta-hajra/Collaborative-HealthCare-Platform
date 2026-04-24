import React, { useState } from 'react';
import { Award, Hospital, HeartHandshake, Building2 } from 'lucide-react';

const About = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (type) => {
        setActiveDropdown(activeDropdown === type ? null : type);
    };

    // Sample data for connected organizations
    const healthCenters = [
        {
            id: 1,
            name: "City General Health Center",
            location: "Downtown District",
            phone: "+91 98765 43210",
            services: "Primary Care, Vaccination, Health Checkups"
        },
        {
            id: 2,
            name: "Community Wellness Center",
            location: "Suburb Area",
            phone: "+91 98765 43211",
            services: "Maternal Health, Child Care, Nutrition"
        },
        {
            id: 3,
            name: "Rural Health Outpost",
            location: "Village Center",
            phone: "+91 98765 43212",
            services: "Emergency Care, Mobile Clinics, Telemedicine"
        }
    ];

    const ngos = [
        {
            id: 1,
            name: "Health for All Foundation",
            location: "Regional Office",
            website: "www.healthforall.org",
            focus: "Community Health Education, Disease Prevention"
        },
        {
            id: 2,
            name: "Women & Child Welfare NGO",
            location: "District Center",
            website: "www.wcwelfare.org",
            focus: "Maternal Health, Child Nutrition, Family Planning"
        },
        {
            id: 3,
            name: "Rural Healthcare Initiative",
            location: "Multiple Villages",
            website: "www.ruralhealthcare.org",
            focus: "Mobile Medical Units, Health Camps, Awareness Programs"
        }
    ];

    const hospitals = [
        {
            id: 1,
            name: "Apollo Multispeciality Hospitals",
            location: "Kolkata",
            address: "58, Canal Circular Road, Kadapara, Phool Bagan",
            rating: 4.8,
            reviews: 1245,
            specialties: "Cardiology, Neurology, Orthopedics",
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
            location: "Kolkata",
            address: "JC 16 & 17, Salt Lake City, Sector III",
            rating: 4.6,
            reviews: 890,
            specialties: "Gastroenterology, Oncology, Pediatrics",
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
            location: "Kolkata",
            address: "730, Anandapur, E.M. Bypass Road",
            rating: 4.7,
            reviews: 1102,
            specialties: "Nephrology, Urology, General Surgery",
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
            location: "New Delhi",
            address: "Sri Aurobindo Marg, Ansari Nagar",
            rating: 4.9,
            reviews: 8430,
            specialties: "Multi-Specialty, Research, Trauma Care",
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
            location: "Bangalore",
            address: "98, HAL Old Airport Rd, Kodihalli",
            rating: 4.7,
            reviews: 2150,
            specialties: "Cardiology, Organ Transplant, Obstetrics",
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
            location: "Mumbai",
            address: "Dr. E Borges Road, Parel",
            rating: 4.8,
            reviews: 3200,
            specialties: "Oncology, Radiotherapy, Surgical Oncology",
            emergency: "24/7",
            bedsAvailable: 8,
            phone: "+91 22 2417 7000",
            distance: "1650 km",
            type: "Government-Aided",
            verified: true
        }
    ];

    const OrganizationCard = ({ org, type }) => (
        <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 flex flex-col h-full group">
            <h4 className="text-[18px] font-bold text-sky-950 mb-3 group-hover:text-cyan-700 transition-colors">
                {org.name}
            </h4>
            <div className="text-slate-500 text-[14px] leading-relaxed grow flex flex-col">
                <div className="mb-2 flex items-start gap-2">
                    <span className="text-cyan-500 shrink-0">📍</span>
                    <span>{org.location}</span>
                </div>
                {org.phone && (
                    <div className="mb-2 flex items-start gap-2">
                        <span className="text-cyan-500 shrink-0">📞</span>
                        <span>{org.phone}</span>
                    </div>
                )}
                {org.website && (
                    <div className="mb-2 flex items-start gap-2">
                        <span className="text-cyan-500 shrink-0">🌐</span>
                        <span className="text-cyan-700 hover:underline cursor-pointer">{org.website}</span>
                    </div>
                )}
                <div className="mt-auto pt-4 border-t-2 border-slate-50">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {type === 'hospital' ? 'Specialties:' : type === 'ngo' ? 'Focus Areas:' : 'Services:'}
                    </p>
                    <p className="text-[14px] font-semibold text-slate-700">
                        {org.specialties || org.focus || org.services}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 mt-25">
            <div className="max-w-6xl mx-auto">

                {/* Top Section - Website Info & Certificate */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                    {/* Left Side - Website Information */}
                    <div className="bg-white border-sky-700 border-2 rounded-3xl p-8 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300">
                        <div className="text-center mb-8">
                            <strong className="text-gray-500">
                                Connecting Communities with Quality Healthcare
                            </strong>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-l-4 border-blue-500 pl-4">
                                Project Information
                            </h3>
                            <div className="pl-5 text-sm text-gray-500">
                                <p className="mb-2">
                                    <span className="font-medium">Team Name:</span> QuantumBeings
                                </p>
                                <p className="mb-2">
                                    <span className="font-medium">Development Started:</span> April 2026
                                </p>
                                <p className="mb-2">
                                    <span className="font-medium">Version:</span> 1.0.0
                                </p>
                                <p>
                                    <span className="font-medium">Platform:</span> Web Application
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-l-4 border-emerald-500 pl-4">
                                Mission Statement
                            </h3>
                            <p className="pl-5 text-sm text-gray-500">
                                Health Bridge is a Collaborative Health Intelligence Platform that integrates electronic health records (EHR), AI insights, secure data sharing, and telemedicine to connect patients, providers, and health systems. By leveraging technology, we bridge gaps in care to make healthcare more accessible, affordable, and efficient for every community — including marginalized populations.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-l-4 border-purple-500 pl-4">
                                Key Features
                            </h3>
                            <ul className="pl-5 text-sm text-gray-500 space-y-1">
                                <li>
                                    • <strong>Health Resource Hub</strong> – Instant medical aid and ambulance access.
                                </li>
                                <li>
                                    • <strong>Telemedicine</strong> – Connect with top doctors online, anytime.
                                </li>
                                <li>
                                    • <strong>Program & Campaign Tracker</strong> – Track and manage health initiatives with ease.
                                </li>
                                <li>
                                    • <strong>Health & Wellness Module</strong> – Nutrition, fitness, and lifestyle support in one hub.
                                </li>
                                <li>
                                    • <strong>Feedback</strong> – Share your views to help improve our services.
                                </li>
                                <li>
                                    • <strong>Real-time Emergency Services</strong> – Immediate help when every second counts.
                                </li>

                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Certificate & Rating */}
                    <div>

                        {/* Certificate Card */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-lg p-8 mb-6 border-2 border-yellow-400  hover:-translate-y-1 transition-all duration-300">
                            <div className="text-center">
                                <div className="text-6xl text-yellow-500 mb-2.5 flex justify-center">
                                    <Award className="w-16 h-16 text-yellow-600 mb-4 mx-auto" />
                                </div>
                                <div className="h-[150px] bg-white rounded-lg p-4 pt-12 shadow-inner mb-5">
                                    <p className="text-[15px] text-gray-400 mt-2 mb-4">
                                        Placeholder to upload Web Application Security Certificate
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-2.5 shadow-inner">
                                    <p className="text-sm text-gray-400">Certified by</p>
                                    <p className="font-bold text-gray-700">
                                        Organisation Name
                                    </p>
                                    <p className="text-xs text-gray-300 mt-2">
                                        Certificate ID:
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rating Card */}
                        <div className="bg-white border-sky-700 border-2 rounded-3xl p-8 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                    User Satisfaction
                                </h2>
                                <div className="flex justify-center items-center mb-4">
                                    <span className="text-5xl font-bold text-emerald-500 mr-2">
                                        4.8
                                    </span>
                                    <div>
                                        <div className="text-yellow-400 text-xl mb-0.5">
                                            ⭐⭐⭐⭐⭐
                                        </div>
                                        <span className="text-gray-400 text-sm">out of 5</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-6">
                                    Based on 2,847 user reviews
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-100 rounded-lg p-3">
                                        <p className="text-2xl font-bold text-blue-600">
                                            15,000+
                                        </p>
                                        <p className="text-sm text-gray-500">Active Users</p>
                                    </div>
                                    <div className="bg-green-100 rounded-lg p-3">
                                        <p className="text-2xl font-bold text-green-600">
                                            98%
                                        </p>
                                        <p className="text-sm text-gray-500">Uptime</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Connected Organizations Section */}
                <div className="bg-white border-sky-700 border-2 rounded-3xl p-8 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300">
                    <div className="text-center mb-10">
                        <h2 className="font-poppins text-2xl md:text-3xl font-bold text-blue-950 tracking-widest mb-3">
                            Our Network <span className="text-blue-900">Partners</span>
                        </h2>
                        <p className="text-slate-600 text-[18px]">
                            Healthcare providers we're proud to work with
                        </p>
                    </div>

                    <div className="mb-2">

                        {/* Health Centers */}
                        <div className="border-2 border-blue-200 rounded-2xl overflow-hidden mb-5">
                            <button
                                onClick={() => toggleDropdown('healthCenters')}
                                className="w-full flex items-center justify-between p-5 bg-blue-50 hover:bg-blue-100 border-none cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-200 flex items-center justify-center shrink-0">
                                        <Hospital className="text-blue-700 w-5 h-5" />
                                    </div>
                                    <span className="font-poppins font-bold text-[18px] text-blue-950">
                                        Health Centers ({healthCenters.length})
                                    </span>
                                </div>
                                <span className="text-blue-500 font-bold px-3 py-1 bg-white rounded-lg shadow-sm border border-blue-100">
                                    {activeDropdown === 'healthCenters' ? 'Hide' : 'View'}
                                </span>
                            </button>
                            {activeDropdown === 'healthCenters' && (
                                <div className="p-6 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t-2 border-blue-100">
                                    {healthCenters.map((center) => (
                                        <OrganizationCard key={center.id} org={center} type="healthCenter" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* NGOs */}
                        <div className="border-2 border-emerald-200 rounded-2xl overflow-hidden mb-5">
                            <button
                                onClick={() => toggleDropdown('ngos')}
                                className="w-full flex items-center justify-between p-5 bg-emerald-50 hover:bg-emerald-100 border-none cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-200 flex items-center justify-center shrink-0">
                                        <HeartHandshake className="text-emerald-700 w-5 h-5" />
                                    </div>
                                    <span className="font-poppins font-bold text-[18px] text-emerald-950">
                                        NGO Partners ({ngos.length})
                                    </span>
                                </div>
                                <span className="text-emerald-500 font-bold px-3 py-1 bg-white rounded-lg shadow-sm border border-emerald-100">
                                    {activeDropdown === 'ngos' ? 'Hide' : 'View'}
                                </span>
                            </button>
                            {activeDropdown === 'ngos' && (
                                <div className="p-6 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t-2 border-emerald-100">
                                    {ngos.map((ngo) => (
                                        <OrganizationCard key={ngo.id} org={ngo} type="ngo" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hospitals */}
                        <div className="border-2 border-indigo-200 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => toggleDropdown('hospitals')}
                                className="w-full flex items-center justify-between p-5 bg-indigo-50 hover:bg-indigo-100 border-none cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-200 flex items-center justify-center shrink-0">
                                        <Building2 className="text-indigo-700 w-5 h-5" />
                                    </div>
                                    <span className="font-poppins font-bold text-[18px] text-indigo-950">
                                        Hospital Network ({hospitals.length})
                                    </span>
                                </div>
                                <span className="text-indigo-500 font-bold px-3 py-1 bg-white rounded-lg shadow-sm border border-indigo-100">
                                    {activeDropdown === 'hospitals' ? 'Hide' : 'View'}
                                </span>
                            </button>
                            {activeDropdown === 'hospitals' && (
                                <div className="p-6 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t-2 border-indigo-100">
                                    {hospitals.map((hospital) => (
                                        <OrganizationCard key={hospital.id} org={hospital} type="hospital" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default About;