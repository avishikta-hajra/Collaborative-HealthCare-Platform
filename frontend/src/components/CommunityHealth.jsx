import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, AlertTriangle, MapPin,
    ThumbsUp, ThumbsDown, Clock,
    ShieldAlert, Send, Activity
} from "lucide-react";

// Initial Mock Data
const initialReports = [
    {
        id: 1,
        title: "Sudden rise in Dengue cases",
        location: "Salt Lake Sector V, Kolkata",
        description: "Multiple residents in my block have reported high fever and joint pain over the last 48 hours. Stagnant water in the nearby construction site might be the cause.",
        severity: "High",
        upvotes: 142,
        downvotes: 3,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userVoted: null
    },
    {
        id: 2,
        title: "Suspected Food Poisoning Cluster",
        location: "Park Street Area",
        description: "Noticed 5-6 people admitted to the local clinic today with severe food poisoning symptoms. Seems isolated to the area.",
        severity: "Medium",
        upvotes: 56,
        downvotes: 1,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        userVoted: null
    },
    {
        id: 3,
        title: "Shortage of O-Negative Blood",
        location: "AMRI Hospital, Dhakuria",
        description: "The blood bank is currently facing a critical shortage of O-Negative blood due to multiple trauma cases tonight. Donors requested.",
        severity: "Critical",
        upvotes: 310,
        downvotes: 0,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        userVoted: null
    }
];

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function CommunityHealth() {
    const navigate = useNavigate();

    // States
    const [reports, setReports] = useState(() => {
        const saved = localStorage.getItem('communityReports');
        return saved ? JSON.parse(saved) : initialReports;
    });
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        severity: "Medium",
        description: ""
    });

    // Save reports to localStorage whenever they are updated
    useEffect(() => {
        localStorage.setItem('communityReports', JSON.stringify(reports));
    }, [reports]);

    // Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) return;

        const newReport = {
            id: Date.now(),
            ...formData,
            upvotes: 0,
            downvotes: 0,
            timestamp: new Date().toISOString(),
            userVoted: null
        };

        setReports([newReport, ...reports]);
        setFormData({ title: "", location: "", severity: "Medium", description: "" });
    };

    // Handle Voting
    const handleVote = (id, voteType) => {
        setReports(reports.map(report => {
            if (report.id === id) {
                let newUpvotes = report.upvotes;
                let newDownvotes = report.downvotes;
                let newVoteState = report.userVoted;

                if (voteType === 'up') {
                    if (report.userVoted === 'up') {
                        newUpvotes -= 1;
                        newVoteState = null;
                    } else {
                        newUpvotes += 1;
                        if (report.userVoted === 'down') newDownvotes -= 1;
                        newVoteState = 'up';
                    }
                } else if (voteType === 'down') {
                    if (report.userVoted === 'down') {
                        newDownvotes -= 1;
                        newVoteState = null;
                    } else {
                        newDownvotes += 1;
                        if (report.userVoted === 'up') newUpvotes -= 1;
                        newVoteState = 'down';
                    }
                }

                return { ...report, upvotes: newUpvotes, downvotes: newDownvotes, userVoted: newVoteState };
            }
            return report;
        }));
    };

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case "Critical": return "bg-red-100 text-red-800 border-red-200";
            case "High": return "bg-orange-100 text-orange-800 border-orange-200";
            case "Medium": return "bg-amber-100 text-amber-800 border-amber-200";
            default: return "bg-emerald-100 text-emerald-800 border-emerald-200";
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-slate-50 border-t-2 pt-24 pb-16 px-4 md:px-10 lg:px-10">

            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full">
                    <button onClick={() => navigate('/')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="text-center mt-8 mb-10 max-w-4xl mx-auto">
                <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3 flex items-center justify-center gap-3">
                    <Activity className="w-8 h-8 text-cyan-600" />
                    Community <span className="text-blue-900">Health Alerts</span>
                </h1>
                <p className="text-slate-600 text-[18px] leading-relaxed mb-6">
                    Crowdsource outbreak detection and local health incidents.
                </p>
            </div>

            {/* Main Layout Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Report Feed */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-2">
                        <h2 className="font-poppins text-xl font-bold text-blue-950">Recent Local Alerts</h2>
                        <span className="text-[14px] font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">{reports.length} Active</span>
                    </div>

                    {/* NEW: Grid layout for cards - 1 column on mobile, 2 columns on medium+ screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl hover:-translate-y-0.5 hover:border-blue-800 transition-all duration-300 flex flex-col group h-full">

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-poppins text-[18px] font-bold text-sky-950 group-hover:text-cyan-700 transition-colors leading-tight mb-1">{report.title}</h3>
                                        <p className="text-slate-500 text-[13px] flex items-center gap-1.5 font-medium">
                                            <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                                            {report.location}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-widest uppercase border-2 shrink-0 ${getSeverityBadge(report.severity)}`}>
                                        {report.severity}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <p className="text-slate-600 text-[14px] leading-relaxed mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                                    {report.description}
                                </p>

                                {/* Card Footer (Voting & Time) */}
                                <div className="flex items-center justify-between mt-auto pt-2 border-t-2 border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleVote(report.id, 'up')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors cursor-pointer border ${report.userVoted === 'up' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'}`}
                                        >
                                            <ThumbsUp className="w-4 h-4" /> {report.upvotes}
                                        </button>
                                        <button
                                            onClick={() => handleVote(report.id, 'down')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors cursor-pointer border ${report.userVoted === 'down' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'}`}
                                        >
                                            <ThumbsDown className="w-4 h-4" /> {report.downvotes}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
                                        <Clock className="w-3.5 h-3.5" /> {formatDate(report.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Reporting Form (Sticky on desktop) */}
                <div className="lg:col-span-1 sticky top-28">
                    <div className="bg-white border-sky-700 border-2 rounded-3xl p-6 shadow-xl flex flex-col">

                        <div className="flex items-center gap-3 mb-6 mt-2">
                            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center border border-cyan-200 shrink-0">
                                <ShieldAlert className="w-5 h-5 text-cyan-700" />
                            </div>
                            <div>
                                <h3 className="font-poppins text-[18px] font-bold text-blue-950 leading-tight">Submit an Alert</h3>
                                <p className="text-[12px] font-medium text-slate-500">Your report helps the community.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Issue Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Rise in Malaria Cases"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 w-4 h-4" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Neighborhood or Street"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Severity Level</label>
                                <select
                                    value={formData.severity}
                                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option value="Low">Low (Informational)</option>
                                    <option value="Medium">Medium (Cautionary)</option>
                                    <option value="High">High (Immediate Risk)</option>
                                    <option value="Critical">Critical (Emergency)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Provide detailed symptoms or context to help others understand the risk..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-[14px] font-medium transition-all shadow-inner resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 w-full bg-blue-950 hover:bg-blue-800 text-white py-3.5 rounded-xl text-[15px] font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Send className="w-5 h-5" /> Publish Alert
                            </button>
                            <p className="text-center text-[11px] font-medium text-slate-400 px-2 mt-1">
                                Reports are publicly visible and monitored by local health bodies. Please do not submit false alerts.
                            </p>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}