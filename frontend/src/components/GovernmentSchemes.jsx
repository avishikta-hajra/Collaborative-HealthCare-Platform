import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Search, Filter, Landmark, 
    CheckCircle2, AlertCircle, FileCheck, 
    ChevronRight, Loader2, Building2, IndianRupee, Info
} from "lucide-react";

// Mock Data: Government Healthcare Schemes (India)
const schemesData = [
    {
        id: "pmjay",
        name: "Ayushman Bharat (PM-JAY)",
        type: "Central",
        coverage: "₹5,00,000 / family / year",
        target: "BPL Families, SECC 2011 Database",
        desc: "World's largest health insurance scheme fully financed by the government, covering secondary and tertiary care hospitalization.",
        requirements: ["Aadhar Card", "Ration Card", "SECC Name Match"],
        tags: ["Cashless", "Paperless"]
    },
    {
        id: "cghs",
        name: "Central Govt Health Scheme (CGHS)",
        type: "Central",
        coverage: "Comprehensive Care",
        target: "Central Govt Employees & Pensioners",
        desc: "Provides comprehensive medical care to the Central Government employees, pensioners and their dependents.",
        requirements: ["CGHS Card", "Employment Proof"],
        tags: ["Dispensary Access", "Reimbursement"]
    },
    {
        id: "swasthya-sathi",
        name: "Swasthya Sathi",
        type: "State",
        state: "West Bengal",
        coverage: "₹5,00,000 / family / year",
        target: "All permanent residents of West Bengal",
        desc: "Basic health cover for secondary and tertiary care up to ₹5 Lakhs per annum per family.",
        requirements: ["Swasthya Sathi Smart Card", "Aadhar Card"],
        tags: ["State Cashless", "Smart Card"]
    },
    {
        id: "cmchis",
        name: "Chief Minister's Comprehensive Health Insurance",
        type: "State",
        state: "Tamil Nadu",
        coverage: "₹5,00,000 / family / year",
        target: "Annual income less than ₹1,20,000",
        desc: "Empaneled government and private hospitals provide cashless hospitalization for specified ailments.",
        requirements: ["Income Certificate", "Ration Card", "TN Resident"],
        tags: ["Cashless", "Critical Illness"]
    },
    {
        id: "awaz",
        name: "Awaz Health Insurance",
        type: "State",
        state: "Kerala",
        coverage: "₹15,000 health, ₹2 Lakh death",
        target: "Migrant Labourers in Kerala",
        desc: "Aimed at providing health insurance and death benefit to migrant workers living in Kerala.",
        requirements: ["Labour Registration", "ID Proof"],
        tags: ["Migrant Support", "Accident Cover"]
    },
    {
        id: "esic",
        name: "Employees' State Insurance (ESIC)",
        type: "Central",
        coverage: "Full Medical Care",
        target: "Factory workers earning ≤ ₹21,000/month",
        desc: "Self-financing social security and health insurance scheme for Indian workers.",
        requirements: ["ESIC Pehchan Card", "Employer Contribution"],
        tags: ["Maternity Benefit", "Disability"]
    }
];

