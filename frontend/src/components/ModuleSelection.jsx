import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Trophy } from 'lucide-react';

export default function ModuleSelection() {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-slate-50 border-t-2 pt-24 pb-16 px-6 lg:px-10 flex flex-col">
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto w-full mt-6 flex-1 flex flex-col justify-center">
                <div className="text-center mt-2 mb-12">
                    <h2 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 mb-3">
                        Gamified <span className="text-blue-900">Module</span>
                    </h2>
                    <p className="text-slate-600 text-[16px] md:text-[18px] max-w-2xl mx-auto">
                        Enhance your health knowledge. Choose to explore daily health tips or challenge yourself with our interactive quizzes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
                    {/* Health Tip Card */}
                    <div onClick={() => navigate('/health-tips')} className="bg-white border-sky-700 border-2 rounded-3xl p-10 hover:shadow-[0_20px_40px_rgb(6,182,212,0.1)] hover:-translate-y-2 hover:border-blue-800 transition-all duration-300 flex flex-col items-center text-center h-full group cursor-pointer">
                        <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                            <Lightbulb className="w-10 h-10 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-blue-950">Daily Health Tips</h3>
                        <p className="text-slate-500 text-[15px] leading-relaxed mb-8 flex-1">Discover actionable, bite-sized health tips to improve your daily physical and mental well-being.</p>
                        <button className="w-full text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors bg-amber-500 hover:bg-amber-600 shadow-md">Explore Tips →</button>
                    </div>

                    {/* Gamified Quiz Card */}
                    <div onClick={() => navigate('/quiz')} className="bg-white border-sky-700 border-2 rounded-3xl p-10 hover:shadow-[0_20px_40px_rgb(6,182,212,0.1)] hover:-translate-y-2 hover:border-blue-800 transition-all duration-300 flex flex-col items-center text-center h-full group cursor-pointer">
                        <div className="w-20 h-20 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                            <Trophy className="w-10 h-10 text-cyan-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-blue-950">Health Quiz</h3>
                        <p className="text-slate-500 text-[15px] leading-relaxed mb-8 flex-1">Test your health knowledge with interactive, category-based quizzes and climb the high score ranks.</p>
                        <button className="w-full text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors bg-cyan-600 hover:bg-cyan-700 shadow-md">Play Quiz →</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
