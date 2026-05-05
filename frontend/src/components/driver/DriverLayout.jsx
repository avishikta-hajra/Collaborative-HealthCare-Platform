import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, Clock, User, Bell, Activity, LogOut } from "lucide-react";

export default function DriverLayout() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [driverInfo, setDriverInfo] = useState({ name: "Loading...", vehicleNumber: "..." });

  const getAuthToken = () => {
      const authDataStr = localStorage.getItem("healthbridge.auth") || sessionStorage.getItem("healthbridge.auth");
      return authDataStr ? JSON.parse(authDataStr).accessToken : "";
  };

  useEffect(() => {
      fetch('http://localhost:8080/api/ambulances/driver/me', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
          if (data) setDriverInfo(data);
      })
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("healthbridge.auth");
    sessionStorage.removeItem("healthbridge.auth");
    navigate('/login?portal=driver');
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/driver-portal" },
    { icon: Clock, label: "History", path: "/driver-portal/history" },
    { icon: User, label: "Profile", path: "/driver-portal/profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <header className="bg-blue-950 text-white px-5 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-400" />
          <div>
            <div className="text-[13px] font-medium text-blue-300">Vehicle: {driverInfo.vehicleNumber}</div>
            <div className="text-[15px] font-bold tracking-wide">Ambulance Fleet</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative text-blue-200 hover:text-white transition-colors cursor-pointer">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-950"></span>
          </button>

          <div className="relative">
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-800 border-2 border-blue-600 flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer"
            >
                <User className="w-5 h-5 text-white" />
            </button>
            
            {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-100 mb-1 bg-slate-50/50">
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Signed in as</p>
                          <p className="text-[14px] font-bold text-blue-950">{driverInfo.name}</p>
                      </div>
                      <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-[14px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                          <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                  </div>
                </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet /> 
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] flex justify-around items-center p-2 z-40">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/driver-portal"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 w-20 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? "text-blue-700 bg-blue-50 font-extrabold" 
                  : "text-slate-400 hover:text-blue-600 font-semibold"
              }`
            }
          >
            {/* --- FIX IS HERE: Passing isActive to the children via a function --- */}
            {({ isActive }) => (
                <>
                    <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    <span className="text-[11px]">{item.label}</span>
                </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}