export default function GovernmentSchemes() {
    const navigate = useNavigate();
    
    // Core States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All"); // All | Central | State
    
    // Eligibility Form States
    const [isChecking, setIsChecking] = useState(false);
    const [eligibilityChecked, setEligibilityChecked] = useState(false);
    const [formData, setFormData] = useState({
        state: "",
        income: "",
        category: "general"
    });

    // Derived Data
    const filteredSchemes = useMemo(() => {
        return schemesData.filter(scheme => {
            const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  scheme.desc.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === "All" || scheme.type === filterType;
            
            // If eligibility is checked, simulate filtering
            let matchesEligibility = true;
            if (eligibilityChecked) {
                if (scheme.type === "State" && scheme.state !== formData.state && formData.state !== "") {
                    matchesEligibility = false;
                }
            }

            return matchesSearch && matchesType && matchesEligibility;
        });
    }, [searchQuery, filterType, eligibilityChecked, formData]);

    const handleCheckEligibility = (e) => {
        e.preventDefault();
        setIsChecking(true);
        setEligibilityChecked(false);
        
        // Simulate API verification delay
        setTimeout(() => {
            setIsChecking(false);
            setEligibilityChecked(true);
        }, 1500);
    };

    const clearEligibility = () => {
        setEligibilityChecked(false);
        setFormData({ state: "", income: "", category: "general" });
    };

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

            {/* Main Content Wrapper */}
            <div className="w-full px-2 md:px-4">
                
                {/* Header Section */}
                <div className="text-center mt-8 mb-10">
                    <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                        Government <span className="text-blue-900">Health Schemes</span>
                    </h1>
                    <p className="text-slate-600 text-[18px] leading-relaxed max-w-5xl mx-auto mb-6">
                        Discover, check your eligibility, and apply for central and state-level healthcare financial aid programs.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Sidebar: Eligibility Checker */}
                    <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
                        <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 overflow-hidden">
                            <div className="bg-blue-50 border-b-2 border-sky-200 p-5 flex items-center gap-2">
                                <FileCheck className="w-6 h-6 text-cyan-600" />
                                <h2 className="font-poppins font-bold text-lg text-blue-950">Eligibility Assessor</h2>
                            </div>
                            
                            <div className="p-6">
                                {eligibilityChecked ? (
                                    <div className="animate-fade-in text-center py-4">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200 shadow-sm">
                                            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                                        </div>
                                        <h3 className="font-poppins font-bold text-lg text-blue-950 mb-2">Assessment Complete</h3>
                                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                            We've filtered the directory to show schemes you are most likely eligible for.
                                        </p>
                                        <button 
                                            onClick={clearEligibility}
                                            className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleCheckEligibility} className="space-y-5">
                                        <div>
                                            <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resident State</label>
                                            <select 
                                                required
                                                value={formData.state}
                                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-sm cursor-pointer appearance-none"
                                            >
                                                <option value="" disabled>Select State</option>
                                                <option value="West Bengal">West Bengal</option>
                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                <option value="Kerala">Kerala</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Annual Family Income</label>
                                            <select 
                                                required
                                                value={formData.income}
                                                onChange={(e) => setFormData({...formData, income: e.target.value})}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-sm cursor-pointer appearance-none"
                                            >
                                                <option value="" disabled>Select Income Range</option>
                                                <option value="<50k">Below ₹50,000</option>
                                                <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                                                <option value="1L-5L">₹1,00,000 - ₹5,00,000</option>
                                                <option value=">5L">Above ₹5,00,000</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Occupation Category</label>
                                            <select 
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-sm cursor-pointer appearance-none"
                                            >
                                                <option value="general">General / Private Sector</option>
                                                <option value="unorganized">Unorganized / Daily Wager</option>
                                                <option value="gov_employee">Government Employee</option>
                                                <option value="farmer">Farmer / Agriculture</option>
                                            </select>
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isChecking}
                                            className="mt-4 w-full bg-blue-950 hover:bg-blue-800 text-white py-3.5 rounded-xl text-[15px] font-bold tracking-wide transition-all shadow-md flex items-center justify-center disabled:opacity-70 cursor-pointer"
                                        >
                                            {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check Eligibility"}
                                        </button>
                                        <p className="text-[11px] font-medium text-slate-400 text-center mt-3 px-2">
                                            This is a preliminary check. Final approval depends on official government verification.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                        
                        {/* Helpful Information Panel */}
                        <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl hidden lg:block">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center border border-cyan-200">
                                    <Info className="w-4 h-4 text-cyan-700" />
                                </div>
                                <h3 className="font-poppins font-bold text-blue-950">Document Checklist</h3>
                            </div>
                            <ul className="text-[13px] font-medium text-slate-600 space-y-3 pl-1">
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div> Aadhar Card (Linked to Mobile)</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div> Active Bank Account Details</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div> Income Certificate (if applicable)</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div> Ration Card</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div> Recent Passport Photographs</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Main Area: Scheme Directory */}
                    <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col">
                        
                        {/* Search & Filter Top Bar */}
                        <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 p-5 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:w-1/2 md:w-2/3">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search schemes by name or keyword..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner"
                                />
                            </div>
                            
                            <div className="flex bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto border border-slate-200">
                                {["All", "Central", "State"].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                                            filterType === type 
                                            ? 'bg-white text-blue-900 shadow-md border border-slate-100' 
                                            : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scheme Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredSchemes.map(scheme => (
                                <div key={scheme.id} className="bg-white border-sky-700 border-2 rounded-3xl flex flex-col hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 shadow-lg group overflow-hidden">
                                    {/* Card Header */}
                                    <div className="p-6 border-b-2 border-slate-100 bg-linear-to-r from-white to-slate-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-poppins text-lg font-bold text-blue-950 leading-tight pr-3 group-hover:text-cyan-700 transition-colors">
                                                {scheme.name}
                                            </h3>
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase shrink-0 border-2 ${
                                                scheme.type === 'Central' 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {scheme.type === 'Central' ? <Landmark className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                                                {scheme.type}
                                            </span>
                                        </div>
                                        <p className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed">{scheme.desc}</p>
                                    </div>
                                    
                                    {/* Card Body Details */}
                                    <div className="p-6 flex-1 bg-white">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-slate-50 bg-slate-50/50">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                                                    <IndianRupee className="w-4 h-4 text-cyan-700" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Coverage Amount</div>
                                                    <div className="text-[14px] font-bold text-slate-800">{scheme.coverage}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-slate-50 bg-slate-50/50">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                                    <AlertCircle className="w-4 h-4 text-indigo-700" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Target Demographic</div>
                                                    <div className="text-[14px] font-bold text-slate-800">{scheme.target}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-5">
                                            {scheme.tags.map((tag, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-[11px] font-bold border border-blue-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="p-5 border-t-2 border-slate-100 flex items-center justify-between bg-slate-50">
                                        {eligibilityChecked ? (
                                            <span className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4" /> Likely Eligible
                                            </span>
                                        ) : (
                                            <span className="text-[12px] text-slate-400 font-bold">Verify eligibility first</span>
                                        )}
                                        
                                        <div className="flex gap-2.5">
                                            <button className="px-4 py-2 text-[14px] font-bold text-cyan-700 hover:text-blue-900 transition-colors cursor-pointer">
                                                Details
                                            </button>
                                            <button className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-[14px] font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer">
                                                Apply <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredSchemes.length === 0 && (
                                <div className="col-span-1 xl:col-span-2 text-center py-20 bg-white border-sky-700 border-2 rounded-3xl shadow-xl">
                                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
                                        <Filter className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="font-poppins text-2xl font-bold text-sky-950 mb-2">No schemes found</h3>
                                    <p className="text-slate-500 font-medium text-[16px]">We couldn't find any programs matching your current filters.</p>
                                    <button 
                                        onClick={() => {setSearchQuery(""); setFilterType("All"); clearEligibility();}}
                                        className="mt-6 text-[16px] font-bold text-cyan-600 hover:text-blue-900 transition-colors cursor-pointer"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}