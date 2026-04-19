import { useState } from "react";

export default function AdminLogin() {
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [tab, setTab] = useState("login");

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1800);
    };

    return (
        <div className="min-h-screen flex items-stretch font-sans bg-slate-50 overflow-hidden">

            {/* LEFT PANEL (Dark Blue Theme with Yellow/Cyan Accents) */}
            <div className="hidden lg:flex w-[45%] bg-blue-950 p-12 flex-col justify-between relative overflow-hidden text-white">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <a href="/" className="flex items-center gap-3 text-white no-underline mb-16">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight">HealthBridge</span>
                    </a>

                    <div className="mb-8">
                        <span className="inline-block bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-xs font-bold tracking-widest px-3 py-1.5 rounded-full mb-5 uppercase">
                            Admin Portal
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 font-poppins">
                            Operate better,<br/>
                            <span className="text-cyan-400 italic">manage operations.</span>
                        </h2>
                        <p className="text-blue-200 text-base leading-relaxed max-w-sm">
                            Admin dashboard to oversee hospitals, staff, ambulance tracking and system settings.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    {[
                        { icon: "🏥", title: "Facility Overview", desc: "Monitor hospital performance and metrics." },
                        { icon: "👥", title: "Staff Management", desc: "Add/remove staff, assign roles and permissions." },
                        { icon: "🚑", title: "Ambulance Tracking", desc: "Real-time fleet visibility and dispatch." }
                    ].map((f, i) => (
                        <div key={i} className="flex items-start gap-4 py-4 border-b border-white/10 last:border-none">
                            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">{f.icon}</div>
                            <div>
                                <div className="font-semibold text-[15px] text-white mb-1">{f.title}</div>
                                <div className="text-[13px] text-blue-200">{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-lg">📊</div>
                        <div>
                            <div className="text-white text-sm font-semibold mb-0.5">"Trusted by hospital admins."</div>
                            <div className="text-blue-200 text-xs">Admin Team, City Hospital</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL — FORM (Light Theme) */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 animate-fade-in bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-blue-950 mb-2 font-poppins">Welcome back</h1>
                        <p className="text-slate-500 text-sm">Sign in to your admin account</p>
                    </div>

                    {/* TABS */}
                    <div className="flex border-b border-slate-200 mb-8">
                        <button className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${tab === "login" ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent hover:text-slate-600"}`} onClick={() => setTab("login")}>Sign In</button>
                        <button className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${tab === "register" ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent hover:text-slate-600"}`} onClick={() => setTab("register")}>Create Account</button>
                    </div>

                    {/* Form fields */}
                    <div className="flex flex-col gap-4">
                        {tab === "register" && (
                            <div>
                                <label className="block text-slate-700 text-[13px] font-semibold mb-1.5">Full Name</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Name" />
                            </div>
                        )}
                        <div>
                            <label className="block text-slate-700 text-[13px] font-semibold mb-1.5">Email Address</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" type="email" placeholder="admin@hospital.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="text-slate-700 text-[13px] font-semibold">Password</label>
                                {tab === "login" && <a href="#" className="text-blue-600 text-[13px] hover:underline">Forgot password?</a>}
                            </div>
                            <div className="relative">
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all pr-12" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 text-lg">
                                    {showPass ? "👁" : "🔒"}
                                </button>
                            </div>
                        </div>
                        {tab === "login" && (
                            <div className="flex items-center gap-2 mt-1">
                                <input type="checkbox" id="remember" className="w-4 h-4 accent-blue-600 rounded cursor-pointer" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} />
                                <label htmlFor="remember" className="text-slate-500 text-sm cursor-pointer">Remember me for 30 days</label>
                            </div>
                        )}
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] py-3.5 rounded-xl mt-8 transition-all shadow-md shadow-blue-600/20 disabled:opacity-70" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Signing in..." : tab === "login" ? "Sign In to Admin Portal →" : "Create Admin Account →"}
                    </button>

                    {/* Restored Emergency Banner */}
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                        <span className="text-2xl">🚨</span>
                        <div>
                            <div className="text-red-600 text-[13px] font-bold mb-0.5">Medical Emergency?</div>
                            <div className="text-slate-600 text-xs">Call <strong className="text-red-600">112</strong> or use our emergency feature</div>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-slate-500 text-xs">
                        Not an admin? <a href="/UserLogin" className="text-cyan-600 font-semibold hover:underline">Patient Login</a> · <a href="/DoctorLogin" className="text-blue-600 font-semibold hover:underline">Doctor Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}