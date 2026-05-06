import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import About from "./About";
// Using Lucide React
import {
    Menu, X, Video, Hospital,
    Ambulance, AlertTriangle, Activity,
    Landmark, ChevronRight, ChevronDown, User, LogOut
} from "lucide-react";
import { getAuthSession } from "../services/authApi"; // Import auth helper

const features = [
    {
        icon: <Video className="w-7 h-7 text-cyan-500" strokeWidth={2} />,
        title: "Telemedicine & Video",
        desc: "Connect face-to-face with certified doctors from anywhere. HD video calls, e-prescriptions, and follow-up scheduling all in one place.",
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
    }
];


const faqs = [
    {
        question: "Is HealthBridge free to use?",
        answer: "Yes, HealthBridge is completely free for all users. We are committed to providing accessible healthcare solutions without any cost barriers."
    },
    {
        question: "What services does HealthBridge offer?",
        answer: "HealthBridge offers a wide range of services including telemedicine consultations, hospital locator, live ambulance tracking, community health reporting, real-time listings of medical resources, and information on government healthcare schemes."
    },
    {
        question: "How do I sign up for HealthBridge?",
        answer: "You can sign up for HealthBridge by clicking the \"Sign In\" button at the top right corner of the homepage. You will be directed to a portal selection page where you can choose your user type and create an account."
    },
    {
        question: "Is my personal information secure on HealthBridge?",
        answer: "Yes, we take your privacy and security seriously. HealthBridge uses industry-standard encryption and security practices to protect your personal information. We do not share your data with third parties without your consent."
    },
    {
        question: "How does the live ambulance tracking work?",
        answer: "Our platform uses real-time GPS tracking to connect you with the nearest available ambulance. Once dispatched, you can monitor the ambulance's route and ETA directly from your dashboard."
    },
    {
        question: "Can I use HealthBridge for emergency situations?",
        answer: "Yes, HealthBridge provides quick access to emergency ambulance services and nearby hospital locations. The ambulance module can be accessed quickly to save crucial time during emergencies."
    },
    {
        question: "What is the Community Health Reporting Feature?",
        answer: "It's a crowdsourced tool where users can report local health incidents or outbreaks. This helps the community stay informed, and allows local health bodies to monitor and address potential risks early."
    },
    {
        question: "Why there is Gamified Module Feature?",
        answer: "We included the Gamified Module to make learning about health and wellness engaging and interactive. It features a variety of quizzes ranging from first aid and nutrition to mental health, allowing users to challenge their knowledge, keep track of their high scores, and learn practical health tips in a fun, pressure-free environment."
    },
    {
        question: "How can I check my eligibility for government health schemes?",
        answer: "You can use our Eligibility Assessor in the Government Schemes section. Simply input your state, income range, and occupation category, and the system will instantly filter and display the schemes you are most likely eligible for."
    },
    {
        question: "What information does the Live Listings feature provide?",
        answer: "The Live Listings feature provides real-time availability of crucial medical resources at nearby hospitals. This includes the number of available ICU beds, oxygen cylinders, and specific blood group units, helping you make informed decisions during critical situations."
    },
    {
        question: "What happens if a doctor is currently in a call when I need a consultation?",
        answer: "If a doctor's status is 'In Call', you can still join their virtual waitlist. Our platform provides a live queue position and an estimated wait time, automatically connecting you as soon as the doctor finishes their current consultation."
    },
    // {
    //     question: "How do I receive my prescription after a virtual consultation?",
    //     answer: "After your telemedicine session, the doctor can generate a digital prescription (E-Rx) directly through the platform. This will be instantly accessible in your clinical panel, where you can view, save, or download it as a PDF."
    // },
    // {
    //     question: "Do I need to download a separate mobile app to use HealthBridge?",
    //     answer: "No, HealthBridge is a fully responsive web-based platform. You can access all of our services—including video consultations and live ambulance tracking—directly through the web browser on your desktop, tablet, or smartphone."
    // }

];

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('home');
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    // Auth States
    const [authSession, setAuthSession] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
    ];

    const heroPhrases = [
        "Healthcare Ecosystem",
        "Telemedicine Platform",
        "Emergency Network",
        "Health Companion"
    ];

    // Check Auth Session on Mount
    useEffect(() => {
        const session = getAuthSession();
        setAuthSession(session);
    }, []);

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("healthbridge.auth");
        sessionStorage.removeItem("healthbridge.auth");
        setAuthSession(null);
        setIsProfileDropdownOpen(false);
    };

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
        }, 3000);
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
                        <span className="cursor-pointer flex items-center" onClick={() => setActiveTab('home')}>
                            <img
                                src="/HealthBridgeLogo.png"
                                alt="HealthBridge Logo"
                                className="h-32 sm:h-28 w-auto object-contain"
                            />
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-4 border-l-2 border-slate-400 pl-8 h-8">
                        <a onClick={() => setActiveTab('home')} className={`cursor-pointer px-4 py-1.5 rounded-xl text-[15px] font-semibold tracking-widest transition-all duration-300 ${activeTab === 'home' ? 'bg-slate-50/80 text-cyan-700 border border-cyan-300 shadow-[inset_0_5px_10px_rgba(6,182,212,0.25)] translate-y-[2px] z-0' : 'text-slate-600 hover:text-cyan-700 hover:bg-white/50 border border-transparent hover:-translate-y-[1px] hover:shadow-[0_4px_10px_rgba(6,182,212,0.15)] z-10'}`}>Home</a>
                        <a onClick={() => setActiveTab('about')} className={`cursor-pointer px-4 py-1.5 rounded-xl text-[15px] font-semibold tracking-widest transition-all duration-300 ${activeTab === 'about' ? 'bg-slate-50/80 text-cyan-700 border border-cyan-300 shadow-[inset_0_5px_10px_rgba(6,182,212,0.25)] translate-y-[2px] z-0' : 'text-slate-600 hover:text-cyan-700 hover:bg-white/50 border border-transparent hover:-translate-y-[1px] hover:shadow-[0_4px_10px_rgba(6,182,212,0.15)] z-10'}`}>About Us</a>
                    </div>
                </div>

                {/* Right Side: Actions (Auth / Profile) */}
                <div className="flex items-center gap-4 relative">
                    {authSession ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white border-2 border-blue-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center text-white">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-[14px] font-bold text-blue-950 hidden sm:block capitalize">
                                    {authSession.role ? authSession.role.toLowerCase() : 'User'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border-2 border-slate-100 py-2 z-50 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-slate-100 mb-1 bg-slate-50/50">
                                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Signed in as</p>
                                        <p className="text-[14px] font-bold text-blue-950 truncate">{authSession.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-[14px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="px-5 py-2.5 text-[14px] font-semibold tracking-widest text-white bg-blue-950 rounded-lg hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/30 transition-all cursor-pointer" onClick={() => navigate('/PortalSelection')}>
                            Sign In
                        </button>
                    )}
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
                                            if (element) element.scrollIntoView({ behavior: 'smooth' });
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
            {activeTab === 'home' ? (
                <>
                    {/* HERO SECTION */}
                    <section className="relative pt-30 pb-6 px-4 flex flex-col items-center justify-center bg-slate-50 text-center overflow-hidden">
                        <div className="relative max-w-4xl animate-fade-in z-10 w-full flex flex-col items-center">
                            <h1 className="font-poppins text-xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold text-blue-950 leading-normal mb-4 tracking-tight flex flex-row flex-nowrap items-center justify-center gap-1.5 sm:gap-3 w-full">
                                <span className="whitespace-nowrap">Your Complete</span>
                                <span className="relative inline-grid grid-cols-1 grid-rows-1 text-left items-center">
                                    <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
                                        Telemedicine Platform
                                    </span>
                                    <span
                                        key={phraseIndex}
                                        className="col-start-1 row-start-1 flex items-center h-full bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-cyan-700 animate-fade-up drop-shadow-sm whitespace-nowrap"
                                    >
                                        {heroPhrases[phraseIndex]}
                                    </span>
                                </span>
                            </h1>
                            <p className="text-slate-600 text-[18px] md:text-[18px] justify-center text-center leading-relaxed max-w-2xl mx-auto mb-5">
                                Supporting Every Patient with Timely, Compassionate, and Well-Coordinated Care
                            </p>
                        </div>
                    </section>

                    {/* FEATURES */}
                    <section className="relative bg-white px-4 md:px-10 lg:px-10 py-12 bg-linear-to-b from-cyan-100 via-indigo-100 to-blue-200 border-t-2 border-bold border-blue-300" id="features">
                        <div className="max-w-6xl mx-auto relative z-10">
                            <div className="text-center mb-10">
                                <h2 className="font-poppins text-2xl md:text-2xl font-bold text-blue-950 tracking-widest mb-3">Everything You Need,<span className="text-blue-900"> All in One Place</span></h2>
                                <span className="inline-block text-cyan-700 text-xl font-bold tracking-widest uppercase">Core Features</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {features.map((f, i) => (
                                    <div key={i} className="bg-white border-sky-700 border-2 rounded-3xl p-8 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 flex flex-col items-center text-center h-full group">
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
                    {/* FAQ SECTION */}
                    <section className="relative bg-slate-50 px-4 md:px-10 lg:px-20 py-12 border-t-2 border-blue-300">
                        <div className="max-w-4xl mx-auto relative z-10">
                            <div className="text-center mb-10">
                                <h2 className="font-poppins text-2xl md:text-3xl font-bold text-blue-950 tracking-widest mb-3">Frequently Asked Questions</h2>
                                <span className="inline-block text-cyan-700 text-xl font-bold tracking-widest uppercase">Your Questions Answered</span>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-2 border-blue-200 rounded-xl overflow-hidden hover:bg-blue-50 transition-colors">
                                        <button
                                            onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                            className="w-full p-5 md:p-6 text-left flex justify-between items-center cursor-pointer focus:outline-none"
                                        >
                                            <h3 className="text-[16px] md:text-[18px] font-bold text-blue-900 pr-4">{faq.question}</h3>
                                            <ChevronDown className={`w-5 h-5 text-blue-900 transition-transform duration-300 shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div className={`transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                            <p className="text-slate-600 text-[15px] md:text-[16px] leading-relaxed px-5 pb-5 md:px-6 md:pb-6">{faq.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <About />
            )}

            {/* FOOTER */}
            <footer className="px-4 md:px-10 lg:px-20 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-blue-300">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                    <span className="font-bold text-blue-950 text-[16px]">HealthBridge</span>
                </div>
                <p className="text-slate-500 text-[14px] text-center">Built with care for better health outcomes</p>
            </footer>
        </div>
    );
}