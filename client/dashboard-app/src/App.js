import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./pages/LandingPage";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/ask";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ask" element={<Chatbot />} />
        
      </Routes>
    </Router>
  );
};

export default App;
