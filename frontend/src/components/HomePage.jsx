import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
    { value: "50K+", label: "Patients Served" },
    { value: "1,200+", label: "Verified Doctors" },
    { value: "340+", label: "Partner Hospitals" },
    { value: "99.8%", label: "Uptime" },
];

const features = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Telemedicine & Video Consultation",
        desc: "Connect face-to-face with certified doctors from anywhere. HD video calls, e-prescriptions, and follow-up scheduling — all in one place.",
        accent: "text-[#00C9A7]",
        bgAccent: "bg-[#00C9A7]/15",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Hospital & Ambulance Tracking",
        desc: "Real-time geolocation of nearby hospitals, live ambulance tracking, and one-tap emergency calling when every second counts.",
        accent: "text-[#FF6B6B]",
        bgAccent: "bg-[#FF6B6B]/15",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Community Health Reporting",
        desc: "Crowdsourced outbreak detection and health incident reporting. Empower communities to flag risks and receive timely alerts.",
        accent: "text-[#845EF7]",
        bgAccent: "bg-[#845EF7]/15",
    },
];

const howItWorks = [
    { step: "01", title: "Create Your Profile", desc: "Sign up as a patient, doctor, or hospital admin in under 2 minutes." },
    { step: "02", title: "Access Services", desc: "Book video consultations, find nearby care, or monitor community health." },
    { step: "03", title: "Stay Connected", desc: "Receive real-time updates, reminders, and health alerts on any device." },
];

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="min-h-screen">
            {/* NAV */}
            <nav className={`fixed top-0 left-0 right-0 z-100 px-4 md:px-10 lg:px-20 h-17 flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[#050D1A]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
                }`}>
                <div className="flex items-center gap-3">
                    <div className="w-8.5 h-8.5 rounded-lg bg-linear-to-br from-[#00C9A7] to-[#0099FF] flex items-center justify-center">
                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight">MediLink</span>
                </div>

                {/* Hidden on mobile, visible on medium screens and up */}
                <div className="hidden md:flex items-center gap-8">
                    {["Features", "How It Works", "About"].map(l => (
                        <a key={l} href="#" className="text-[#94A3C0] text-sm font-medium hover:text-white transition-colors">{l}</a>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button className="hidden sm:block px-5 py-2 text-sm font-medium text-white bg-transparent border-[1.5px] border-white/20 rounded-lg hover:border-white/50 hover:bg-white/5 transition-all">Sign In</button>
                    <button className="px-5 py-2 text-sm font-semibold text-white bg-linear-to-br from-[#00C9A7] to-[#0099FF] rounded-lg hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,201,167,0.35)] transition-all">Get Started</button>
                </div>
            </nav>

            {/* HERO */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-10 lg:px-20 pt-32 pb-20 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-[15%] left-[10%] w-500px h-500px rounded-full bg-[radial-gradient(circle,rgba(0,201,167,0.08)_0%,transparent_70%)] blur-40px pointer-events-none" />
                <div className="absolute bottom-[10%] right-[5%] w-600px h-600px rounded-full bg-[radial-gradient(circle,rgba(132,94,247,0.07)_0%,transparent_70%)] blur-[50px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size:60px_60px pointer-events-none" />

                <div className="max-w-3xl animate-fade-up z-10">
                    <span className="inline-block bg-[#00C9A7]/10 text-[#00C9A7] text-xs font-semibold tracking-wider px-4 py-1.5 rounded-full border border-[#00C9A7]/25 mb-6">🏥 Healthcare, Reimagined</span>
                    <h1 className="font-serif-display text-4xl sm:text-5xl md:text-7xl leading-[1.1] mb-6">
                        Your Complete<br />
                        <span className="bg-linear-to-r from-[#00C9A7] via-[#0099FF] to-[#845EF7] bg-clip-text text-transparent animate-gradient-shift">Healthcare Ecosystem</span>
                    </h1>
                    <p className="text-[#94A3C0] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                        Telemedicine consultations, real-time hospital & ambulance tracking, and community health reporting — unified in one powerful platform.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            className="px-8 py-4 text-base font-semibold text-white bg-linear-to-br from-[#00C9A7] to-[#0099FF] rounded-xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,201,167,0.35)] transition-all">Start for Free →</button>
                        <button className="px-8 py-4 text-base font-medium text-white bg-transparent border-[1.5px] border-white/20 rounded-xl hover:border-white/50 hover:bg-white/5 transition-all">Watch Demo</button>
                    </div>
                </div>

                <div className="mt-20 flex gap-5 justify-center flex-wrap z-10">
                    {[
                        { icon: "📹", label: "Video Consult", sub: "Dr. Mehta — Online", color: "text-[#00C9A7]", bg: "bg-[#00C9A7]/10", delay: "0s" },
                        { icon: "🚑", label: "Ambulance ETA", sub: "4 min away", color: "text-[#FF6B6B]", bg: "bg-[#FF6B6B]/10", delay: "-1.5s" },
                        { icon: "⚠️", label: "Alert: Dengue", sub: "Kolkata South Zone", color: "text-[#845EF7]", bg: "bg-[#845EF7]/10", delay: "-3s" },
                    ].map((c, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 min-w-50 animate-float backdrop-blur-sm" style={{ animationDelay: c.delay, animationDuration: `${3 + i * 0.4}s` }}>
                            <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center text-xl`}>{c.icon}</div>
                            <div className="text-left">
                                <div className={`font-semibold text-sm ${c.color}`}>{c.label}</div>
                                <div className="text-xs text-[#94A3C0] mt-0.5">{c.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* STATS */}
            <section className="px-4 md:px-10 lg:px-20 pb-24">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    {stats.map((s, i) => (
                        <div key={i} className={`p-8 text-center ${i % 2 !== 0 ? '' : 'border-r border-white/10'} ${i < 2 ? 'border-b md:border-b-0 border-white/10' : ''} md:border-r md:last:border-r-0`}>
                            <div className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1.5 bg-linear-to-br from-[#00C9A7] to-[#0099FF] bg-clip-text text-transparent">{s.value}</div>
                            <div className="text-[#94A3C0] text-sm font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section className="px-4 md:px-10 lg:px-20 pb-28">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 z-10 relative">
                        <span className="inline-block bg-[#00C9A7]/10 text-[#00C9A7] text-xs font-semibold tracking-wider px-4 py-1.5 rounded-full border border-[#00C9A7]/25 mb-4">Core Features</span>
                        <h2 className="font-serif-display text-3xl md:text-5xl">Everything You Need,<br /><span className="bg-linear-to-r from-[#00C9A7] via-[#0099FF] to-[#845EF7] bg-clip-text text-transparent animate-gradient-shift">All in One Place</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-[18px] p-8 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl ${f.bgAccent} flex items-center justify-center ${f.accent} mb-6`}>{f.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-[#94A3C0] text-[15px] leading-relaxed mb-7">{f.desc}</p>
                                <div
                                    onClick={() => navigate('/telemedicine')}
                                    className={`flex items-center gap-1.5 ${f.accent} text-sm font-semibold cursor-pointer group`}>
                                    Learn more <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="px-4 md:px-10 lg:px-20 py-24 bg-white/1.5 border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-[#0099FF]/10 text-[#0099FF] text-xs font-semibold tracking-wider px-4 py-1.5 rounded-full border border-[#0099FF]/25 mb-4">Process</span>
                        <h2 className="font-serif-display text-3xl md:text-5xl">Get Started in <span className="bg-linear-to-r from-[#00C9A7] via-[#0099FF] to-[#845EF7] bg-clip-text text-transparent animate-gradient-shift">3 Easy Steps</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {howItWorks.map((h, i) => (
                            <div key={i} className="text-center p-6">
                                <div className="font-serif-display text-7xl text-white/5 leading-none -mb-4 italic">{h.step}</div>
                                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#00C9A7]/20 to-[#0099FF]/20 border border-[#00C9A7]/30 flex items-center justify-center mx-auto mb-5 text-xl font-extrabold text-[#00C9A7]">{i + 1}</div>
                                <h3 className="text-xl font-bold mb-2.5">{h.title}</h3>
                                <p className="text-[#94A3C0] text-[15px] leading-relaxed">{h.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LOGIN PORTALS */}
            <section className="px-4 md:px-10 lg:px-20 py-28">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-[#845EF7]/10 text-[#845EF7] text-xs font-semibold tracking-wider px-4 py-1.5 rounded-full border border-[#845EF7]/25 mb-4">Portals</span>
                        <h2 className="font-serif-display text-3xl md:text-5xl">Choose Your <span className="bg-linear-to-r from-[#00C9A7] via-[#0099FF] to-[#845EF7] bg-clip-text text-transparent animate-gradient-shift">Access Portal</span></h2>
                        <p className="text-[#94A3C0] text-base max-w-lg mx-auto mt-4 leading-relaxed">Tailored dashboards for patients, medical professionals, and hospital administrators.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: "👤", label: "Patient Portal", sub: "Book consultations, track health records, find hospitals", color: "text-[#00C9A7]", border: "border-[#00C9A7]/30", bg: "bg-[#00C9A7]/10", btnBorder: "border-[#00C9A7]/50" },
                            { icon: "🩺", label: "Doctor Portal", sub: "Manage appointments, conduct video calls, e-prescribe", color: "text-[#0099FF]", border: "border-[#0099FF]/30", bg: "bg-[#0099FF]/10", btnBorder: "border-[#0099FF]/50" },
                            { icon: "🏥", label: "Hospital / Admin", sub: "Oversee operations, manage staff, track ambulances", color: "text-[#845EF7]", border: "border-[#845EF7]/30", bg: "bg-[#845EF7]/10", btnBorder: "border-[#845EF7]/50" },
                        ].map((p, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-[20px] p-10 text-center hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                                <div className={`w-17.5 h-17.5 rounded-[20px] ${p.bg} flex items-center justify-center text-3xl mx-auto mb-6 border ${p.border}`}>{p.icon}</div>
                                <h3 className={`text-[22px] font-bold mb-2.5 ${p.color}`}>{p.label}</h3>
                                <p className="text-[#94A3C0] text-sm leading-relaxed mb-7">{p.sub}</p>
                                <button
                                    onClick={() => navigate('/telemedicine')}
                                    className={`w-full ${p.bg} border-[1.5px] ${p.btnBorder} ${p.color} font-semibold text-sm py-3 rounded-xl group-hover:bg-white/10 transition-colors`}>Sign In →</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/5 px-4 md:px-10 lg:px-20 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-linear-to-br from-[#00C9A7] to-[#0099FF] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
                    </div>
                    <span className="font-bold text-base">MediLink</span>
                </div>
                <p className="text-[#94A3C0] text-sm text-center">© 2026 MediLink. Built with care for better health outcomes.</p>
                <div className="flex gap-5">
                    {["Privacy", "Terms", "Contact"].map(l => (
                        <a key={l} href="#" className="text-[#94A3C0] text-sm hover:text-white transition-colors">{l}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
}