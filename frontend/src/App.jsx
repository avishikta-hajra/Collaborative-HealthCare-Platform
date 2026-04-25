import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Telemedicine from "./components/Telemedicine";
import AuthPage from "./components/AuthPage";
import PortalSelection from "./components/PortalSelection";
import Hospitals from "./components/Hospitals";
import AmbulanceService from "./components/AmbulanceService";
import GovernmentSchemes from "./components/GovernmentSchemes";
import Listings from "./components/Listings";
import AmbulanceDriverPortal from "./components/AmbulanceDriverPortal";
import CommunityHealth from "./components/CommunityHealth";
import DoctorDashboard from "./components/DoctorDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/telemedicine" element={<Telemedicine />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/PortalSelection" element={<PortalSelection />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/ambulance" element={<AmbulanceService />} />
        <Route path="/schemes" element={< GovernmentSchemes />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/driver-portal" element={<AmbulanceDriverPortal />} />
        <Route path="/community-health" element={<CommunityHealth />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}
