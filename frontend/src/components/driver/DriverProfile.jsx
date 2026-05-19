import { useState, useEffect } from "react";
import { User, Truck, Shield, Star, Phone, Mail } from "lucide-react";
import { buildAbsoluteUrl } from "../../services/runtimeConfig";

export default function DriverProfile() {
  const [profile, setProfile] = useState(null);

  const getAuthToken = () => {
      const authDataStr = localStorage.getItem("healthbridge.auth") || sessionStorage.getItem("healthbridge.auth");
      return authDataStr ? JSON.parse(authDataStr).accessToken : "";
  };

  useEffect(() => {
      fetch(buildAbsoluteUrl('/api/ambulances/driver/me'), {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setProfile(data); })
      .catch(console.error);
  }, []);

  if (!profile) return <div className="p-10 text-center text-slate-500 font-bold">Loading Profile...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-sky-950 mb-6 pl-2">My Profile</h2>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-sky-700 border-2 transition-all duration-300">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-cyan-50 border-2 border-cyan-200 rounded-full flex items-center justify-center text-cyan-600 shrink-0">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold text-sky-950">{profile.name}</h2>
            <div className="flex items-center gap-3 text-[14px] text-slate-600 mt-1">
              <span className="flex items-center gap-1.5 font-bold"><Star className="w-4 h-4 text-amber-500 fill-amber-500"/> {profile.rating}</span>
              <span className="text-slate-300">•</span>
              <span className="font-bold">{profile.completedTrips} Trips Completed</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-5 border-t border-slate-100">
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-slate-500 font-semibold">License Number</span>
            <span className="font-bold text-sky-950 bg-cyan-50 px-3 py-1 rounded-lg">{profile.license}</span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-slate-500 font-semibold">Contact Phone</span>
            <span className="font-bold text-sky-950">{profile.phone}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-sky-700 border-2 transition-all duration-300">
        <h3 className="flex items-center gap-2 font-bold text-sky-950 text-[18px] mb-5">
            <Truck className="w-6 h-6 text-cyan-600" /> Assigned Vehicle
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100">
            <div className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-1">Registration</div>
            <div className="font-extrabold text-[16px] text-sky-950">{profile.vehicleNumber}</div>
          </div>
          <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100">
            <div className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-1">Type</div>
            <div className="font-extrabold text-[16px] text-sky-950">{profile.vehicleType}</div>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-blue-950 to-blue-900 rounded-3xl p-6 shadow-xl text-white">
        <h3 className="flex items-center gap-2 font-bold text-[18px] mb-5 text-cyan-200">
          <Shield className="w-6 h-6" /> Service Provider
        </h3>
        <div className="mb-6">
          <div className="text-[20px] font-extrabold mb-1">{profile.provider}</div>
          <div className="text-[14px] text-cyan-300 font-medium">Verified Fleet Partner</div>
        </div>
        <div className="space-y-3 text-[14px] text-cyan-50 font-medium bg-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-cyan-300"/> Fleet Support: 1800-111-222</div>
          <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-cyan-300"/> Status: Active Account</div>
        </div>
      </div>
    </div>
  );
}
