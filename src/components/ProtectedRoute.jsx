import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ roleRequired }) => {
  // Cek status login dari localStorage
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole"); // 'user' atau 'admin'

  // Jika belum login, tendang ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika halaman butuh role khusus (misal admin), dan role user tidak sesuai
  if (roleRequired && userRole !== roleRequired) {
    // Kembalikan ke dashboard masing-masing
    return <Navigate to={userRole === "admin" ? "/admin" : "/chat"} replace />;
  }

  // Jika lolos semua pengecekan, tampilkan halamannya
  return <Outlet />;
};

export default ProtectedRoute;
