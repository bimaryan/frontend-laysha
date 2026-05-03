import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MessageSquare, Phone, LogOut } from "lucide-react";
import Swal from "sweetalert2";

const BottomNav = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const baseClass =
    "flex flex-col items-center justify-center gap-1 px-10 py-2 rounded-2xl transition-all duration-300";

  const handleLogout = (e) => {
    e.preventDefault();

    if (isLoggingOut) return;

    Swal.fire({
      title: "Akhiri Sesi?",
      text: "Sesi Anda akan diakhiri dan data sementara akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Ya, Akhiri",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoggingOut(true);
        const token = localStorage.getItem("safetalk_token");

        try {
          // 1. Panggil API Logout di Laravel HANYA JIKA PUNYA TOKEN
          if (token) {
            await fetch("http://127.0.0.1:8000/api/auth/logout", {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          }
        } catch (error) {
          console.error("Gagal hit API Logout:", error);
        } finally {
          // 2. Hapus SEMUA data di penyimpanan lokal (token maupun session anonim)
          localStorage.removeItem("safetalk_token");
          localStorage.removeItem("safetalk_role");
          localStorage.removeItem("safetalk_session");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userRole");

          Swal.fire("Berhasil", "Sesi Anda telah diakhiri.", "success").then(
            () => {
              setIsLoggingOut(false);
              navigate("/login");
              window.location.reload();
            },
          );
        }
      }
    });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-3 flex justify-between items-center z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.02)] rounded-t-3xl">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseClass} ${
            isActive
              ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
              : "text-slate-400 hover:text-slate-600"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <MessageSquare size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[11px] font-bold">Chat</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/emergency"
        className={({ isActive }) =>
          `${baseClass} ${
            isActive
              ? "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
              : "text-slate-400 hover:text-rose-500"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Phone size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[11px] font-bold">Darurat</span>
          </>
        )}
      </NavLink>

      {/* Tombol Keluar / Akhiri Sesi (Selalu Muncul) */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`${baseClass} text-slate-400 hover:text-rose-500 disabled:opacity-50`}
      >
        {isLoggingOut ? (
          <div className="w-6 h-6 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin"></div>
        ) : (
          <LogOut size={24} strokeWidth={2} />
        )}
        <span className="text-[11px] font-bold">
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </span>
      </button>
    </div>
  );
};

export default BottomNav;
