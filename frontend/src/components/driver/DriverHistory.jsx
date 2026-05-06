import { useState, useEffect } from "react";
import { MapPin, CheckCircle2 } from "lucide-react";

export default function DriverHistory() {
  const [pastTrips, setPastTrips] = useState([]);

  const getAuthToken = () => {
      const authDataStr = localStorage.getItem("healthbridge.auth") || sessionStorage.getItem("healthbridge.auth");
      return authDataStr ? JSON.parse(authDataStr).accessToken : "";
  };

  useEffect(() => {
      fetch('http://localhost:8080/api/ambulances/driver/history', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setPastTrips(data); })
      .catch(console.error);
  }, []);

  const formatDate = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-sky-950 mb-6 pl-2">Past Services</h2>
      
      {pastTrips.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-3xl border-sky-700 border-2 shadow-xl text-slate-500 font-medium">
              No completed trips found yet.
          </div>
      ) : (
        <div className="space-y-5">
          {pastTrips.map(trip => (
            <div key={trip.id} className="bg-white rounded-3xl p-6 shadow-xl border-sky-700 border-2 hover:border-blue-800 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[13px] font-bold text-slate-400 mb-1">{formatDate(trip.date)}</div>
                  <div className="font-extrabold text-[16px] text-sky-950">{trip.id}</div>
                </div>
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[12px] font-bold rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {trip.status}
                </span>
              </div>
              
              <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 text-[14px]">
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 ml-1"></div> {trip.from}
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <MapPin className="w-4.5 h-4.5 text-cyan-500" /> {trip.to}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}