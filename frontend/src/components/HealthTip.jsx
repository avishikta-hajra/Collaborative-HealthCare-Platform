import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Droplets, Moon, Apple,
    Activity, Brain, Heart, Sun, ShieldCheck
} from 'lucide-react';

const tips = [
    {
        title: "Stay Hydrated",
        description: "Drink at least 8 glasses of water a day. Proper hydration is essential for digestion, joint lubrication, and maintaining a healthy body temperature.",
        icon: Droplets,
        color: "text-blue-500",
        bg: "bg-blue-100"
    },
    {
        title: "Prioritize Sleep",
        description: "Aim for 7-9 hours of quality sleep each night. Good sleep hygiene improves cognitive function, mood, and long-term cardiovascular health.",
        icon: Moon,
        color: "text-indigo-500",
        bg: "bg-indigo-100"
    },
    {
        title: "Eat a Balanced Diet",
        description: "Incorporate a rainbow of fruits and vegetables into your meals. Nutrient-dense foods boost immunity and lower the risk of chronic diseases.",
        icon: Apple,
        color: "text-emerald-500",
        bg: "bg-emerald-100"
    },
    {
        title: "Daily Exercise",
        description: "Get at least 30 minutes of moderate activity daily. A brisk walk or light jog can significantly improve your cardiovascular and respiratory health.",
        icon: Activity,
        color: "text-orange-500",
        bg: "bg-orange-100"
    },
    {
        title: "Mental Wellness",
        description: "Take time for mindfulness or meditation. Reducing stress lowers cortisol levels, which helps prevent burnout and improves mental clarity.",
        icon: Brain,
        color: "text-purple-500",
        bg: "bg-purple-100"
    },
    {
        title: "Preventive Care",
        description: "Don't skip your annual checkups. Regular screenings can catch potential health issues early, making them much easier to treat and manage.",
        icon: ShieldCheck,
        color: "text-red-500",
        bg: "bg-red-100"
    }
];

export default function HealthTip() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-slate-50">

            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full flex justify-between items-center">
                    <button onClick={() => navigate('/gamification')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Module Selection
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-28 pb-16 px-4 md:px-10 lg:px-20 max-w-6xl mx-auto animate-fade-in">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                        Daily <span className="text-blue-900">Health Tips</span>
                    </h1>
                    <p className="text-slate-600 text-[18px] leading-relaxed max-w-2xl mx-auto">
                        Small changes to your daily routine can lead to significant improvements in your overall physical and mental well-being.
                    </p>
                </div>

                {/* Tip of the Day Highlight */}
                <div className="bg-linear-to-br from-cyan-50 to-blue-100 border-2 border-cyan-200 rounded-3xl p-8 md:p-10 mb-12 shadow-md flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition-shadow">
                    <div className="w-24 h-24 shrink-0 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-cyan-100">
                        <Sun className="w-12 h-12 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-cyan-700 uppercase mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4 fill-cyan-700" /> Tip of the Day
                        </h2>
                        <h3 className="text-2xl font-bold text-blue-950 mb-3">Start your morning with a glass of water</h3>
                        <p className="text-slate-600 text-[16px] leading-relaxed">
                            Drinking water first thing in the morning helps jumpstart your metabolism, flushes out toxins, and gives your brain the hydration it needs to stay sharp and focused throughout the day.
                        </p>
                    </div>
                </div>

                {/* Health Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tips.map((tip, idx) => (
                        <div key={idx} className="bg-white border-sky-700 border-2 rounded-3xl p-8 shadow-xl hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 group flex flex-col h-full">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${tip.bg} group-hover:scale-110 transition-transform duration-300`}>
                                <tip.icon className={`w-8 h-8 ${tip.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-blue-950 mb-3">{tip.title}</h3>
                            <p className="text-slate-600 text-[15px] leading-relaxed flex-1">{tip.description}</p>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}