import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Telemedicine from "./components/Telemedicine";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/telemedicine" element={<Telemedicine />} />
      </Routes>
    </Router>
  );
}