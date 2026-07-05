import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
  User,
  Calendar,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Save,
  Info,
  AtSign,
  Mail,
  Lock,
} from "lucide-react";
import Swal from "sweetalert2";

const Profil = () => {
  const navigate = useNavigate();

  const [view, setView] = useState("main");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State form ditambahkan email, tanggal_lahir, dan password
  const [userData, setUserData] = useState({
    nama_lengkap: "",
    username: "",
    email: "",
    tanggal_lahir: "",
    password: "", // Password kosong by default
    role: "",
    created_at: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("safetalk_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          setUserData({
            nama_lengkap: data.nama_lengkap || "",
            username: data.username || "",
            email: data.email || "",
            tanggal_lahir: data.tanggal_lahir || "",
            password: "", // Set selalu kosong saat awal load
            role: data.role || "",
            created_at: data.created_at || "",
          });
        } else {
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        Swal.fire("Error", "Gagal terhubung ke server", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const formatTanggal = (dateString) => {
    if (!dateString) return "Memuat...";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
          console.error("Gagal hit API Logout:", error);
        } finally {
          localStorage.clear();
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

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("safetalk_token");

    // Siapkan data yang akan dikirim
    const payload = {
      nama_lengkap: userData.nama_lengkap,
      email: userData.email,
      tanggal_lahir: userData.tanggal_lahir,
    };

    // Hanya sertakan password jika user mengetik sesuatu
    if (userData.password.trim() !== "") {
      payload.password = userData.password;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        Swal.fire({
          title: "Berhasil!",
          text: "Profil Anda berhasil diperbarui.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update state tanpa mereset password field
        setUserData({
          ...userData,
          nama_lengkap: data.data.nama_lengkap,
          email: data.data.email,
          tanggal_lahir: data.data.tanggal_lahir,
          password: "", // Kosongkan kembali form password setelah sukses
        });
      } else {
        // Handle error validasi Laravel
        let errorMsg = data.message || "Gagal memperbarui profil.";
        if (data.errors) {
          errorMsg = Object.values(data.errors).flat().join(", ");
        }
        Swal.fire("Gagal", errorMsg, "error");
      }
    } catch (error) {
      console.error("Gagal update profil:", error);
      Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center w-full">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TAMPILAN KHUSUS MOBILE (HP)                            */}
      {/* ========================================================= */}
      <div className="block md:hidden">
        {view === "settings" ? (
          <div className="min-h-screen bg-white pb-24 font-sans">
            <div className="px-6 pt-8 pb-4">
              <button
                onClick={() => setView("main")}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
              >
                <ChevronLeft size={20} className="mr-1" />
                <span className="font-medium text-sm">Kembali</span>
              </button>
              <h1 className="text-2xl font-bold text-slate-800">
                Pengaturan Akun
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Kelola informasi pribadi Anda
              </p>
            </div>

            <div className="px-6 mt-4 space-y-6">
              {/* NAMA LENGKAP */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={userData.nama_lengkap}
                    onChange={(e) =>
                      setUserData({ ...userData, nama_lengkap: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                  />
                </div>
              </div>

              {/* USERNAME (READONLY) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={userData.username}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                  />
                </div>
              </div>

              {/* TANGGAL LAHIR */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="date"
                    value={userData.tanggal_lahir}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        tanggal_lahir: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                  />
                </div>
              </div>

              {/* KATA SANDI BARU */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Kosongkan jika tidak diubah"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 mt-8">
                <Info
                  size={20}
                  className="text-blue-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Informasi ini digunakan untuk personalisasi layanan dan tidak
                  dibagikan kepada pihak ketiga.
                </p>
              </div>
            </div>

            <div className="fixed bottom-20 left-0 right-0 px-6 pb-2 bg-white/90 backdrop-blur-sm">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={20} />
                )}
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-slate-50 pb-24 relative">
            <div className="bg-[#3b82f6] pt-12 pb-24 px-6 rounded-b-[2rem]">
              <h1 className="text-2xl font-bold text-white">Profil Saya</h1>
              <p className="text-blue-100 text-sm mt-1">Kendalikan Akun Anda</p>
            </div>

            <div className="px-6 -mt-16">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                    <User size={28} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 capitalize">
                      {userData.nama_lengkap}
                    </h2>
                    <p className="text-sm text-slate-500">
                      @{userData.username}
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <span>
                    Bergabung sejak: {formatTanggal(userData.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 mt-6">
              <h3 className="text-slate-800 font-bold mb-3">
                Statistik Konsultasi
              </h3>
              <div className="flex gap-4">
                <div className="bg-white flex-1 p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-3">
                    <MessageSquare size={20} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">12</h4>
                  <p className="text-xs text-slate-500">Total Konsultasi</p>
                </div>
                <div className="bg-white flex-1 p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-3">
                    <Shield size={20} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">3</h4>
                  <p className="text-xs text-slate-500">Bulan Ini</p>
                </div>
              </div>
            </div>

            <div className="px-6 mt-8 space-y-3">
              <h3 className="text-slate-800 font-bold mb-3">Pengaturan</h3>
              <button
                onClick={() => setView("settings")}
                className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
                    <Settings size={20} />
                  </div>
                  <span className="font-semibold text-slate-700">
                    Pengaturan Akun
                  </span>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-rose-50 p-4 rounded-2xl flex items-center justify-between border border-rose-100 hover:bg-rose-100 transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white text-rose-500 rounded-full flex items-center justify-center">
                    {isLoggingOut ? (
                      <div className="w-5 h-5 border-2 border-slate-200 border-t-rose-500 rounded-full animate-spin"></div>
                    ) : (
                      <LogOut size={20} />
                    )}
                  </div>
                  <span className="font-semibold text-rose-600">
                    {isLoggingOut ? "Keluar..." : "Keluar"}
                  </span>
                </div>
                <ChevronRight size={20} className="text-rose-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. TAMPILAN KHUSUS DESKTOP (DASHBOARD LAYOUT)             */}
      {/* ========================================================= */}
      <div className="hidden md:block min-h-screen bg-slate-50 p-6 xl:p-8 w-full">
        <div className="mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Profil & Pengaturan
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola informasi pribadi dan pantau aktivitas akun Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KIRI: INFO PROFIL */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3">
                  <User size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 capitalize">
                  {userData.nama_lengkap}
                </h2>
                <p className="text-slate-500 font-medium mt-1 text-sm">
                  @{userData.username}
                </p>
                <div className="w-full h-px bg-slate-100 my-5"></div>
                <div className="flex items-center gap-2 text-slate-500 text-xs bg-slate-50 px-3 py-1.5 rounded-lg">
                  <Calendar size={14} className="text-slate-400" />
                  <span>Bergabung: {formatTanggal(userData.created_at)}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 font-bold mb-4 text-base">
                  Statistik Konsultasi
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white text-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                        <MessageSquare size={16} />
                      </div>
                      <span className="text-sm font-semibold text-blue-900">
                        Total
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white text-green-500 rounded-lg flex items-center justify-center shadow-sm">
                        <Shield size={16} />
                      </div>
                      <span className="text-sm font-semibold text-green-900">
                        Bulan Ini
                      </span>
                    </div>
                    <span className="text-xl font-bold text-green-600">3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KANAN: FORM PENGATURAN */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <Settings className="text-slate-400" size={20} />
                  Pengaturan Akun
                </h3>

                <div className="space-y-5">
                  {/* GRID UNTUK NAMA & USERNAME */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User size={18} className="text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={userData.nama_lengkap}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              nama_lengkap: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <AtSign size={18} className="text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={userData.username}
                          readOnly
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm bg-slate-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GRID UNTUK EMAIL & TANGGAL LAHIR */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail size={18} className="text-slate-400" />
                        </div>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Tanggal Lahir
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-slate-400" />
                        </div>
                        <input
                          type="date"
                          value={userData.tanggal_lahir}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              tanggal_lahir: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="Kosongkan jika tidak ingin diubah"
                        value={userData.password}
                        onChange={(e) =>
                          setUserData({ ...userData, password: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 mt-6 border border-blue-100">
                    <Info
                      size={20}
                      className="text-blue-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pastikan email Anda aktif. Apabila Anda tidak ingin
                      mengubah password, biarkan field kata sandi kosong.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={18} />
                      )}
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profil;
