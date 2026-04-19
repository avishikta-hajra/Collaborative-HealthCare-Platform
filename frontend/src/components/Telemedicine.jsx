import { useState } from "react";

export default function Telemedicine() {
    const [inCall, setInCall] = useState(false);
    const [patientData, setPatientData] = useState({ name: "", symptoms: "" });

    const handleJoinCall = async (e) => {
        e.preventDefault();
        console.log("Sending data to backend:", patientData);
        setInCall(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-3xl w-full">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold font-heading text-blue-950 mb-2">
                        Live Consultation
                    </h1>
                    <p className="text-slate-600 text-sm">Connect with an available doctor immediately.</p>
                </div>

                {!inCall ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md mx-auto shadow-sm">
                        <form onSubmit={handleJoinCall} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                                <input
                                    type="text" required
                                    className="input-field"
                                    placeholder="e.g. John Doe"
                                    value={patientData.name}
                                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Primary Symptoms</label>
                                <textarea
                                    required rows="3"
                                    className="input-field resize-none"
                                    placeholder="Briefly describe how you are feeling..."
                                    value={patientData.symptoms}
                                    onChange={(e) => setPatientData({ ...patientData, symptoms: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-main mt-2">
                                Enter Waiting Room
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-blue-950 rounded-2xl overflow-hidden shadow-xl border border-blue-900">
                        <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                            <p className="text-white text-sm animate-pulse">Connecting to Doctor's stream...</p>
                            <div className="absolute bottom-4 right-4 w-32 aspect-video bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 shadow-md">
                                Your Camera
                            </div>
                        </div>
                        <div className="bg-blue-950 p-4 flex justify-center gap-4">
                            <button className="w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">🎤</button>
                            <button className="w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">📹</button>
                            <button onClick={() => setInCall(false)} className="w-12 h-12 rounded-full bg-yellow-500 text-blue-950 flex items-center justify-center hover:bg-yellow-400 transition-colors font-bold shadow-md">End</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}