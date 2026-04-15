import { useState } from "react";
import { ArrowLeft, Mail, Lock, User, LogIn as LogInIcon, UserPlus as UserPlusIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
    const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", remember: false });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [tab, setTab] = useState("login"); // login | register
    const navigate = useNavigate();

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-sans overflow-hidden bg-linear-to-b from-cyan-100 via-indigo-100 to-blue-200 border-t-2 pt-24">
            {/* Top navbar like HomePage/AdminLogin */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 md:px-6 lg:px-14 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.2)] border-b-2 border-blue-300">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="w-full">
                        <button onClick={() => navigate('/PortalSelection')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4">
                            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Portal selection
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md py-6 mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                        <p className="text-sm text-gray-500">Sign in to your patient account</p>
                    </div>

                    <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                        <button onClick={() => setTab('login')} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
                            <LogInIcon className="w-4 h-4" />
                            <span>Login</span>
                        </button>
                        <button onClick={() => setTab('register')} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
                            <UserPlusIcon className="w-4 h-4" />
                            <span>Register</span>
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        {tab === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input name="fullName" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Your full name" className="w-full pl-12 pr-4 py-3 border rounded-xl" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input name="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 border rounded-xl" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input name="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type={showPass ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-12 pr-12 py-3 border rounded-xl" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPass ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>

                        {tab === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input name="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full pl-4 pr-4 py-3 border rounded-xl" />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input id="remember" type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} className="w-4 h-4 accent-emerald-400" />
                                <label htmlFor="remember" className="text-sm text-gray-500">Remember me for 30 days</label>
                            </div>
                            {tab === 'login' && <a href="#" className="text-emerald-400">Forgot password?</a>}
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold">{loading ? 'Signing in...' : (tab === 'login' ? 'Sign In to Patient Portal' : 'Create My Account')}</button>

                        <div className="text-center text-sm text-gray-500 mt-2">
                            {tab === 'login' ? (
                                <span>Don't have an account? <button type="button" onClick={() => setTab('register')} className="text-emerald-400 font-semibold">Create one</button></span>
                            ) : (
                                <span>Already have an account? <button type="button" onClick={() => setTab('login')} className="text-emerald-400 font-semibold">Sign in</button></span>
                            )}
                        </div>
                    </form>
                    {/* REMOVED */}
                    {/* <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                        <span className="text-2xl">🚨</span>
                        <div>
                            <div className="text-red-600 text-sm font-bold">Medical Emergency?</div>
                            <div className="text-sm text-gray-600">Call <strong className="text-red-600">112</strong> or use our emergency feature</div>
                        </div>
                    </div> */}

                    {/* <p className="text-center mt-6 text-sm text-gray-500">Not a patient? <a href="/DoctorLogin" className="text-cyan-600">Doctor Login</a> · <a href="/AdminLogin" className="text-blue-600">Admin Login</a></p> */}
                </div>
            </div>
        </div>
    );
}