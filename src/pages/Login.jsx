import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"; // Tambahkan AlertCircle

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // State untuk pesan error

  // State untuk menangkap input
  const [username, setUsername] = useState(""); // Bisa berisi email atau username
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      // Tembak API Laravel
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          login: username, // Backend Laravel Anda meminta key bernama 'login'
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        // Simpan token untuk autentikasi API selanjutnya
        localStorage.setItem("safetalk_token", result.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", result.user.role);

        // Hapus session anonim jika user memilih login
        localStorage.removeItem("safetalk_session");
        sessionStorage.removeItem("safetalk_session");

        // Arahkan berdasarkan role yang didapat dari database
        if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/chat");
        }
      } else {
        // Tampilkan error jika password/email salah
        setErrorMsg(result.message || "Kredensial tidak valid.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMsg("Gagal terhubung ke server. Pastikan backend aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* --- SISI KIRI: Branding --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0055A5] relative items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl inline-block mb-6 ring-1 ring-white/20">
            <ShieldCheck className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Privasi Anda, Prioritas Kami.
          </h2>
          <p className="text-blue-100 leading-relaxed opacity-90">
            SafeTalk menggunakan enkripsi tingkat militer untuk memastikan
            setiap konsultasi Anda tetap anonim dan aman.
          </p>
        </div>
      </div>

      {/* --- SISI KANAN: Form Login --- */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20">
          <div className="w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-3">
                Selamat Datang!
              </h1>
              <p className="text-slate-500 font-medium">
                Masuk untuk melanjutkan konsultasi aman Anda.
              </p>
            </div>

            {/* --- TAMPILAN ERROR --- */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex gap-3 items-start animate-pulse">
                <AlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-sm font-bold text-red-800">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-700 uppercase tracking-wider ml-1">
                  Email / Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                    <Mail
                      size={18}
                      className="text-slate-400 group-focus-within:text-[#3B82F6]"
                    />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nama@email.com atau username"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#3B82F6] outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-700 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      size={18}
                      className="text-slate-400 group-focus-within:text-[#3B82F6]"
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#3B82F6] outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                    Ingat Saya
                  </span>
                </label>
                {/* <Link
                  to="/forgot"
                  className="text-sm font-black text-[#3B82F6] hover:text-blue-800 transition-colors underline-offset-4 hover:underline"
                >
                  Lupa Password?
                </Link> */}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3B82F6] hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Masuk Sekarang"
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-bold">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="text-[#3B82F6] hover:text-blue-800 transition-colors underline decoration-2 underline-offset-4"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
