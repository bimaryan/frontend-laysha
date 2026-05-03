import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  PhoneCall,
  MessageSquare,
  User,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    return hasSeenOnboarding === "true" ? "selection" : "splash";
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (currentView === "splash") {
      const timer = setTimeout(() => {
        setCurrentView("onboarding");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const onboardingData = [
    {
      icon: <Lock className="w-12 h-12 text-white" />,
      title: "Anonim & Aman",
      desc: "Konsultasi sepenuhnya anonim dan terenkripsi. Privasi Anda adalah prioritas kami.",
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-white" />,
      title: "Deteksi Risiko AI",
      desc: "Sistem kami mendeteksi indikasi risiko berbahaya untuk memberikan perlindungan yang tepat.",
    },
    {
      icon: <PhoneCall className="w-12 h-12 text-white" />,
      title: "Koneksi Darurat",
      desc: "Akses langsung ke layanan dukungan resmi dan hotline bantuan darurat 24/7.",
    },
  ];

  const handleNextSlide = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem("hasSeenOnboarding", "true");
      setCurrentView("selection");
    }
  };

  const handleAnonimClick = () => {
    localStorage.removeItem("safetalk_token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/chat");
  };

  // 1. SPLASH SCREEN (Warna Slate 900 seperti Sidebar)
  if (currentView === "splash") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white animate-in fade-in duration-700">
        <div className="bg-indigo-600 p-5 rounded-[2rem] shadow-2xl shadow-indigo-500/20 mb-8 animate-bounce">
          <ShieldCheck className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter mb-2">SafeTalk AI</h1>
        <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs mb-8">
          Anda Tidak Sendiri
        </p>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    );
  }

  // 2. ONBOARDING SCREEN
  if (currentView === "onboarding") {
    return (
      <div className="flex flex-col items-center justify-between min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md text-center">
          <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl shadow-indigo-200 mb-10 transition-all duration-500 transform scale-110">
            {onboardingData[currentSlide].icon}
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
            {onboardingData[currentSlide].title}
          </h2>
          <p className="text-slate-500 leading-relaxed px-4">
            {onboardingData[currentSlide].desc}
          </p>
        </div>

        <div className="w-full max-w-md pb-8">
          <div className="flex justify-center space-x-2 mb-10">
            {onboardingData.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === index
                    ? "w-10 bg-indigo-600"
                    : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
          >
            {currentSlide === onboardingData.length - 1
              ? "Mulai Sekarang"
              : "Selanjutnya"}
            <ChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    );
  }

  // 3. SELECTION SCREEN (Warna konsisten Indigo & Slate)
  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 p-6 pt-16">
      <div className="bg-slate-900 p-4 rounded-2xl shadow-xl mb-6">
        <ShieldCheck className="w-10 h-10 text-indigo-500" />
      </div>
      <h1 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">
        SafeTalk AI
      </h1>
      <p className="text-slate-400 font-medium mb-12">
        Silakan Pilih Akses Masuk
      </p>

      <div className="w-full max-w-2xl space-y-5">
        {/* Card Konsultasi Anonim (Indigo Theme) */}
        <button
          onClick={handleAnonimClick}
          className="w-full bg-indigo-600 text-left p-8 rounded-[2rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-start space-x-5 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <MessageSquare size={120} />
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-1">
              Konsultasi Anonim
            </h3>
            <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-3">
              Tanpa Login
            </p>
            <p className="text-indigo-100/80 text-sm leading-relaxed max-w-sm">
              Mulai konsultasi langsung tanpa jejak. Data tidak disimpan dan
              identitas Anda terjaga.
            </p>
          </div>
        </button>

        {/* Card Masuk sebagai Pengguna (White/Slate Theme) */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white border border-slate-200 text-left p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex items-start space-x-5 group"
        >
          <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-indigo-50 transition-colors">
            <User className="w-7 h-7 text-slate-600 group-hover:text-indigo-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              Masuk Pengguna
            </h3>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">
              Simpan Riwayat
            </p>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Login untuk melacak perkembangan Anda dan menyimpan percakapan
              penting sebelumnya.
            </p>
          </div>
        </button>
      </div>

      {/* Keamanan Informasi Section */}
      <div className="mt-auto pt-12 pb-6 w-full max-w-2xl">
        <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0">
            <Lock size={16} />
          </div>
          <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
            Sistem SafeTalk menggunakan enkripsi tingkat tinggi. Kami menjamin
            tidak ada data pribadi yang dibagikan kepada pihak ketiga tanpa
            persetujuan Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
