import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Video, Mic, MicOff, VideoOff, 
    PhoneOff, MessageSquare, FileText, User, 
    Calendar, Paperclip, Send, Clock, 
    Search, Loader2, Info, Star, CircleAlert,
    CalendarDays, Filter, Users, Hourglass
} from "lucide-react";

// Updated Mock Data: Added "Available" vs "In Call" statuses with queues
const initialDoctorsList = [
    { 
        id: "doc-1", name: "Dr. Arvind Mehta", specialty: "General Physician", 
        status: "Available", fee: "₹500", rating: "4.9", experience: "12 yrs", hospital: "Apollo e-Health"
    },
    { 
        id: "doc-2", name: "Dr. Rajesh Kumar", specialty: "Cardiology", 
        status: "In Call", queue: 2, estWait: "10 mins", fee: "₹1200", rating: "4.9", experience: "15 yrs", hospital: "Heart Institute"
    },
    { 
        id: "doc-3", name: "Dr. Anil Kapoor", specialty: "Orthopedics", 
        status: "Offline", nextSlot: "Today, 6:00 PM", fee: "₹900", rating: "4.8", experience: "20 yrs", hospital: "Bone & Joint Care"
    },
    { 
        id: "doc-4", name: "Dr. Sunita Sharma", specialty: "Pediatrics", 
        status: "Available", fee: "₹600", rating: "4.8", experience: "8 yrs", hospital: "City Care Clinic"
    },
    { 
        id: "doc-5", name: "Dr. Priya Desai", specialty: "Dermatology", 
        status: "In Call", queue: 1, estWait: "4 mins", fee: "₹700", rating: "4.7", experience: "6 yrs", hospital: "SkinLife Center"
    },
    { 
        id: "doc-6", name: "Dr. Vikram Singh", specialty: "Cardiology", 
        status: "Offline", nextSlot: "Tomorrow, 4:00 PM", fee: "₹1500", rating: "4.9", experience: "22 yrs", hospital: "Fortis Escorts"
    }
];

const initialAppointments = [
    { id: "app-1", doctorName: "Dr. Meera Vasudevan", specialty: "Endocrinology", date: "April 22, 2026", time: "10:30 AM" }
];

const specialtyFilters = ["All", "Cardiology", "Orthopedics", "General Physician", "Pediatrics", "Dermatology"];
const availableDates = ["Apr 20 (Today)", "Apr 21 (Tomorrow)", "Apr 22 (Wed)", "Apr 23 (Thu)"];
const availableTimes = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "6:00 PM"];

