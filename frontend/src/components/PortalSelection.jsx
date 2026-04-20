import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Stethoscope, Shield } from 'lucide-react';

export default function PortalSelection() {
    const navigate = useNavigate();
    return (
        <section className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-linear-to-b from-cyan-100 via-indigo-100 to-blue-200 border-t-2 px-4 py-16 flex items-center justify-center pt-30">
            <div className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-10">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">Portals</span>
                    <h2 className="font-heading text-2xl md:text-4xl font-bold text-blue-950">Choose Your Access Portal</h2>
                    <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">Tailored dashboards for patients, medical professionals, and administrators.</p>
                </div>
                {/* Top fixed navbar styled like HomePage */}
                <div className="fixed top-0 left-0 right-0 z-40 px-4 md:px-6 lg:px-14 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.2)] border-b-2 border-blue-300">
                    <div className="max-w-6xl mx-auto w-full">
                        <div className="w-full">
                            <button onClick={() => navigate('/')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4">
                                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { icon: <User className="w-8 h-8 text-white" />, label: "Patient", route: "/UserLogin", sub: "Book consultations & track health", color: "text-blue-600", bg: "bg-blue-600", btn: "bg-blue-600" },
                        { icon: <Stethoscope className="w-8 h-8 text-white" />, label: "Doctor", route: "/DoctorLogin", sub: "Manage appointments & calls", color: "text-cyan-600", bg: "bg-cyan-500", btn: "bg-cyan-500" },
                        { icon: <Shield className="w-8 h-8 text-white" />, label: "Admin", route: "/AdminLogin", sub: "Oversee operations & staff", color: "text-blue-900", bg: "bg-blue-900", btn: "bg-blue-900" },
                    ].map((p, i) => (
                        <div key={i} className="bg-white border-sky-700 border-2 rounded-3xl p-8 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 flex flex-col items-center text-center h-full group">
                            <div className={`w-16 h-16 rounded-2xl ${p.bg} flex items-center justify-center mb-6  group-hover:scale-110 transition-all duration-300`}>{p.icon}</div>
                            <h3 className={`text-lg font-bold mb-1 ${p.color}`}>{p.label}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{p.sub}</p>
                            <button onClick={() => navigate(p.route)} className={`mt-4 w-full text-white font-semibold text-sm py-3 rounded-lg transition-colors ${p.btn} hover:opacity-90`}>Sign In →</button>
                        </div>
                    ))}
                </div>
                {/* bottom button removed - top navbar handles Back to Home */}
            </div>
        </section>
    )
}