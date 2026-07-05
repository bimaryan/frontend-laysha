import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import {
  MessageSquare,
  ShieldCheck,
  TriangleAlert,
  BookOpen,
  Lock,
  User,
  LogOut,
  LogIn,
  ChevronUp,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // State untuk mengontrol dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cek status login instan dari token (biar UI lgsg berubah)
  const isLoggedIn = !!localStorage.getItem("safetalk_token");

  // Menutup dropdown jika user klik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("safetalk_token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.nama_lengkap);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    if (isLoggingOut) return;

    Swal.fire({
      title: "Keluar Akun?",
      text: "Sesi Anda akan diakhiri dan data sementara akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      shape: "rounded",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoggingOut(true);
        const token = localStorage.getItem("safetalk_token");

        try {
          if (token) {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          }
        } catch (error) {
          console.error("Gagal koneksi ke API Logout:", error);
        } finally {
          // Hapus semua data sesi di local storage
          localStorage.removeItem("safetalk_token");
          localStorage.removeItem("safetalk_session");
          sessionStorage.removeItem("safetalk_session");
          localStorage.removeItem("safetalk_role");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userRole");

          setUserName(null);
          setIsLoggingOut(false);

          Swal.fire({
            title: "Berhasil Keluar!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            navigate("/login");
            window.location.reload();
          });
        }
      }
    });
  };

  const menuItems = [
    { icon: MessageSquare, label: "AI Chat", path: "/chat" },
    { icon: BookOpen, label: "Panduan", path: "/panduan" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50 font-sans">
      {/* HEADER LOGO */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/50">
            <ShieldCheck size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white">
              SafeTalk
            </span>
          </div>
        </div>
      </div>

      {/* MENU NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* EMERGENCY SECTION */}
        <div className="pt-6 mt-6 border-t border-slate-800">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
            Zona Bahaya
          </p>
          <NavLink
            to="/emergency"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm ${
                isActive
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20 ring-2 ring-rose-500/50"
                  : "bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white"
              }`
            }
          >
            <TriangleAlert size={18} />
            <span>Tombol SOS</span>
          </NavLink>
        </div>
      </nav>

      {/* FOOTER USER STATUS (DROPDOWN) */}
      <div
        className="p-4 border-t border-slate-800 mt-auto relative"
        ref={dropdownRef}
      >
        {/* Konten Dropdown (Muncul di atas tombol jika terbuka) */}
        {isDropdownOpen && isLoggedIn && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => {
                navigate("/profil");
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <User size={18} className="text-indigo-400" />
              <span>Profil Saya</span>
            </button>
            <div className="h-px bg-slate-700/50 w-full"></div>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-slate-500 border-t-rose-400 rounded-full animate-spin ml-0.5"></div>
              ) : (
                <LogOut size={18} />
              )}
              <span>{isLoggingOut ? "Keluar..." : "Keluar Akun"}</span>
            </button>
          </div>
        )}

        <div
          onClick={async () => {
            if (isLoggedIn) {
              setIsDropdownOpen(!isDropdownOpen);
            } else {
              // User menganggap ini tombol "Keluar", jadi kita hapus riwayat chat anonim
              Swal.fire({
                title: "Akhiri Sesi Anonim?",
                text: "Riwayat percakapan Anda akan dihapus permanen.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#4f46e5",
                cancelButtonColor: "#e11d48",
                confirmButtonText: "Ya, Keluar & Hapus",
                cancelButtonText: "Batal",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const sessionId = sessionStorage.getItem("safetalk_session");
                  if (sessionId) {
                    try {
                      await fetch(`${API_BASE_URL}/api/chat/history`, {
                        method: "DELETE",
                        headers: {
                          "X-Session-ID": sessionId,
                          Accept: "application/json",
                        },
                      });
                    } catch (e) {
                      console.error("Gagal hapus session", e);
                    }
                  }
                  sessionStorage.removeItem("safetalk_session");
                  navigate("/login");
                  window.location.reload(); // Paksa reload agar state chat kereset
                }
              });
            }
          }}
          className={`bg-slate-800/40 rounded-xl p-3 flex items-center justify-between border transition-all cursor-pointer ${
            isDropdownOpen
              ? "border-slate-600 bg-slate-800"
              : "border-slate-700/50 hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Ikon berubah tergantung status login */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isLoggedIn
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "bg-slate-700 text-emerald-400"
              }`}
            >
              {isLoggedIn ? <User size={14} /> : <Lock size={14} />}
            </div>

            {/* Teks berubah tergantung status login */}
            <div className="flex flex-col overflow-hidden">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                {isLoggedIn ? "Warga" : "Status Sesi"}
              </span>
              <span className="text-sm text-slate-200 font-semibold tracking-wide truncate">
                {userName
                  ? userName
                  : isLoggedIn
                    ? "Memuat..."
                    : "Anonim (Terlindungi)"}
              </span>
            </div>
          </div>

          {/* Ikon Aksi (Chevron / Login) */}
          <div className="text-slate-400">
            {isLoggedIn ? (
              <ChevronUp
                size={18}
                className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-white" : ""}`}
              />
            ) : (
              <div
                className="p-1.5 bg-slate-700/50 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg transition-all"
                title="Keluar Sesi"
              >
                <LogOut size={16} />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
