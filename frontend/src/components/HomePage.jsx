import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Using Lucide React
import {
    Menu, X, Video, Hospital,
    Ambulance, AlertTriangle, Activity, Landmark, ChevronRight
} from "lucide-react";

const features = [
    {
        icon: <Video className="w-7 h-7 text-cyan-500" strokeWidth={2} />,
        title: "Telemedicine & Video",
        desc: "Connect face-to-face with certified doctors from anywhere. HD video calls, e-prescriptions, and follow-up scheduling — all in one place.",
        route: "/telemedicine"
    },
    {
        icon: <Hospital className="w-7 h-7 text-cyan-500" strokeWidth={2} />,
        title: "Locating Nearby Hospitals",
        desc: "Instantly find and navigate to the nearest healthcare facilities. View ratings, specialties, and precise geolocation for quick access.",
        route: "/hospitals"
    },
    {
        icon: <Ambulance className="w-7 h-7 text-cyan-500" strokeWidth={2} />,
        title: "Live Ambulance Tracking",
        desc: "Request emergency transport with one tap. Track your assigned ambulance's real-time location and ETA straight to your doorstep.",
        route: "/ambulance"
    },
    {
        icon: <AlertTriangle className="w-7 h-7 text-cyan-500" strokeWidth={2} />,
        title: "Community Health Reporting",
        desc: "Crowdsourced outbreak detection and health incident reporting. Empower communities to flag risks and receive timely alerts.",
        route: "/community-health"
    },
    {
        icon: <Activity className="w-7 h-7 text-cyan-500" strokeWidth={2} />,
        title: "Live Listings & Availability",
        desc: "Check real-time availability of hospital beds, oxygen cylinders, blood banks, and critical care units before you arrive.",
        route: "/listings"
    },
    {
        icon: <Landmark className="w-7 h-7 text-cyan-500" strokeWidth={2} />,
        title: "Government Schemes",
        desc: "Easily discover, check eligibility, and apply for central and state government healthcare programs and financial aid.",
        route: "/schemes"
    },
];

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [phraseIndex, setPhraseIndex] = useState(0); // State for the text carousel
    const navigate = useNavigate();

    const sidebarItems = [
        { label: "Features", route: "#features" },
        { label: "Telemedicine", route: "/telemedicine" },
        { label: "Nearby Hospitals", route: "/hospitals" },
        { label: "Ambulance Tracking", route: "/ambulance" },
        { label: "Community Reporting", route: "/community-health" },
        { label: "Live Listings", route: "/listings" },
        { label: "Government Schemes", route: "/schemes" },
        { label: "Gamified Module", route: "/gamification" },

        /*
        { label: "Patient Portal", route: "/UserLogin" },
        { label: "Doctor Portal", route: "/DoctorLogin" },
        { label: "Hospital / Admin", route: "/AdminLogin" },
        { label: "Contact", route: "/contact" },
        */
    ];

    // Carousel Phrases
    const heroPhrases = [
        "Healthcare Ecosystem",
        "Telemedicine Platform",
        "Emergency Network",
        "Health Companion"
    ];

    // Handle Scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Handle Text Carousel Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
        }, 3000); // Changes every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950">
            <nav className={`fixed top-0 left-0 right-0 z-40 px-4 md:px-6 lg:px-14 h-18 flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-blue-100/85 backdrop-blur-md shadow-[0_10px_16px_rgba(0,0,0,0.2)] border-b-2 border-blue-300" : "bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.2)] border-b-2 border-blue-300"}`}>

                {/* Left Side: Logo & Links */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {/* Sidebar Toggle */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg text-blue-950 hover:bg-blue-50 transition-colors cursor-pointer"
                            aria-label="Open menu">
                            <Menu className="w-6 h-6" />
                        </button>

                        <span className="cursor-pointer flex items-center" onClick={() => navigate('/')}>
                            <img
                                src="/HealthBridgeLogo.png"
                                alt="HealthBridge Logo"
                                // Changed to h-10 w-auto (or try h-12 for even bigger)
                                className="h-32 sm:h-28 w-auto object-contain"
                            />
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-8 border-l-2 border-slate-400 pl-10 h-8">
                        <a onClick={() => navigate('/')} className="cursor-pointer text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors">Home</a>
                        <a onClick={() => navigate('/about')} className="cursor-pointer text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors">About Us</a>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-4">
                    <button className="px-5 py-2.5 text-[14px] font-semibold tracking-widest text-white bg-blue-950 rounded-lg hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/30 transition-all cursor-pointer" onClick={() => navigate('/PortalSelection')}>
                        Sign In
                    </button>
                </div>
            </nav>

            {/* SIDEBAR DRAWER */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-blue-950/30 backdrop-blur-xs transition-opacity" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 w-72 max-w-[80vw] h-full bg-linear-to-tl from-cyan-50 to-blue-200 p-6 shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="font-poppins font-bold text-2xl text-sky-800 flex items-center gap-2">
                                HealthBridge
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-1 overflow-y-auto">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        if (item.route.startsWith('/')) navigate(item.route);
                                        else {
                                            const element = document.querySelector(item.route);
                                            if(element) element.scrollIntoView({behavior: 'smooth'});
                                        }
                                    }}
                                    className="text-left flex items-center justify-between text-slate-600 text-l font-medium p-3 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors cursor-pointer group"
                                >
                                    {item.label}
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
                                </button>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

           {/* HERO WITH BRIGHT COLORFUL BACKGROUND */}
                      <section className="relative pt-30 pb-6 px-4 flex flex-col items-center justify-center bg-slate-50 text-center overflow-hidden">
                         <div className="relative max-w-4xl animate-fade-in z-10 w-full flex flex-col items-center">

                             {/* Your exact original H1 classes */}
                             <h1 className="font-poppins text-xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold text-blue-950 leading-normal mb-4 tracking-tight flex flex-row flex-nowrap items-center justify-center gap-1.5 sm:gap-3 w-full">
                                 <span className="whitespace-nowrap">Your Complete</span>

                                 {/* CSS Grid trick replacing the fixed widths */}
                                 <span className="relative inline-grid grid-cols-1 grid-rows-1 text-left items-center">

                                     {/* Invisible placeholder of the longest phrase to maintain perfect centering width */}
                                     <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
                                         Telemedicine Platform
                                     </span>

                                     {/* Visible animated text */}
                                     <span
                                       key={phraseIndex}
                                       className="col-start-1 row-start-1 flex items-center h-full bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-cyan-700 animate-fade-up drop-shadow-sm whitespace-nowrap"
                                     >
                                       {heroPhrases[phraseIndex]}
                                     </span>
                                 </span>
                             </h1>

                             {/* Your exact original paragraph classes */}
                             <p className="text-slate-600 text-[18px] md:text-[18px] justify-center text-center leading-relaxed max-w-2xl mx-auto mb-5">
                                 Supporting Every Patient with Timely, Compassionate, and Well-Coordinated Care
                             </p>
                         </div>
                      </section>

            {/* FEATURES - Divider & Cyan Highlight Accents */}
            <section className="relative bg-white px-4 md:px-10 lg:px-10 py-12 bg-linear-to-b from-cyan-100 via-indigo-100 to-blue-200 border-t-2 border-bold border-blue-300" id="features">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="font-poppins text-2xl md:text-2xl font-bold text-blue-950 tracking-widest mb-3">Everything You Need,<span className="text-blue-900"> All in One Place</span></h2>
                        <span className="inline-block text-cyan-700 text-xl font-bold tracking-widest uppercase">Core Features</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white border-sky-700 border-2 rounded-3xl p-8 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 flex flex-col items-center text-center h-full group">
                                {/* Centered Icon with Glowing Cyan Dropshadow */}
                                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-50 to-blue-50 flex items-center justify-center mb-6 shadow-inner shadow-white border-2 border-cyan-700/80 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-[18px] font-bold text-sky-950 mb-3">{f.title}</h3>
                                <p className="text-slate-500 text-[14px] leading-relaxed mb-6 grow">{f.desc}</p>

                                <div onClick={() => navigate(f.route)} className="flex items-center gap-1.5 text-blue-800 text-[16px] font-bold cursor-pointer hover:text-blue-950 transition-colors">
                                    Access Now
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="px-4 md:px-10 lg:px-20 py-5 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-blue-300">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-blue-950 text-[15px]">HealthBridge</span>
                </div>
                <p className="text-slate-500 text-[13px] text-center">© 2026 HealthBridge. Built with care for better health outcomes.</p>
                <div className="flex gap-6">
                    {["Privacy", "Terms", "Contact"].map(l => (
                        <a key={l} href="#" className="text-slate-500 text-[13px] font-medium hover:text-cyan-600 transition-colors">{l}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
}