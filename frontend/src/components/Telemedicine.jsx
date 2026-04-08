import { useState } from "react";

export default function Telemedicine() {
    const [inCall, setInCall] = useState(false);
    const [patientData, setPatientData] = useState({
        name: "",
        symptoms: "",
    });

    const handleJoinCall = async (e) => {
        e.preventDefault();

        // 1. Here is where you will call your Spring Boot API Gateway
        console.log("Sending data to backend:", patientData);
        /*
        try {
            const response = await fetch("http://localhost:8080/api/telemedicine/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patientData)
            });
            const sessionData = await response.json();
            // Use sessionData to connect to the specific video room
        } catch (error) {
            console.error("Failed to connect", error);
        }
        */

        // 2. Transition UI to the video call room
        setInCall(true);
    };

    return (
        <div className="min-h-screen bg-[#050D1A] text-[#E8F0FE] font-sans p-4 md:p-10 flex items-center justify-center">
            <div className="max-w-4xl w-full">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 font-serif-display">
                        <span className="bg-linear-to-r from-[#00C9A7] to-[#0099FF] bg-clip-text text-transparent">
                            Live Consultation
                        </span>
                    </h1>
                    <p className="text-[#94A3C0]">Connect with an available doctor immediately.</p>
                </div>

                {!inCall ? (
                    /* INTAKE FORM */
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-lg mx-auto backdrop-blur-md">
                        <form onSubmit={handleJoinCall} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#94A3C0] mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#050D1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00C9A7] transition-colors"
                                    placeholder="e.g. John Doe"
                                    value={patientData.name}
                                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#94A3C0] mb-2">Primary Symptoms</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full bg-[#050D1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00C9A7] transition-colors"
                                    placeholder="Briefly describe how you are feeling..."
                                    value={patientData.symptoms}
                                    onChange={(e) => setPatientData({ ...patientData, symptoms: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full bg-linear-to-br from-[#00C9A7] to-[#0099FF] text-white font-semibold py-3.5 rounded-xl hover:shadow-[0_8px_30px_rgba(0,201,167,0.3)] transition-all hover:-translate-y-0.5"
                            >
                                Enter Waiting Room
                            </button>
                        </form>
                    </div>
                ) : (
                    /* VIDEO CALL UI (Placeholder) */
                    <div className="bg-[#0a1526] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {/* Video Area */}
                        <div className="relative aspect-video bg-black flex items-center justify-center">
                            <p className="text-[#94A3C0] animate-pulse">Connecting to Doctor's video stream...</p>

                            {/* Self View (Picture-in-Picture) */}
                            <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-xl border-2 border-white/20 overflow-hidden shadow-lg">
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Your Camera</div>
                            </div>
                        </div>

                        {/* Call Controls */}
                        <div className="bg-[#050D1A] p-6 flex justify-center gap-6 border-t border-white/5">
                            <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                🎤
                            </button>
                            <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                📹
                            </button>
                            <button
                                onClick={() => setInCall(false)}
                                className="w-14 h-14 rounded-full bg-[#FF6B6B] flex items-center justify-center hover:bg-[#ff5252] transition-colors shadow-[0_4px_20px_rgba(255,107,107,0.4)]"
                            >
                                ☎️
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}