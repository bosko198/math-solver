import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PolynomialPage from "./pages/PolynomialPage";
import IntegralPage from "./pages/IntegralPage";
import LimitsPage from "./pages/LimitsPage";
import DerivativesPage from "./pages/DerivativesPage";
import DifferentialEquationsPage from "./pages/DifferentialEquationsPage";

// (we’ll add Limits, Derivatives, Differential later)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/polynomial" element={<PolynomialPage />} />
        <Route path="/limits" element={<LimitsPage />} />
        <Route path="/integrals" element={<IntegralPage />} />
        <Route path="/derivatives" element={<DerivativesPage />} />
        <Route path="/differential" element={<DifferentialEquationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;