import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
  Send,
  AlertCircle,
  ShieldCheck,
  User,
  ShieldAlert,
} from "lucide-react";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Halo! Saya **SafeTalk**. Ada yang bisa saya bantu?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      instruction: null,
      replyTo: null,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ==========================================
  // FETCH CHAT HISTORY DARI LARAVEL
  // ==========================================
  const fetchHistory = async () => {
    let token = localStorage.getItem("safetalk_token");
    let sessionId = localStorage.getItem("safetalk_session");
    let headers = { Accept: "application/json" };

    if (token) headers["Authorization"] = `Bearer ${token}`;
    else if (sessionId) headers["X-Session-ID"] = sessionId;
    else return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/history`, {
        headers,
      });
      const data = await res.json();

      if (data.status === "success") {
        setIsLocked(data.is_locked || false);

        if (data.data.length > 0) {
          // Gabungin pesan pembuka sama riwayat chat dari server
          setMessages([
            {
              role: "ai",
              text: "Halo! Saya **SafeTalk**. Ada yang bisa saya bantu?",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            ...data.data,
          ]);
        }
      }
    } catch (err) {
      console.error("Gagal load history:", err);
    }
  };

  // Polling tiap 3 detik buat ngecek kalau ada balasan dari Admin
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize tinggi textarea
  const handleInputResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150,
      )}px`;
    }
  };

  // ==========================================
  // HANDLE KIRIM PESAN KE LARAVEL
  // ==========================================
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Munculin pesan user di layar seketika (Optimistic UI)
    setMessages((prev) => [
      ...prev,
      { role: "user", text: text, time: currentTime },
    ]);

    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    let token = localStorage.getItem("safetalk_token");
    let sessionId = localStorage.getItem("safetalk_session");
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Mencegah error pengiriman null string jika session belum ada
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (sessionId) {
      headers["X-Session-ID"] = sessionId;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: text,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.session_id && !token) {
          localStorage.setItem("safetalk_session", result.session_id);
        }
        setIsLocked(result.is_locked || false);
        // Panggil history lagi buat narik balasan AI/Admin
        fetchHistory();
      } else {
        console.error("Server error:", result);
      }
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- PERBAIKAN DI SINI ---
  // Format teks tebal & Baris Baru (Enter)
  const formatText = (text) => {
    if (!text) return "";

    // Pisahkan teks berdasarkan karakter enter (\n)
    return text.split("\n").map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {/* Di dalam setiap baris, cek apakah ada teks tebal (**) */}
        {line.split(/(\*\*.*?\*\*)/g).map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="font-bold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          ),
        )}
        {/* Tambahkan tag <br> di akhir setiap baris */}
        <br />
      </React.Fragment>
    ));
  };
  // -------------------------

  return (
    <div className="fixed inset-0 bottom-[80px] md:bottom-0 md:left-64 flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden z-10">
      {/* HEADER */}
      <header className="flex-none w-full px-4 md:px-6 py-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">SafeTalk</h2>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isLocked ? "bg-rose-500" : "bg-emerald-500"
                }`}
              ></span>
              <p
                className={`text-[9px] font-bold uppercase tracking-widest ${
                  isLocked ? "text-rose-500" : "text-slate-500"
                }`}
              >
                {isLocked ? "Terhubung dengan Admin" : "Sistem Aktif"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        {messages.map((msg, index) => {
          const isFromAdmin = msg.role === "admin";
          const isFromAI = msg.role === "ai";
          const isAlignedRight = msg.role === "user";

          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                isAlignedRight ? "flex-row-reverse" : ""
              }`}
            >
              {/* AVATAR */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isFromAdmin
                    ? "bg-rose-600 text-white shadow-md"
                    : isFromAI
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 border"
                }`}
              >
                {isFromAdmin ? (
                  <ShieldAlert size={16} />
                ) : isFromAI ? (
                  "AI"
                ) : (
                  <User size={16} className="text-slate-400" />
                )}
              </div>

              {/* BUBBLE CHAT */}
              <div
                className={`flex flex-col ${
                  isAlignedRight ? "items-end" : "items-start"
                } max-w-[85%]`}
              >
                {/* --- PERBAIKAN CLASS CSS DI SINI (tambah whitespace-pre-wrap & leading-relaxed) --- */}
                <div
                  className={`p-4 rounded-2xl shadow-sm text-sm border hover:opacity-90 transition-opacity whitespace-pre-wrap leading-relaxed ${
                    isFromAdmin
                      ? "bg-rose-50 border-rose-200 text-rose-900 rounded-tl-none"
                      : isFromAI
                        ? "bg-white border-slate-100 text-slate-700 rounded-tl-none"
                        : "bg-indigo-600 border-indigo-600 text-white rounded-tr-none"
                  }`}
                >
                  {/* Label pesan admin */}
                  {isFromAdmin && (
                    <div className="font-black text-rose-700 text-[10px] mb-2 border-b border-rose-200 pb-1 flex items-center gap-1 uppercase tracking-widest">
                      <ShieldAlert size={12} /> PESAN ADMIN
                    </div>
                  )}

                  {/* UI TAMBAHAN: Menampilkan Pesan yang Dibalas (replyTo) */}
                  {msg.replyTo && (
                    <div className="bg-slate-100/50 border border-slate-200/60 rounded-lg p-2.5 mb-3 text-[11px] text-slate-500 italic">
                      <span className="font-bold block text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider">
                        Membalas Pesan:
                      </span>
                      "
                      {msg.replyTo.text.length > 50
                        ? msg.replyTo.text.substring(0, 50) + "..."
                        : msg.replyTo.text}
                      "
                    </div>
                  )}

                  {/* Isi Teks */}
                  {formatText(msg.text)}

                  {/* TAMPILIN INSTRUKSI DARI BACKEND (Kalau ada) */}
                  {isFromAI && msg.instruction && (
                    <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-xl flex gap-3 items-start text-xs font-bold text-orange-800">
                      <AlertCircle
                        size={16}
                        className="text-orange-600 shrink-0 mt-0.5"
                      />
                      <span className="leading-relaxed">{msg.instruction}</span>
                    </div>
                  )}
                </div>

                {/* WAKTU */}
                <span className="text-[9px] text-slate-400 font-bold mt-1 px-1 italic uppercase">
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* LOADING INDICATOR (Animasi Ngetik) */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 bg-indigo-600 text-white shadow-md">
              {isLocked ? <ShieldAlert size={16} /> : "AI"}
            </div>
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="p-4 py-5 rounded-2xl shadow-sm border bg-white border-slate-100 rounded-tl-none flex items-center gap-1.5">
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        {/* Element kosong untuk target auto-scroll */}
        <div ref={messagesEndRef} />
      </main>

      {/* FOOTER / INPUT AREA */}
      <footer className="p-4 bg-white border-t border-slate-200 z-30">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* BANNER JIKA DARURAT / DILOCK ADMIN */}
          {isLocked && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 py-1.5 rounded-xl text-center text-[10px] font-black uppercase">
              Admin sedang memantau percakapan ini
            </div>
          )}

          <div className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleInputResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isLocked
                  ? "Ketik pesan untuk Admin..."
                  : "Ceritakan situasi Anda..."
              }
              disabled={isLoading}
              className="flex-1 bg-slate-50 border rounded-2xl px-5 py-3 outline-none text-sm transition-all focus:border-indigo-500 focus:bg-white focus:shadow-md disabled:bg-slate-100 disabled:cursor-not-allowed resize-none overflow-y-auto min-h-[48px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="bg-indigo-600 text-white p-3 rounded-2xl shadow-md shrink-0 hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed h-[48px] flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
