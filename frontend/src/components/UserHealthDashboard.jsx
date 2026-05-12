import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Bot,
  CalendarDays,
  Clock3,
  Droplets,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  LogOut,
} from "lucide-react";
import { getMyHealthDashboard } from "../services/authApi";
import MedicalReportAssistant from "./MedicalReportAssistant";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function UserHealthDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReportAssistantOpen, setIsReportAssistantOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const data = await getMyHealthDashboard();
        if (!cancelled) {
          setDashboard(data);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message || "Unable to load your health profile right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const summaryCards = useMemo(() => {
    if (!dashboard) return [];
    return [
      {
        label: "Reports Uploaded",
        value: dashboard.stats.totalReports,
        icon: FileText,
      },
      {
        label: "Processed Reports",
        value: dashboard.stats.processedReports,
        icon: ShieldCheck,
      },
      {
        label: "Need Attention",
        value: dashboard.stats.needsAttentionReports,
        icon: Activity,
      },
      {
        label: "Latest Upload",
        value: dashboard.stats.latestReportUploadedAt
          ? formatDate(dashboard.stats.latestReportUploadedAt)
          : "No uploads yet",
        icon: Clock3,
      },
    ];
  }, [dashboard]);

  const handleLogout = () => {
    localStorage.removeItem("healthbridge.auth");
    sessionStorage.removeItem("healthbridge.auth");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-24 text-center text-slate-500">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-blue-200 bg-white p-10 shadow-xl">
          <p className="text-lg font-bold text-blue-950">Loading your health profile...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-red-200 bg-white p-10 text-center shadow-xl">
          <p className="text-lg font-bold text-red-600">
            {error || "Unable to load your health profile."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-2xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-900"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-cyan-50/50 to-blue-100/70 px-4 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/")}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition-colors hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-700">
              User Health Profile
            </p>
            <h1 className="mt-2 font-poppins text-3xl font-bold tracking-wide text-blue-950 md:text-4xl">
              {dashboard.fullName}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
              A quick dashboard view of your demographic profile, uploaded health records, and
              report activity for demo and MVP walkthroughs.
            </p>
          </div>
          <button
            onClick={() => setIsReportAssistantOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-cyan-300 bg-white px-5 py-3 text-sm font-bold text-cyan-700 shadow-sm transition-all hover:border-cyan-400 hover:shadow-md"
          >
            <Bot className="h-4 w-4" />
            Medical Summarizer
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="rounded-[32px] border-2 border-sky-700 bg-white p-6 shadow-xl md:p-8">
          <div className="flex flex-wrap items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-200 bg-cyan-50 text-cyan-700">
              <UserRound className="h-10 w-10" />
            </div>
            <div className="min-w-[240px] flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold text-sky-950">{dashboard.fullName}</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  {dashboard.isActive ? "Active Account" : "Inactive"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-2 font-semibold">
                  <Mail className="h-4 w-4 text-cyan-700" />
                  {dashboard.email}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-2 font-semibold">
                  <Phone className="h-4 w-4 text-cyan-700" />
                  {dashboard.phoneNumber}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-2 font-semibold">
                  <CalendarDays className="h-4 w-4 text-cyan-700" />
                  Joined {formatDate(dashboard.joinedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-3 text-xl font-extrabold text-sky-950">{value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200 bg-white text-cyan-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border-2 border-sky-700 bg-white p-6 shadow-xl md:p-8">
            <h3 className="font-poppins text-xl font-bold text-sky-950">Demographic Profile</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoTile icon={HeartPulse} label="Age" value={dashboard.age ? `${dashboard.age} years` : "Not provided"} />
              <InfoTile icon={UserRound} label="Gender" value={dashboard.gender || "Not provided"} />
              <InfoTile icon={Droplets} label="Blood Group" value={dashboard.bloodGroup || "Not provided"} />
              <InfoTile icon={CalendarDays} label="Date of Birth" value={formatDate(dashboard.dateOfBirth)} />
              <InfoTile icon={Phone} label="Emergency Contact" value={dashboard.emergencyContactPhone || "Not provided"} />
              <InfoTile icon={ShieldCheck} label="Emergency Contact Name" value={dashboard.emergencyContactName || "Not provided"} />
            </div>

            <div className="mt-5 rounded-3xl border border-cyan-100 bg-cyan-50/40 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Home Address
              </p>
              <div className="mt-3 flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
                <p className="text-sm font-medium leading-6 text-slate-600">
                  {dashboard.homeAddress || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border-2 border-sky-700 bg-white p-6 shadow-xl md:p-8">
            <h3 className="font-poppins text-xl font-bold text-sky-950">Recent Uploaded PDFs</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              A quick snapshot of the latest reports already tied to this user account.
            </p>
            <div className="mt-6 space-y-4">
              {dashboard.recentReports.length ? (
                dashboard.recentReports.map((report) => (
                  <div
                    key={report.reportId}
                    className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-sky-950">
                          {report.originalFileName}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {report.storageProvider}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                        {report.processingStatus}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Uploaded on {formatDate(report.uploadedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-blue-200 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-500">
                  No reports uploaded yet for this user account.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MedicalReportAssistant
        open={isReportAssistantOpen}
        onClose={() => setIsReportAssistantOpen(false)}
      />
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200 bg-white text-cyan-700">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-sky-950">{value}</p>
        </div>
      </div>
    </div>
  );
}
