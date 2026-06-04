import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  AtSign,
  Mail,
  Lock,
  Save,
  Info,
  ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";

const AdminProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [userData, setUserData] = useState({
    nama_lengkap: "",
    username: "",
    email: "",
    tanggal_lahir: "",
    password: "",
    role: "",
    created_at: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("safetalk_token");
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/user", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.status === "success") {
          setUserData({
            ...data,
            nama_lengkap: data.nama_lengkap || "",
            email: data.email || "",
            tanggal_lahir: data.tanggal_lahir || "",
            password: "",
          });
        }
      } catch (error) {
        console.error("Gagal memuat profil admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("safetalk_token");

    const payload = {
      nama_lengkap: userData.nama_lengkap,
      email: userData.email,
      tanggal_lahir: userData.tanggal_lahir,
    };

    if (userData.password.trim() !== "") {
      payload.password = userData.password;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/user", {
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
          text: "Profil Admin berhasil diperbarui.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setUserData({
          ...userData,
          nama_lengkap: data.data.nama_lengkap,
          email: data.data.email,
          tanggal_lahir: data.data.tanggal_lahir,
          password: "",
        });
      } else {
        let errorMsg = data.message || "Gagal memperbarui profil.";
        if (data.errors) {
          errorMsg = Object.values(data.errors).flat().join(", ");
        }
        Swal.fire("Gagal", errorMsg, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6">
        <div className="w-24 h-24 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
          <ShieldCheck size={40} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {userData.nama_lengkap}
          </h1>
          <p className="text-slate-500 font-medium">@{userData.username}</p>
          <div className="flex items-center gap-2 mt-3 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="font-semibold text-slate-600 uppercase tracking-wider">
              {userData.role}
            </span>
          </div>
        </div>
        <div className="ml-auto text-right hidden md:block border-l pl-6 border-slate-100">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
            Terdaftar Pada
          </p>
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar size={14} className="text-indigo-500" />
            {formatTanggal(userData.created_at)}
          </p>
        </div>
      </div>

      {/* FORM PENGATURAN */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
          Edit Informasi Admin
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={userData.nama_lengkap}
                  onChange={(e) =>
                    setUserData({ ...userData, nama_lengkap: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username (ID Admin)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AtSign size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={userData.username}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm bg-slate-50 cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tanggal Lahir
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-slate-400" />
                </div>
                <input
                  type="date"
                  value={userData.tanggal_lahir}
                  onChange={(e) =>
                    setUserData({ ...userData, tanggal_lahir: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ganti Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-xl flex items-start gap-3 mt-4 border border-indigo-100/50">
            <Info size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Sebagai Admin, pastikan email Anda aktif untuk menerima notifikasi
              sistem. Jaga kerahasiaan kata sandi Anda.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Menyimpan Data..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
