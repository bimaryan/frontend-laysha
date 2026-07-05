import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AdminReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async (page = 1, search = "", month = "") => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("safetalk_token");
      if (!token) {
        navigate("/login");
        return;
      }

      let url = `${API_BASE_URL}/api/admin/reports?page=${page}&search=${search}`;
      if (month) {
        url += `&month=${month}`;
      }

      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        setReports(result.data.data);
        setPagination({
          current_page: result.data.current_page,
          last_page: result.data.last_page,
          total: result.data.total,
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem("safetalk_token");
      let url = `${API_BASE_URL}/api/admin/reports/export?search=${searchQuery}`;
      if (monthFilter) {
        url += `&month=${monthFilter}`;
      }
      
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Laporan-SafeTalk-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        link.remove();
      } else {
        console.error("Gagal mendownload file");
      }
    } catch (error) {
      console.error("Error saat export:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchReports(1, searchQuery, monthFilter);
    }
  };

  useEffect(() => {
    fetchReports(1, searchQuery, monthFilter);
  }, [monthFilter]); // Auto refetch when month changes

  const getCategoryBadge = (category) => {
    if (category === "NON_KDRT" || category === "SAPAAN") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    if (["K1", "K3", "K5"].includes(category)) {
      return "bg-rose-100 text-rose-700 border-rose-200";
    } else if (["K2", "K4"].includes(category)) {
      return "bg-amber-100 text-amber-700 border-amber-200";
    } else {
      return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getCleanMessage = (report) => {
    const lastMsg =
      report.messages && report.messages.length > 0 ? report.messages[0] : null;
    if (!lastMsg || !lastMsg.message) return "...";
    let rawText = lastMsg.message;
    return rawText.includes("|--REPLY--|")
      ? rawText.split("|--REPLY--|")[1]
      : rawText;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Data Laporan Masuk
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Total {pagination.total} laporan ditemukan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download size={18} />
            )}
            {isExporting ? "Memproses..." : "Export Excel"}
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-auto bg-white text-sm transition-all shadow-sm"
            />
            <div className="relative group w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                placeholder="Cari ID / Nama... (Enter)"
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 bg-white text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                <th className="p-4 pl-6">ID Kasus</th>
                <th className="p-4">Pengirim</th>
                <th className="p-4">Pesan Terakhir</th>
                <th className="p-4">Kategori Risiko</th>
                <th className="p-4">Waktu</th>
                <th className="p-4 pr-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Tidak ada hasil ditemukan.
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  // Tambahan Detail: Deteksi kalau kasus darurat untuk highlight row
                  const isDanger = ["K4", "K5"].includes(
                    report.latest_category,
                  );

                  return (
                    <tr
                      key={report.id}
                      className={`transition-colors group ${
                        isDanger
                          ? "hover:bg-rose-50/30"
                          : "hover:bg-indigo-50/50"
                      }`}
                    >
                      <td className="p-4 pl-6 font-mono text-sm text-slate-600">
                        {/* Garis indikator merah jika K4/K5 */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-8 rounded-full ${
                              isDanger ? "bg-rose-500" : "bg-transparent"
                            }`}
                          ></div>
                          #{report.case_id || report.id}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-700">
                            {report.user
                              ? report.user.nama_lengkap
                              : "Anonymous"}
                          </span>
                          {/* Tambahan Detail: Badge Terdaftar/Anonim */}
                          {report.user ? (
                            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 w-fit px-2 py-0.5 rounded mt-1 border border-indigo-100">
                              Terdaftar
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold bg-slate-100 w-fit px-2 py-0.5 rounded mt-1 border border-slate-200">
                              Anonim
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2 max-w-xs">
                          {isDanger && (
                            <AlertTriangle
                              size={14}
                              className="text-rose-500 mt-0.5 shrink-0"
                            />
                          )}
                          <p className="text-sm italic truncate text-slate-500">
                            "{getCleanMessage(report)}"
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`border text-[10px] font-bold px-3 py-1 rounded-full ${getCategoryBadge(
                            report.latest_category,
                          )}`}
                        >
                          {report.latest_category || "Umum"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-medium">
                        {new Date(report.updated_at).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            navigate(`/admin/reports/${report.id}`)
                          }
                          className={`p-2 rounded-xl transition-all shadow-sm ${
                            isDanger
                              ? "bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white"
                              : "bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white"
                          }`}
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && reports.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">
              Halaman {pagination.current_page} dari {pagination.last_page}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  fetchReports(pagination.current_page - 1, searchQuery, monthFilter)
                }
                disabled={pagination.current_page === 1}
                className="p-2 bg-white border rounded-xl disabled:opacity-50 transition-colors hover:bg-slate-50 shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  fetchReports(pagination.current_page + 1, searchQuery, monthFilter)
                }
                disabled={pagination.current_page === pagination.last_page}
                className="p-2 bg-white border rounded-xl disabled:opacity-50 transition-colors hover:bg-slate-50 shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
