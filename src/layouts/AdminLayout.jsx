import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Calendar,
  Settings, // Tambahkan icon Settings
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    nama: "Administrator",
    role: "admin",
  });

  // State untuk dropdown menu (Mirip seperti sidebar user)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("safetalk_token");
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/user", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdminData({ nama: data.nama_lengkap, role: data.role });
        }
      } catch (error) {
        console.error("Gagal load profil:", error);
      }
    };
    fetchAdminData();
  }, []);

  // Menutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Keluar dari Panel Admin?",
      text: "Sesi Anda akan diakhiri secara aman.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("safetalk_token");
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
          console.error("Gagal koneksi ke API Logout:", error);
        }

        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("safetalk_token");

        Swal.fire({
          title: "Berhasil Keluar!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/login");
      }
    });
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const adminMenus = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
    {
      name: "Data Laporan",
      path: "/admin/reports",
      icon: FileText,
      exact: false,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Tema Dark Slate & Indigo) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER LOGO */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/50">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  SafeTalk
                </h1>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  Admin Panel
                </p>
              </div>
            </div>
            <button
              className="md:hidden text-slate-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MENU NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.exact}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`
              }
            >
              <menu.icon size={18} />
              <span>{menu.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER SIDEBAR (User Profile Dropdown) */}
        <div
          className="p-4 border-t border-slate-800 mt-auto relative"
          ref={dropdownRef}
        >
          {isDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button
                onClick={() => {
                  navigate("/admin/profil");
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <User size={18} className="text-indigo-400" />
                <span>Pengaturan Profil</span>
              </button>
              <div className="h-px bg-slate-700/50 w-full"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span>Keluar Panel</span>
              </button>
            </div>
          )}

          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`bg-slate-800/40 rounded-xl p-3 flex items-center justify-between border cursor-pointer transition-all ${
              isDropdownOpen
                ? "border-slate-600 bg-slate-800"
                : "border-slate-700/50 hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden text-left">
              <div className="bg-indigo-500/20 text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <User size={14} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                  {adminData.role}
                </p>
                <p className="text-sm text-slate-200 font-semibold truncate capitalize">
                  {adminData.nama}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* NAVBAR ATAS */}
        <header className="flex items-center justify-between bg-white border-b border-slate-200 px-6 md:px-8 py-4 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <Menu size={24} />
            </button>

            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-none">
                ADMIN PANEL
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                <Calendar size={12} />
                <p className="text-[11px] md:text-xs font-medium uppercase tracking-wider">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* AREA KONTEN */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
