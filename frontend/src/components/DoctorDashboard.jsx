import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { LogOut, Video, Mic, PhoneOff, Send, Users, Activity } from 'lucide-react';
import { authenticatedFetch, getAuthSession } from '../services/authApi';

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

    const handleLogout = () => {
        localStorage.removeItem("healthbridge.auth");
        sessionStorage.removeItem("healthbridge.auth");
        navigate('/login?portal=admin'); // Route to admin/doctor login
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
            {/* Navbar */}
            <div className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center shadow-md">
                <div className="font-bold text-xl flex items-center gap-2">
                    <Activity className="text-cyan-400" /> Doctor Portal
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-colors">
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </div>

            <div className="flex flex-1 p-6 gap-6 max-w-7xl mx-auto w-full">
                {/* Left: Patient Queue */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl shadow-md border-2 border-sky-200 p-5">
                        <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2">
                            <Users className="text-cyan-600 w-5 h-5" /> Waiting Room ({queue.length})
                        </h2>
                        <div className="space-y-3">
                            {queue.map((req, idx) => (
                                <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:border-cyan-400 transition-colors">
                                    <div className="font-bold text-blue-950">{req.patientName}</div>
                                    <div className="text-sm text-slate-500 line-clamp-1 mb-3">Symptoms: {req.symptoms}</div>
                                    <button
                                        onClick={() => handleJoinCall(req)}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg text-sm font-bold shadow-sm"
                                    >
                                        Join Session
                                    </button>
                                </div>
                            ))}
                            {queue.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No pending consultations.</p>}
                        </div>
                    </div>
                </div>

                {/* Right: Active Call Room */}
                <div className="w-2/3 bg-white rounded-2xl shadow-xl border-2 border-sky-700 overflow-hidden flex flex-col">
                    {activeSession ? (
                        <>
                            {/* Video Placeholder */}
                            <div className="h-64 bg-slate-900 relative flex items-center justify-center">
                                <div className="text-center text-slate-400">
                                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Video Stream: {activeSession.patientName}</p>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 flex flex-col bg-slate-50 min-h-[300px]">
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.senderType === 'DOCTOR' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.senderType === 'SYSTEM' ? (
                                                <div className="w-full text-center text-xs font-bold uppercase text-slate-400 my-2">{msg.text}</div>
                                            ) : (
                                                <div className={`max-w-[70%] rounded-xl p-3 text-[14px] shadow-sm ${msg.senderType === 'DOCTOR' ? 'bg-blue-950 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                                                    {msg.text}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input Box */}
                                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Type clinical advice..."
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                                    />
                                    <button type="submit" className="px-5 bg-blue-950 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md"><Send className="w-4 h-4" /></button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 flex-col">
                            <Activity className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-medium text-lg">Select a patient from the queue to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}