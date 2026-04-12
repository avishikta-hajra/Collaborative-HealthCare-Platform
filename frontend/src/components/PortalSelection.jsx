import React from 'react'
import { useNavigate } from 'react-router-dom';
export default function PortalSelection() {
    const navigate = useNavigate();
    return (
        <section className="px-3 md:px-5 lg:px-10 py-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <span className="inline-block bg-[#845EF7]/10 text-[#845EF7] text-xs font-semibold tracking-wider px-4 py-1.5 rounded-full border border-[#845EF7]/25 mb-4">Portals</span>
                        <h2 className="font-serif-display text-3xl md:text-5xl">Choose Your <span className="bg-linear-to-r from-[#00C9A7] via-[#0099FF] to-[#845EF7] bg-clip-text text-transparent animate-gradient-shift">Access Portal</span></h2>
                        <p className="text-[#94A3C0] text-base max-w-lg mx-auto mt-4 leading-relaxed">Tailored dashboards for patients, medical professionals, and hospital administrators.</p>
                    </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: "👤", label: "Patient Portal", route: "/UserLogin", sub: "Book consultations, track health records, find hospitals", color: "text-[#00C9A7]", border: "border-[#00C9A7]/30", bg: "bg-[#00C9A7]/10", btnBorder: "border-[#00C9A7]/50" },
                        { icon: "🩺", label: "Doctor Portal", route: "/DoctorLogin", sub: "Manage appointments, conduct video calls, e-prescribe", color: "text-[#0099FF]", border: "border-[#0099FF]/30", bg: "bg-[#0099FF]/10", btnBorder: "border-[#0099FF]/50" },
                        { icon: "🏥", label: "Hospital / Admin", route: "/AdminLogin", sub: "Oversee operations, manage staff, track ambulances", color: "text-[#845EF7]", border: "border-[#845EF7]/30", bg: "bg-[#845EF7]/10", btnBorder: "border-[#845EF7]/50" },
                    ].map((p, i) => (
                        <div key={i} className="bg-white/2 border border-black/10 rounded-[20px] p-10 text-center hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                            <div className={`w-17.5 h-17.5 rounded-[20px] ${p.bg} flex items-center justify-center text-3xl mx-auto mb-6 border ${p.border}`}>{p.icon}</div>
                            <h3 className={`text-[22px] font-bold mb-2.5 ${p.color}`}>{p.label}</h3>
                            <p className="text-[#94A3C0] text-sm leading-relaxed mb-7">{p.sub}</p>
                            <button
                                onClick={() => navigate(p.route)}
                                className={`w-full ${p.bg} border-[1.5px] ${p.btnBorder} ${p.color} font-semibold text-sm py-3 rounded-xl group-hover:bg-white/10 transition-colors`}>Sign In →</button>
                        </div>
                    ))}
                </div>
                </div>
            </section> 
        
    )
}
