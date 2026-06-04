import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts & Pages
import DashboardLayout from "./layouts/DashboardLayout";
import EmergencyLayout from "./layouts/EmergencyLayout";
import AdminLayout from "./layouts/AdminLayout";
import Chat from "./pages/Chat";
import Emergency from "./pages/Emergency";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReportDetail from "./pages/AdminReportDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminReports from "./pages/AdminReports";
import Panduan from "./pages/Panduan";
import Profil from "./pages/Profil";
import AdminProfile from "./pages/AdminProfile";

// --- LOGIKA GUARD UNTUK HALAMAN CHAT KLIEN ---
const ChatGuard = () => {
  const role = localStorage.getItem("userRole");

  // Izinkan masuk JIKA role adalah "warga" (sudah login) ATAU null/tidak ada (anonim)
  // Tolak JIKA role adalah "admin" (Admin punya dashboard sendiri)
  if (role === "warga" || !role) {
    return <DashboardLayout />;
  } else if (role === "admin") {
    // Tendang admin ke dashboardnya sendiri
    return <Navigate to="/admin" replace />;
  } else {
    // Jaga-jaga jika ada string aneh
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- BAGIAN CHAT DIBUNGKUS DENGAN CHATGUARD --- */}
        <Route element={<ChatGuard />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/profil" element={<Profil />} />
        </Route>

        {/* Emergency Route (Bisa diakses siapa saja, no guard needed) */}
        <Route element={<EmergencyLayout />}>
          <Route path="/emergency" element={<Emergency />} />
        </Route>

        {/* --- GUARD KHUSUS ADMIN --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
            <Route path="/admin/profil" element={<AdminProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
