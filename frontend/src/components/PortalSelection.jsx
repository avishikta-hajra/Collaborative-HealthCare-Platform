import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortalSelection() {
    const navigate = useNavigate();
    return (
        <section className="min-h-screen bg-slate-50 px-4 py-16 flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-10">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">Portals</span>
                    <h2 className="font-heading text-2xl md:text-4xl font-bold text-blue-950">Choose Your Access Portal</h2>
                    <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">Tailored dashboards for patients, medical professionals, and administrators.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { icon: "👤", label: "Patient", route: "/UserLogin", sub: "Book consultations & track health", color: "text-blue-600", bg: "bg-blue-100", btn: "bg-blue-600" },
                        { icon: "🩺", label: "Doctor", route: "/DoctorLogin", sub: "Manage appointments & calls", color: "text-cyan-600", bg: "bg-cyan-100", btn: "bg-cyan-500" },
                        { icon: "🏥", label: "Admin", route: "/AdminLogin", sub: "Oversee operations & staff", color: "text-blue-900", bg: "bg-slate-200", btn: "bg-blue-900" },
                    ].map((p, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col">
                            <div className={`w-14 h-14 rounded-full ${p.bg} flex items-center justify-center text-2xl mx-auto mb-4`}>{p.icon}</div>
                            <h3 className={`text-lg font-bold mb-1 ${p.color}`}>{p.label}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed mb-5 flex-1">{p.sub}</p>
                            <button onClick={() => navigate(p.route)} className={`w-full text-white font-semibold text-sm py-2 rounded-lg transition-colors ${p.btn} hover:opacity-90`}>Sign In →</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}