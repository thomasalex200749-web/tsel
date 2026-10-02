import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BuilderDashboard from "./pages/BuilderDashboard";
import SiteDetail from "./pages/SiteDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/builder" element={<BuilderDashboard />} />
        <Route path="/site/:siteId" element={<SiteDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