export default function Telemedicine() {
    const navigate = useNavigate();
    
    // Core States
    const [viewState, setViewState] = useState("dashboard"); // dashboard | intake | schedule | waiting_room | connecting | active
    const [appointments, setAppointments] = useState(initialAppointments);
    
    // Selection & Filter
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");
    
    // Form & Waitlist States
    const [symptoms, setSymptoms] = useState("");
    const [scheduleDate, setScheduleDate] = useState(availableDates[0]);
    const [scheduleTime, setScheduleTime] = useState("");
    const [currentQueuePos, setCurrentQueuePos] = useState(0);
    
    // Call Room States
    const [micEnabled, setMicEnabled] = useState(true);
    const [camEnabled, setCamEnabled] = useState(true);
    const [activeTab, setActiveTab] = useState("chat");
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeTab]);

    // Simulated Waitlist Queue progression
    useEffect(() => {
        let timer;
        if (viewState === "waiting_room" && currentQueuePos > 0) {
            timer = setTimeout(() => {
                setCurrentQueuePos(prev => prev - 1);
            }, 3000); // Progress queue every 3 seconds for demo purposes
        } else if (viewState === "waiting_room" && currentQueuePos === 0) {
            // Queue finished, move to connecting
            setViewState("connecting");
            setTimeout(() => connectToCall(), 1500);
        }
        return () => clearTimeout(timer);
    }, [viewState, currentQueuePos]);

    const filteredDoctors = initialDoctorsList.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === "All" || doc.specialty === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        if(doctor.status === "Offline") {
            setViewState("schedule");
        } else {
            setViewState("intake");
        }
    };

    const handleStartConsultation = (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return alert("Please describe your symptoms briefly.");
        
        if (selectedDoctor.status === "In Call") {
            setCurrentQueuePos(selectedDoctor.queue);
            setViewState("waiting_room");
        } else {
            setViewState("connecting");
            setTimeout(() => connectToCall(), 1500);
        }
    };

    const connectToCall = () => {
        setViewState("active");
        setMessages([{ sender: "system", text: `Connection secure. You are now consulting with ${selectedDoctor.name}.` }]);
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: "doctor", text: `Hello. I have reviewed your intake notes. How long have you been experiencing these symptoms?` }]);
        }, 1500);
    };

    const handleScheduleAppointment = (e) => {
        e.preventDefault();
        if (!scheduleTime) return alert("Please select a time slot.");

        const newAppointment = {
            id: `app-${Date.now()}`,
            doctorName: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            date: scheduleDate.split(' ')[0], 
            time: scheduleTime
        };
        
        setAppointments(prev => [...prev, newAppointment]);
        setScheduleTime("");
        setScheduleDate(availableDates[0]);
        setSelectedDoctor(null);
        setViewState("dashboard");
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { sender: "user", text: chatInput }]);
        setChatInput("");
    };

    const endCall = () => {
        if(window.confirm("Are you sure you want to end this consultation?")) {
            setViewState("dashboard");
            setSelectedDoctor(null);
            setSymptoms("");
            setMessages([]);
        }
    };

    // Helper for rendering status badges accurately
    const getStatusStyles = (status) => {
        switch(status) {
            case "Available": return { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
            case "In Call": return { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
            default: return { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" };
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-slate-50 border-t-2 pt-24 pb-16 pl-10 pr-10 flex flex-col">
            
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full flex justify-between items-center">
                    <button 
                        onClick={() => viewState !== 'dashboard' && viewState !== 'active' ? setViewState('dashboard') : navigate('/')} 
                        className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> {viewState === 'dashboard' ? 'Back to Home' : 'Back to Directory'}
                    </button>
                    {viewState === "active" && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs font-bold uppercase tracking-wider shadow-sm">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div> Live Call
                        </div>
                    )}
                </div>
            </div>

            {/* Edge-to-Edge Main Container */}
            <div className="w-full flex-1">
                
                {/* STATE 1: DASHBOARD */}
                {viewState === "dashboard" && (
                    <div className="w-full">
                        <div className="text-center mt-8 mb-10">
                            <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                                Telemedicine <span className="text-blue-900">Portal</span>
                            </h1>
                            <p className="text-slate-600 text-[18px] leading-relaxed max-w-5xl mx-auto mb-6">
                                Consult instantly with available specialists or join a waitlist for doctors currently in calls.
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3 flex flex-col">
                                
                                {/* Search & Filter Bar */}
                                <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 p-5 mb-8 flex flex-col items-start gap-4">
                                    <div className="relative w-full">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search by doctor name or specialty..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar pb-1">
                                        <Filter className="w-5 h-5 text-cyan-600 shrink-0" />
                                        {specialtyFilters.map(filter => (
                                            <button 
                                                key={filter}
                                                onClick={() => setSelectedFilter(filter)}
                                                className={`px-5 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors border-2 cursor-pointer ${
                                                    selectedFilter === filter 
                                                    ? 'bg-blue-950 text-white border-blue-950 shadow-md' 
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Doctor Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredDoctors.map(doc => {
                                        const styles = getStatusStyles(doc.status);
                                        return (
                                            <div key={doc.id} className="bg-white border-sky-700 border-2 rounded-3xl p-6 flex flex-col hover:-translate-y-1 hover:border-blue-800 transition-all duration-300 shadow-lg group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 group-hover:border-cyan-300 transition-colors">
                                                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${doc.name}&backgroundColor=f1f5f9&textColor=475569`} alt={doc.name} className="w-full h-full" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-poppins text-[18px] font-bold text-blue-950 leading-tight group-hover:text-cyan-700 transition-colors">{doc.name}</h3>
                                                            <p className="text-[13px] font-medium text-slate-500 mt-1">{doc.specialty}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                                                    <div className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-slate-50 bg-slate-50/50">
                                                        <Star className="w-4 h-4 text-amber-500 shrink-0" />
                                                        <div className="text-[12px] font-bold text-slate-700">{doc.rating}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-slate-50 bg-slate-50/50">
                                                        <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                                                        <div className="text-[12px] font-bold text-slate-700">{doc.experience}</div>
                                                    </div>
                                                    <div className="col-span-2 flex justify-between items-center bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Consultation Fee</span>
                                                        <span className="font-bold text-[14px] text-blue-950">{doc.fee}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-5 border-t-2 border-slate-100 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`}></span>
                                                            <span className={`text-[13px] font-bold ${styles.text}`}>{doc.status}</span>
                                                        </div>
                                                        {doc.status === 'In Call' && (
                                                            <span className="text-[11px] font-semibold text-slate-400 mt-1 ml-4">{doc.queue} patient(s) waiting</span>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleSelectDoctor(doc)}
                                                        className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm cursor-pointer ${
                                                            doc.status === 'Available' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 
                                                            doc.status === 'In Call' ? 'bg-white border-2 border-amber-500 text-amber-700 hover:bg-amber-50' :
                                                            'bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                    >
                                                        {doc.status === 'Available' ? 'Consult Now' : 
                                                         doc.status === 'In Call' ? 'Join Waitlist' : 'Schedule'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                                <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                                    <h2 className="font-poppins text-lg font-bold text-blue-950 mb-5 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
                                        <CalendarDays className="w-5 h-5 text-cyan-600" /> My Appointments
                                    </h2>
                                    {appointments.length > 0 ? (
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                                            {appointments.map(app => (
                                                <div key={app.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-cyan-300 transition-colors group">
                                                    <div className="font-bold text-[15px] text-blue-950 group-hover:text-cyan-700 transition-colors">{app.doctorName}</div>
                                                    <div className="text-[13px] font-medium text-slate-500 mb-3">{app.specialty}</div>
                                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                                        <div className="text-[12px] font-bold text-blue-800 bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200">
                                                            {app.date} • {app.time}
                                                        </div>
                                                        <button className="text-[13px] font-bold text-cyan-600 hover:text-blue-900 transition-colors cursor-pointer">Join Link</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Calendar className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="text-[14px] font-medium text-slate-500">No upcoming appointments.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                            <CircleAlert className="w-5 h-5 text-indigo-700" />
                                        </div>
                                        <h3 className="font-poppins font-bold text-blue-950 text-lg">Understanding Statuses</h3>
                                    </div>
                                    <ul className="text-[14px] font-medium text-slate-600 space-y-3">
                                        <li><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Available</span> Connect instantly.</li>
                                        <li><span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">In Call</span> Doctor is with a patient. Join the virtual waitlist.</li>
                                        <li><span className="text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">Offline</span> Pick a future schedule.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STATE 2: INTAKE FORM */}
                {viewState === "intake" && selectedDoctor && (
                    <div className="max-w-3xl mx-auto animate-fade-in mt-8">
                        <div className="text-center mb-8">
                            <h1 className="font-poppins text-3xl font-bold text-blue-950 mb-2">Patient Intake Form</h1>
                            <p className="text-slate-600 text-[16px]">
                                {selectedDoctor.status === "Available" 
                                    ? "Provide details to connect instantly." 
                                    : "Provide details to join the waitlist."}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 p-8">
                            <div className={`flex items-center gap-4 p-5 border-2 rounded-2xl mb-8 ${getStatusStyles(selectedDoctor.status).bg} ${getStatusStyles(selectedDoctor.status).border}`}>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedDoctor.name}&backgroundColor=f1f5f9&textColor=475569`} alt="Doctor" className="w-full h-full" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-poppins font-bold text-[18px] text-blue-950">{selectedDoctor.name}</h3>
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase border ${selectedDoctor.status === 'Available' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                                            {selectedDoctor.status}
                                        </span>
                                    </div>
                                    <p className="text-[14px] font-medium text-slate-600">{selectedDoctor.specialty} • {selectedDoctor.hospital}</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleStartConsultation} className="space-y-6">
                                <div>
                                    <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Chief Complaint / Symptoms</label>
                                    <textarea 
                                        required
                                        rows="5"
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        placeholder={`Briefly describe what you are experiencing so ${selectedDoctor.name} can review it before joining...`}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-sm resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t-2 border-slate-100">
                                    <button type="button" className="text-[14px] font-bold text-slate-500 hover:text-cyan-700 transition-colors flex items-center gap-2 cursor-pointer">
                                        <Paperclip className="w-5 h-5" /> Attach reports
                                    </button>
                                    <button type="submit" className={`px-8 py-3.5 rounded-xl text-[15px] font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${selectedDoctor.status === 'Available' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}>
                                        {selectedDoctor.status === 'Available' ? <><Video className="w-5 h-5" /> Connect Now</> : <><Users className="w-5 h-5" /> Enter Waiting Room</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* STATE 3: SCHEDULING (For Offline Doctors) */}
                {viewState === "schedule" && selectedDoctor && (
                    <div className="max-w-3xl mx-auto animate-fade-in mt-8">
                        <div className="text-center mb-8">
                            <h1 className="font-poppins text-3xl font-bold text-blue-950 mb-2">Schedule Appointment</h1>
                            <p className="text-slate-600 text-[16px]">Select an available time slot for your consultation.</p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border-sky-700 border-2 p-8">
                            <div className="flex items-center gap-4 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-8">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedDoctor.name}&backgroundColor=f1f5f9&textColor=475569`} alt="Doctor" className="w-full h-full" />
                                </div>
                                <div>
                                    <h3 className="font-poppins font-bold text-[18px] text-blue-950 mb-1">{selectedDoctor.name}</h3>
                                    <p className="text-[14px] font-medium text-slate-600">{selectedDoctor.specialty} • {selectedDoctor.fee}</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleScheduleAppointment}>
                                <div className="mb-6">
                                    <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Select Date</label>
                                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                        {availableDates.map(date => (
                                            <button 
                                                key={date} 
                                                type="button" 
                                                onClick={() => {setScheduleDate(date); setScheduleTime("");}} 
                                                className={`px-5 py-3.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all border-2 cursor-pointer ${scheduleDate === date ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                            >
                                                {date}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Available Time Slots</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {availableTimes.map(time => (
                                            <button 
                                                key={time} 
                                                type="button" 
                                                onClick={() => setScheduleTime(time)} 
                                                className={`py-3 rounded-xl text-[14px] font-bold transition-all border-2 text-center cursor-pointer ${scheduleTime === time ? 'bg-blue-950 border-blue-950 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t-2 border-slate-100 flex justify-end">
                                    <button type="submit" disabled={!scheduleTime} className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl text-[15px] font-bold transition-all shadow-md cursor-pointer">
                                        Confirm Appointment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* STATE 4: WAITING ROOM */}
                {viewState === "waiting_room" && (
                    <div className="h-[65vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-fade-in">
                        <div className="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center border-4 border-amber-200 shadow-lg mb-8 relative">
                            <Hourglass className="w-10 h-10 text-amber-500 animate-pulse" />
                            {currentQueuePos === 0 && (
                                <div className="absolute inset-0 border-4 border-cyan-400 rounded-3xl animate-ping opacity-50"></div>
                            )}
                        </div>
                        <h2 className="font-poppins text-3xl font-bold text-blue-950 mb-3">Virtual Waiting Room</h2>
                        <p className="text-slate-600 text-[16px] mb-8">{selectedDoctor.name} is wrapping up a consultation.</p>
                        
                        <div className="bg-white border-sky-700 border-2 rounded-3xl p-8 w-full shadow-xl">
                            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2">Your Queue Position</div>
                            <div className="text-6xl font-poppins font-bold text-cyan-600 mb-6">{currentQueuePos === 0 ? "Next" : currentQueuePos}</div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
                                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: currentQueuePos === 0 ? '100%' : '50%' }}></div>
                            </div>
                            <p className="text-[14px] font-medium text-slate-500">
                                {currentQueuePos === 0 ? "Preparing your secure connection..." : `Estimated wait time: ~${currentQueuePos * 4} mins`}
                            </p>
                        </div>
                        <button onClick={() => setViewState("dashboard")} className="mt-8 text-[15px] font-bold text-slate-500 hover:text-cyan-700 transition-colors cursor-pointer">
                            Leave Waiting Room
                        </button>
                    </div>
                )}

                {/* STATE 5: CONNECTING */}
                {viewState === "connecting" && (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mb-6" />
                        <h3 className="font-poppins text-2xl font-bold text-blue-950 mb-2">Establishing secure connection...</h3>
                        <p className="text-slate-500 text-[16px]">Please allow camera and microphone access if prompted.</p>
                    </div>
                )}

                {/* STATE 6: ACTIVE CALL */}
                {viewState === "active" && selectedDoctor && (
                    <div className="w-full h-[650px] lg:h-[750px] animate-fade-in bg-white border-sky-700 border-2 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row mt-4">
                        
                        {/* Left: Main Video Stage */}
                        <div className="flex-1 bg-slate-950 flex flex-col relative">
                            <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
                                <div className="text-white">
                                    <div className="font-poppins font-bold text-[18px] text-shadow-md">{selectedDoctor.name}</div>
                                    <div className="text-[13px] font-medium text-slate-300">{selectedDoctor.specialty}</div>
                                </div>
                            </div>

                            <div className="flex-1 relative flex items-center justify-center w-full h-full">
                                <div className="text-center opacity-60">
                                    <div className="w-28 h-28 bg-slate-800 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-slate-700 shadow-lg overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedDoctor.name}&backgroundColor=1e293b&textColor=94a3b8`} alt="Doctor" className="w-full h-full" />
                                    </div>
                                    <div className="text-[14px] font-bold text-slate-400">Waiting for video stream...</div>
                                </div>
                                <div className="absolute bottom-5 right-5 w-36 md:w-56 aspect-video bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-xl overflow-hidden z-20">
                                    {camEnabled ? (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">You</span>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                            <VideoOff className="w-6 h-6 text-slate-600" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-20 bg-slate-900 border-t-2 border-slate-800 flex items-center justify-center gap-4 px-6 z-20">
                                <button onClick={() => setMicEnabled(!micEnabled)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${micEnabled ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-900/40 text-red-500 hover:bg-red-900/60'}`}>
                                    {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                </button>
                                <button onClick={() => setCamEnabled(!camEnabled)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${camEnabled ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-900/40 text-red-500 hover:bg-red-900/60'}`}>
                                    {camEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                </button>
                                <div className="w-px h-8 bg-slate-700 mx-2"></div>
                                <button onClick={endCall} className="px-6 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 text-[14px] font-bold transition-colors cursor-pointer shadow-md">
                                    <PhoneOff className="w-5 h-5" /> End Call
                                </button>
                            </div>
                        </div>

                        {/* Right: Clinical Panel */}
                        <div className="w-full lg:w-[350px] xl:w-[420px] bg-white border-l-2 border-sky-200 flex flex-col h-[400px] lg:h-full">
                            <div className="flex border-b-2 border-sky-200 bg-blue-50/50 text-[13px] font-bold uppercase tracking-widest text-slate-600">
                                <button onClick={() => setActiveTab("chat")} className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors cursor-pointer ${activeTab === "chat" ? "text-cyan-700 border-b-2 border-cyan-600 bg-white shadow-inner" : "border-b-2 border-transparent hover:text-blue-900"}`}>
                                    <MessageSquare className="w-4 h-4" /> Chat
                                </button>
                                <button onClick={() => setActiveTab("prescription")} className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors cursor-pointer ${activeTab === "prescription" ? "text-cyan-700 border-b-2 border-cyan-600 bg-white shadow-inner" : "border-b-2 border-transparent hover:text-blue-900"}`}>
                                    <FileText className="w-4 h-4" /> E-Rx
                                </button>
                            </div>

                            {activeTab === "chat" && (
                                <div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50/50">
                                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                {msg.sender === 'system' ? (
                                                    <div className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 my-3">{msg.text}</div>
                                                ) : (
                                                    <div className={`max-w-[85%] rounded-xl p-3 text-[14px] font-medium shadow-sm ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'}`}>
                                                        {msg.text}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <div className="p-4 border-t-2 border-sky-200 bg-white">
                                        <form onSubmit={handleSendMessage} className="flex gap-3">
                                            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] transition-all shadow-inner" />
                                            <button type="submit" disabled={!chatInput.trim()} className="px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors cursor-pointer shadow-sm">
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === "prescription" && (
                                <div className="flex flex-col flex-1 p-6 bg-slate-50 overflow-y-auto">
                                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 mb-5 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-poppins font-bold text-blue-950 text-[16px]">{selectedDoctor.name}</div>
                                            <FileText className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="text-[13px] font-medium text-slate-500">{selectedDoctor.hospital}</div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                            <Info className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <h4 className="font-poppins font-bold text-blue-950 mb-1">No active prescription</h4>
                                        <p className="text-[13px] font-medium text-slate-500 max-w-[220px]">Digital prescriptions generated by {selectedDoctor.name} will appear here.</p>
                                    </div>
                                    <button disabled className="mt-5 w-full py-3.5 bg-slate-200 text-slate-400 rounded-xl text-[14px] font-bold cursor-not-allowed">Download PDF</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}