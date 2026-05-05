import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { LogOut, Video, Mic, PhoneOff, Send, Users, Activity, ArrowLeft, MessageSquare } from 'lucide-react';
import { authenticatedFetch, getAuthSession } from '../services/authApi';

import VideoRoom from "./VideoRoom";

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const chatEndRef = useRef(null);

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch the queue on load
    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const data = await authenticatedFetch("/api/consultations/doctor/queue");
                setQueue(data);
            } catch (error) {
                console.error("Failed to fetch queue", error);
            }
        };
        fetchQueue();
    }, []);

    // Cleanup WebSocket
    useEffect(() => {
        return () => { if (stompClient) stompClient.deactivate(); };
    }, [stompClient]);

    const handleJoinCall = async (session) => {
        setActiveSession(session);
        setQueue(prevQueue => prevQueue.filter(req => req.sessionId !== session.sessionId));
        // Fetch Chat History
        try {
            const history = await authenticatedFetch(`/api/consultations/${session.sessionId}/messages`);
            setMessages([...history, { senderType: "SYSTEM", text: `Joined consultation with ${session.patientName}.` }]);
        } catch (error) {
            setMessages([{ senderType: "SYSTEM", text: `Joined consultation with ${session.patientName}.` }]);
        }

        // Connect WebSocket
        const socket = new SockJS("http://localhost:8080/ws-telemedicine");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/session/${session.sessionId}`, (message) => {
                    const receivedMsg = JSON.parse(message.body);
                    setMessages(prev => [...prev, receivedMsg]);
                });
            }
        });
        client.activate();
        setStompClient(client);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !stompClient || !activeSession) return;

        const messagePayload = {
            sessionId: activeSession.sessionId,
            senderType: 'DOCTOR', // Tagged as doctor!
            text: chatInput,
            timestamp: new Date().toISOString()
        };

        stompClient.publish({
            destination: `/app/chat/${activeSession.sessionId}`,
            body: JSON.stringify(messagePayload)
        });
        setChatInput("");
    };

    const handleEndCall = () => {
        // Tell the backend to close the session
        if (activeSession) {
            authenticatedFetch(`/api/consultations/${activeSession.sessionId}/end`, {
                method: "POST"
            }).catch(err => console.error("Failed to update DB:", err));
        }

        // Disconnect the chat WebSocket
        if (stompClient) {
            stompClient.deactivate();
            setStompClient(null);
        }
        // Clear the screen and return to the empty waiting room view
        setActiveSession(null);
        setMessages([]);
        setChatInput("");
    };

    const handleLogout = () => {
        localStorage.removeItem("healthbridge.auth");
        sessionStorage.removeItem("healthbridge.auth");
        navigate('/login?portal=doctor');
    };

    return (
        <div className="min-h-screen font-sans text-slate-800 bg-slate-50 border-t-2 pt-24 pb-16 px-6 lg:px-10 flex flex-col">
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full flex justify-between items-center">
                    <div className="flex items-center text-slate-600 text-[16px] font-semibold tracking-widest py-4 gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center hover:text-cyan-700 transition-colors cursor-pointer"
                            aria-label="Go back home"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                        </button>
                        <div className="flex items-center pl-4 border-l-2 border-slate-300">
                            <Activity className="w-5 h-5 mr-2 text-cyan-600" /> Doctor Workspace
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Page Header */}
            <div className="text-center mt-4 mb-10">
                <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                    Telemedicine <span className="text-blue-900">Portal</span>
                </h1>
                <p className="text-slate-600 text-[18px] leading-relaxed max-w-5xl mx-auto mb-6">
                    Manage your patient queue and conduct virtual consultations seamlessly.
                </p>
            </div>

            <div className="flex flex-1 max-w-[1400px] mx-auto w-full relative z-10 flex-col">
                {activeSession ? (
                    <div className="flex flex-col w-full animate-fade-in">
                        {/* Top: Waiting Room Infos */}
                        <div className="w-full bg-white rounded-2xl shadow-sm border border-sky-200 p-4 mb-6 flex items-center gap-4 overflow-x-auto custom-scrollbar">
                            <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-slate-200">
                                <Users className="text-cyan-600 w-5 h-5" />
                                <span className="font-bold text-blue-950 whitespace-nowrap">Queue ({queue.length})</span>
                            </div>
                            {queue.length === 0 ? (
                                <span className="text-sm text-slate-500 font-medium">No other patients waiting.</span>
                            ) : (
                                <div className="flex gap-3">
                                    {queue.map((req, idx) => (
                                        <div key={idx} className="shrink-0 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm shadow-sm flex flex-col justify-center">
                                            <span className="font-bold text-blue-950">{req.patientName}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom: Left Chat, Right Video */}
                        <div className="w-full h-[650px] lg:h-[750px] bg-white border-sky-700 border-2 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                            {/* Left: Chat Area */}
                            <div className="w-full lg:w-[350px] xl:w-[420px] bg-white border-r-2 border-sky-200 flex flex-col h-[400px] lg:h-full">
                                <div className="bg-blue-50/50 py-4 border-b border-sky-200 flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-widest text-slate-600 shadow-inner shrink-0">
                                    <MessageSquare className="w-4 h-4" /> Clinical Chat
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.senderType === 'DOCTOR' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.senderType === 'SYSTEM' ? (
                                                <div className="w-full text-center text-xs font-bold uppercase text-slate-400 my-2">{msg.text}</div>
                                            ) : (
                                                <div className={`max-w-[80%] rounded-2xl p-3 text-[14px] shadow-sm ${msg.senderType === 'DOCTOR' ? 'bg-blue-950 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                                                    {msg.text}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input Box */}
                                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3 shrink-0">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Type clinical advice..."
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                                    />
                                    <button type="submit" className="px-5 bg-blue-950 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md cursor-pointer transition-colors flex items-center justify-center">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>

                            {/* Right: Video Stage */}
                            <div className="flex-1 bg-slate-950 relative overflow-hidden h-full">
                                <div className="absolute inset-0">
                                    <VideoRoom
                                        roomId={activeSession.sessionId.toString()}
                                        userId={`doctor-${activeSession.sessionId}`}
                                        userName="Dr. Mehta"
                                        onLeave={handleEndCall}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 animate-fade-in">
                        {/* Enlarged Queue List View */}
                        <div className="bg-white rounded-3xl shadow-xl border-2 border-sky-700 p-6 md:p-8 flex flex-col min-h-[550px]">
                            <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                <Users className="text-cyan-600 w-7 h-7" /> Waiting Room Queue ({queue.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto custom-scrollbar pr-2 pb-4">
                                {queue.map((req, idx) => (
                                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-slate-50 hover:border-cyan-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                                        <div>
                                            <div className="text-lg font-bold text-blue-950">{req.patientName}</div>
                                            <div className="text-sm text-slate-500 mb-4 mt-2">
                                                <span className="font-semibold text-slate-700 block mb-1">Symptoms:</span>
                                                <span className="line-clamp-3">{req.symptoms}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleJoinCall(req)}
                                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl text-[15px] font-bold shadow-md cursor-pointer transition-colors"
                                        >
                                            Join Session
                                        </button>
                                    </div>
                                ))}
                                {queue.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 h-64 flex flex-col items-center justify-center text-slate-400 opacity-70">
                                        <Activity className="w-16 h-16 mb-4 opacity-50" />
                                        <p className="text-lg font-medium text-center">No pending consultations at the moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}