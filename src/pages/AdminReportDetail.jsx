import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  User,
  Calendar,
  ShieldAlert,
  Hash,
  AlertCircle,
  CheckCircle,
  Send,
  RefreshCw,
  Clock,
} from "lucide-react";

const AdminReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adminInput, setAdminInput] = useState("");
  const [triggerReport, setTriggerReport] = useState(null);
  const [thread, setThread] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // showLoadingScreen = false agar saat auto-refresh, layar tidak berkedip "Memuat..."
  const fetchDetail = async (showLoadingScreen = true) => {
    if (showLoadingScreen) setIsLoading(true);
    try {
      const token = localStorage.getItem("safetalk_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/reports/${id}`,
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
        setTriggerReport(result.data.room);
        setThread(result.data.thread);
        setIsLocked(Boolean(result.data.is_locked));
      }
    } catch (error) {
      console.error("Gagal mengambil detail:", error);
    } finally {
      if (showLoadingScreen) setIsLoading(false);
    }
  };

  // Tambahan Detail: Polling 3 Detik (Auto-Refresh)
  useEffect(() => {
    fetchDetail(true); // Load pertama pakai loading screen

    // Interval jalan di background tiap 3 detik tanpa loading screen
    const interval = setInterval(() => {
      fetchDetail(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [id, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const handleInputResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150,
      )}px`;
    }
  };

  const handleCloseCase = async () => {
    try {
      const token = localStorage.getItem("safetalk_token");
      const res = await fetch(
        `${API_BASE_URL}/api/admin/reports/${id}/close`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        Swal.fire(
          "Berhasil",
          "Kasus ditutup & Bot AI diaktifkan kembali.",
          "success",
        );
        fetchDetail(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryBadge = (category) => {
    if (category === "NON_KDRT" || category === "SAPAAN") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    if (["K1", "K3", "K5"].includes(category))
      return "bg-rose-100 text-rose-700 border-rose-200";
    if (["K2", "K4"].includes(category))
      return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const formatText = (text) => {
    if (!text) return "";
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    );
  };

  const handleSendAdminReply = async () => {
    if (!adminInput.trim()) return;

    const messageToSend = adminInput;
    setAdminInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const token = localStorage.getItem("safetalk_token");
      const res = await fetch(
        `${API_BASE_URL}/api/admin/reports/${id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: messageToSend,
            reply_to_id: null,
          }),
        },
      );
      if (res.ok) {
        fetchDetail(false); // Ambil update terbaru setelah ngirim pesan
      }
    } catch (err) {
      console.error("Gagal mengirim balasan:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendAdminReply();
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-64 text-indigo-600 font-bold animate-pulse">
        <RefreshCw size={32} className="animate-spin" />
        Memuat Detail Intervensi...
      </div>
    );

  if (!triggerReport)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-700 mb-2">
          Data Tidak Ditemukan
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:underline"
        >
          Kembali
        </button>
      </div>
    );

  return (
    <div className="mx-auto space-y-6 pb-10">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors w-fit bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
        >
          <ArrowLeft size={18} /> Kembali ke Daftar Laporan
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Indikator Auto-Refresh Aktif untuk Admin */}
          <span className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Auto-Refresh Aktif
          </span>

          {isLocked ? (
            <button
              onClick={handleCloseCase}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all w-full sm:w-fit"
            >
              <CheckCircle size={18} /> Selesaikan Intervensi & Aktifkan Bot
            </button>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200">
        {/* CASE TITLE & CATEGORY */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-100">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 break-all">
              <Hash size={24} className="text-slate-400 shrink-0" />
              Ruang Intervensi #{triggerReport.case_id || triggerReport.id}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm">
              <Calendar size={14} />
              {new Date(triggerReport.created_at).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <span
              className={`border text-xs md:text-sm font-bold px-4 py-2 rounded-full inline-flex items-center gap-2 shadow-sm ${getCategoryBadge(
                triggerReport.latest_category,
              )}`}
            >
              <ShieldAlert size={16} /> Kasus:{" "}
              {triggerReport.latest_category || "Umum"}
            </span>
            {isLocked && (
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5 mr-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                Diambil Alih Admin
              </span>
            )}
          </div>
        </div>

        {/* IDENTITAS PENGIRIM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-inner">
              <User size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Identitas Pengirim
              </p>
              {triggerReport.user ? (
                <div className="truncate">
                  <p className="font-bold text-slate-800 truncate">
                    {triggerReport.user.nama_lengkap}
                  </p>
                  <p className="text-xs text-indigo-600 font-medium truncate mt-0.5 flex items-center gap-1">
                    @{triggerReport.user.username || "user"} • Warga Terdaftar
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-800">Anonymous User</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Pengguna tidak login
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 shadow-inner">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Update Terakhir
              </p>
              <p className="font-bold text-slate-800">
                {new Date(triggerReport.updated_at).toLocaleTimeString("id-ID")}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Sistem terus memantau
              </p>
            </div>
          </div>
        </div>

        {/* TRANSKRIP PERCAKAPAN */}
        <div className="space-y-6 bg-slate-50/50 p-4 md:p-6 rounded-3xl border border-slate-100 h-[500px] overflow-y-auto scroll-smooth relative shadow-inner">
          {thread.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic">
              Belum ada percakapan.
            </div>
          )}
          {thread.map((chat, idx) => {
            const isUser = chat.role === "user";
            const isAI = chat.role === "ai";
            const isAdmin = chat.role === "admin";

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  isAdmin ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-black shadow-md text-[10px]
                  ${
                    isUser
                      ? "bg-slate-200 text-slate-600 border border-slate-300"
                      : isAI
                        ? "bg-indigo-600"
                        : "bg-rose-600"
                  }`}
                >
                  {isUser ? (
                    <User size={16} />
                  ) : isAI ? (
                    "AI"
                  ) : (
                    <ShieldAlert size={16} />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`flex flex-col ${
                    isAdmin ? "items-end" : "items-start"
                  } max-w-[85%] min-w-[50px]`}
                >
                  <div
                    className={`p-3 md:p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm border
                    ${
                      isUser
                        ? "bg-white border-slate-200 text-slate-700 rounded-tl-none"
                        : isAI
                          ? "bg-white border-slate-100 text-slate-700 rounded-tl-none"
                          : "bg-rose-50 border-rose-200 text-rose-900 rounded-tr-none"
                    }`}
                  >
                    {isAdmin && (
                      <div className="font-black text-rose-700 text-[10px] mb-2 border-b border-rose-200 pb-1 flex items-center gap-1 uppercase tracking-widest">
                        <ShieldAlert size={12} /> PESAN ANDA (ADMIN)
                      </div>
                    )}

                    {/* Tambahan Detail: Menampilkan Balasan (ReplyTo) */}
                    {chat.replyTo && (
                      <div className="bg-slate-100/60 border border-slate-200/80 rounded-lg p-2.5 mb-3 text-[11px] text-slate-600 italic">
                        <span className="font-bold block text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider">
                          Membalas{" "}
                          {chat.replyTo.role === "user" ? "Warga" : "AI"}:
                        </span>
                        "
                        {chat.replyTo.text.length > 60
                          ? chat.replyTo.text.substring(0, 60) + "..."
                          : chat.replyTo.text}
                        "
                      </div>
                    )}

                    {formatText(chat.text)}

                    {isAI && chat.instruction && (
                      <div className="mt-3 p-3 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                        <p className="text-[10px] font-bold text-orange-900 uppercase mb-1 flex items-center gap-1">
                          <AlertCircle size={12} /> Arahan Darurat AI:
                        </p>
                        <p className="text-xs text-orange-800 font-semibold">
                          {chat.instruction}
                        </p>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1 px-1 italic uppercase">
                    {chat.time}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT BALASAN ADMIN */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500" />
            Kirim Intervensi Admin
          </h3>

          <div className="flex items-end gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-rose-500 focus-within:bg-white transition-all shadow-sm">
            <textarea
              ref={textareaRef}
              value={adminInput}
              onChange={(e) => {
                setAdminInput(e.target.value);
                handleInputResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pesan intervensi... (Shift+Enter baris baru)"
              className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 outline-none text-sm resize-none overflow-y-auto min-h-[44px]"
              rows={1}
            />
            <button
              onClick={handleSendAdminReply}
              className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
              title="Kirim Balasan"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center font-medium">
            Pesan Anda akan tampil sebagai{" "}
            <span className="text-rose-500">intervensi resmi</span> di layar
            pengguna dan menonaktifkan balasan otomatis AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminReportDetail;
