import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Clock,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // State untuk menyimpan data dari API
  const [stats, setStats] = useState({
    total_users: 0,
    total_chats: 0,
    category_distribution: {},
    recent_reports: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("safetalk_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        } else {
          console.error("Gagal memuat data dashboard");
        }
      } catch (error) {
        console.error("Error koneksi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  // FUNGSI ANTI-BADAI NaN: Ambil data, kalau undefined/null jadikan 0
  const dist = stats.category_distribution || {};
  const getCount = (key) => Number(dist[key]) || 0;

  const totalKasus = Number(stats.total_chats) || 0;

  // PEMETAAN RISIKO BARU (Sesuai dengan AI Classifier)
  // Darurat/Tinggi: Fisik (K4) & Darurat/Senjata/Nyawa (K5)
  const risikoTinggi = getCount("K4") + getCount("K5");

  // Sedang: Verbal/Emosional (K2) & Intimidasi/Psikologis (K3)
  const risikoSedang = getCount("K2") + getCount("K3");

  // Rendah: Keluhan relasi ringan (K1)
  const risikoRendah = getCount("K1");

  // Umum/Aman: Depresi/Curhat biasa tanpa KDRT (NON_KDRT)
  const nonKdrt = getCount("NON_KDRT");

  // Fungsi utilitas untuk menghitung persentase
  const calculatePercentage = (value, total) => {
    if (!total || total === 0 || isNaN(value)) return "0.0";
    return ((value / total) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-600 font-bold animate-pulse">
        Memuat Data Dashboard...
      </div>
    );
  }

  return (
    <>
      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <MessageSquare size={120} />
          </div>
          <h3 className="text-4xl font-black text-indigo-600 mb-2">
            {totalKasus}
          </h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
            Total Interaksi Chat
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <AlertTriangle size={120} />
          </div>
          <h3 className="text-4xl font-black text-rose-600 mb-2">
            {risikoTinggi}
          </h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
            Indikasi Risiko Tinggi
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Users size={120} />
          </div>
          <h3 className="text-4xl font-black text-emerald-500 mb-2">
            {stats.total_users || 0}
          </h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
            Warga Terdaftar
          </p>
        </div>
      </div>

      {/* Distribution Chart Card */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-gray-50 text-gray-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart2 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold">
            Distribusi Tingkat Risiko Berdasarkan AI
          </h3>
        </div>

        <div className="space-y-6">
          {/* Risiko Darurat / Tinggi (K4, K5) */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">
                Risiko Tinggi / Darurat (K4, K5)
              </span>
              <span className="font-bold text-rose-600">
                {calculatePercentage(risikoTinggi, totalKasus)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${calculatePercentage(risikoTinggi, totalKasus)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              {risikoTinggi} Interaksi
            </p>
          </div>

          {/* Risiko Sedang (K2, K3) */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">
                Risiko Sedang (K2, K3)
              </span>
              <span className="font-bold text-amber-500">
                {calculatePercentage(risikoSedang, totalKasus)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${calculatePercentage(risikoSedang, totalKasus)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              {risikoSedang} Interaksi
            </p>
          </div>

          {/* Risiko Rendah (K1) */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">
                Risiko Rendah / Perhatian (K1)
              </span>
              <span className="font-bold text-blue-500">
                {calculatePercentage(risikoRendah, totalKasus)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${calculatePercentage(risikoRendah, totalKasus)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              {risikoRendah} Interaksi
            </p>
          </div>

          {/* NON KDRT / Konsultasi Umum */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">
                Konsultasi Umum (NON_KDRT)
              </span>
              <span className="font-bold text-emerald-500">
                {calculatePercentage(nonKdrt, totalKasus)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${calculatePercentage(nonKdrt, totalKasus)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              {nonKdrt} Interaksi
            </p>
          </div>
        </div>
      </div>

      {/* Recent Consultations List */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-bold text-gray-800">
            Riwayat Interaksi AI Terbaru
          </h3>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 space-y-4">
          {!stats.recent_reports || stats.recent_reports.length === 0 ? (
            <p className="text-center text-gray-500 italic py-4">
              Belum ada riwayat chat terbaru.
            </p>
          ) : (
            <>
              {/* Tambahan .slice(0, 5) untuk memastikan UI maksimal menampilkan 5 baris */}
              {stats.recent_reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border border-gray-100 p-4 rounded-2xl hover:shadow-md transition-all group"
                >
                  {/* Left Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm font-mono bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                        ID-{report.id}
                      </span>
                      {/* Badge untuk user Terdaftar atau Anonim */}
                      {report.user_id ? (
                        <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          Terdaftar
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          Anonim
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-gray-800 text-lg">
                      {report.user
                        ? report.user.nama_lengkap
                        : "Anonymous User"}
                    </h4>

                    <p className="text-gray-500 text-sm truncate max-w-md italic">
                      "{report.message}"
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(report.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end justify-between mt-4 md:mt-0 space-y-4">
                    <span
                      className={`border text-xs font-bold px-4 py-1.5 rounded-full ${
                        ["K4", "K5"].includes(report.category)
                          ? "bg-rose-50 text-rose-600 border-rose-100" // Merah (Darurat)
                          : ["K2", "K3"].includes(report.category)
                            ? "bg-amber-50 text-amber-600 border-amber-100" // Kuning (Sedang)
                            : report.category === "K1"
                              ? "bg-blue-50 text-blue-600 border-blue-100" // Biru (Rendah)
                              : "bg-emerald-50 text-emerald-600 border-emerald-100" // Hijau (NON_KDRT)
                      }`}
                    >
                      Kategori: {report.category}
                    </span>

                    <button
                      // PERBAIKAN: Menambahkan id report agar masuk ke halaman detail
                      onClick={() => navigate(`/admin/reports/${report.id}`)}
                      className="flex items-center text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-xl group-hover:bg-blue-100"
                    >
                      Lihat Penuh <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}

              {/* TOMBOL LIHAT SEMUA LAPORAN */}
              <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate("/admin/reports")}
                  className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center transition-colors bg-indigo-50 px-6 py-2.5 rounded-xl hover:bg-indigo-100"
                >
                  Lihat Semua Laporan <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
