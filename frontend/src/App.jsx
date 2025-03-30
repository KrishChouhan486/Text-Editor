import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; // ✅ Login as the main home page
import Signup from "./components/Signup";
import TextEditor from "./components/TextEditor";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Set Login as the default home page */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/editor" element={<TextEditor />} />
        {/* ✅ Add a fallback 404 route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
