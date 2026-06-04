import React from "react";
import {
  MessageSquare,
  TriangleAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Tambahan jika tombol butuh dihubungkan

const Panduan = () => {
  const navigate = useNavigate(); // Untuk navigasi tombol Prosedur Darurat

  const steps = [
    {
      icon: MessageSquare,
      title: "AI Konsultasi",
      desc: "Gunakan fitur AI Chat untuk berkonsultasi secara anonim. AI kami dilatih untuk memberikan respon empatik.",
      color: "bg-indigo-500",
    },
    {
      icon: TriangleAlert,
      title: "Tombol SOS",
      desc: "Dalam keadaan darurat, gunakan tombol SOS untuk mengirim sinyal bahaya ke tim admin secara instan.",
      color: "bg-rose-500",
    },
    {
      icon: Lock,
      title: "Privasi Aman",
      desc: "Identitas Anda terlindungi penuh dengan enkripsi end-to-end. Data Anda adalah milik Anda.",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 md:pb-12 pt-6 md:pt-8 px-4 md:px-6 xl:px-8">
      {/* Kontainer Utama Pembatas Lebar (max-w-5xl) */}
      <div className="mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
        {/* HEADER SECTION */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-100/50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
            <Info size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Pusat Panduan SafeTalk
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Selamat datang! Pelajari cara memaksimalkan fitur SafeTalk untuk
              menjaga keamanan dan privasi Anda.
            </p>
          </div>
        </div>

        {/* GRID FITUR UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group flex flex-col"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${step.color} rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-4 shadow-sm group-hover:-translate-y-1 transition-transform`}
              >
                <step.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1.5 md:mb-2">
                {step.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed flex-grow">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* HOW-TO SECTION (Sleek Dark Design) */}
        <div className="bg-slate-900 rounded-2xl md:rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
          {/* Dekorasi Background */}
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none rotate-12">
            <ShieldCheck size={240} className="md:w-[320px] md:h-[320px]" />
          </div>

          <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-2.5">
            <div className="w-1.5 h-5 md:h-6 bg-indigo-500 rounded-full"></div>
            Cara Menggunakan SafeTalk
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            <div className="space-y-2.5 md:space-y-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-indigo-400 border border-white/10 text-sm md:text-base">
                1
              </div>
              <h4 className="font-bold text-base md:text-lg text-slate-100">
                Mulai Obrolan
              </h4>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Buka menu AI Chat, ceritakan apa yang mengganggu pikiran Anda
                secara anonim.
              </p>
            </div>

            <div className="space-y-2.5 md:space-y-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-indigo-400 border border-white/10 text-sm md:text-base">
                2
              </div>
              <h4 className="font-bold text-base md:text-lg text-slate-100">
                Analisis Otomatis
              </h4>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                AI kami mengklasifikasikan laporan Anda ke dalam kategori K1 -
                K5 untuk respon yang tepat.
              </p>
            </div>

            <div className="space-y-2.5 md:space-y-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-indigo-400 border border-white/10 text-sm md:text-base">
                3
              </div>
              <h4 className="font-bold text-base md:text-lg text-slate-100">
                Bantuan Profesional
              </h4>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Jika situasi mendesak, Admin akan mengambil alih untuk
                memberikan solusi nyata.
              </p>
            </div>
          </div>
        </div>

        {/* SOS ALERT FOOTER */}
        <div className="bg-rose-50/80 border border-rose-100 rounded-2xl md:rounded-[1.5rem] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row w-full md:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-600 rounded-xl md:rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-200">
              <TriangleAlert size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 text-sm md:text-base">
                Butuh Bantuan Mendesak?
              </h4>
              <p className="text-[11px] md:text-xs text-rose-700 mt-0.5">
                Gunakan Tombol SOS jika Anda merasa dalam bahaya fisik sekarang.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/emergency")}
            className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all text-xs md:text-sm flex items-center justify-center gap-2 group shadow-lg shadow-rose-200 hover:-translate-y-0.5"
          >
            Lihat Prosedur Darurat
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panduan;
