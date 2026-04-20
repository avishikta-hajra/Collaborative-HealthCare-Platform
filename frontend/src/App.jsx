import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Telemedicine from "./components/Telemedicine";
import UserLogin from "./components/UserLogin";
import DoctorLogin from "./components/DoctorLogin";
import AdminLogin from "./components/AdminLogin";
import PortalSelection from "./components/PortalSelection"; // Newly added for portal selection page
import Hospitals from "./components/Hospitals";
import AmbulanceService from "./components/AmbulanceService";
import GovernmentSchemes from "./components/GovernmentSchemes";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/telemedicine" element={<Telemedicine />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/DoctorLogin" element={<DoctorLogin />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        // Newly added route for portal selection page
        <Route path="/PortalSelection" element={<PortalSelection />} />
        <Route path="/hospitals" element={<Hospitals/>}/>
        <Route path="/ambulance" element={<AmbulanceService />} />
        <Route path="/schemes" element={< GovernmentSchemes/>} />
      </Routes>
    </Router>
  );
}