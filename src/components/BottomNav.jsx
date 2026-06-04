import React from "react";
import { NavLink } from "react-router-dom";
import { MessageSquare, Phone, User, LogIn } from "lucide-react";

const BottomNav = () => {
  const baseClass =
    "flex flex-col items-center justify-center gap-1 px-10 py-2 rounded-2xl transition-all duration-300";

  // Cek apakah user sudah login (misalnya dengan mengecek token)
  const isAuthenticated = !!localStorage.getItem("safetalk_token");

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-3 flex justify-between items-center z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.02)] rounded-t-3xl">
      <NavLink
        to="/chat" // Asumsi halaman utama user adalah /chat
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

      {/* Dinamis: Tampilkan Profil jika login, Login jika belum */}
      {isAuthenticated ? (
        <NavLink
          to="/profil"
          className={({ isActive }) =>
            `${baseClass} ${
              isActive
                ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100"
                : "text-slate-400 hover:text-blue-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-bold">Profil</span>
            </>
          )}
        </NavLink>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${baseClass} ${
              isActive
                ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                : "text-slate-400 hover:text-emerald-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LogIn size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-bold">Login</span>
            </>
          )}
        </NavLink>
      )}
    </div>
  );
};

export default BottomNav;