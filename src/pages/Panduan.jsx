import React from "react";
import {
  MessageSquare,
  TriangleAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  Users,
} from "lucide-react";

const Panduan = () => {
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
    // HAPUS md:ml-64 di sini karena sudah ditangani Layout
    <div className="w-full mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Info size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Pusat Panduan SafeTalk
          </h1>
        </div>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl">
          Selamat datang! Pelajari cara memaksimalkan fitur SafeTalk untuk
          menjaga keamanan dan privasi Anda.
        </p>
      </div>

      {/* GRID FITUR UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group"
          >
            <div
              className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
            >
              <step.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* HOW-TO SECTION (Sleek Dark Design) */}
      <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
        {/* Dekorasi Background */}
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none rotate-12">
          <ShieldCheck size={280} />
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-10 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
          Cara Menggunakan SafeTalk
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-indigo-400 border border-white/10 text-lg">
              1
            </div>
            <h4 className="font-bold">Mulai Obrolan</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Buka menu AI Chat, ceritakan apa yang mengganggu pikiran Anda
              secara anonim.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-indigo-400 border border-white/10 text-lg">
              2
            </div>
            <h4 className="font-bold">Analisis Otomatis</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI kami mengklasifikasikan laporan Anda ke dalam kategori K1 - K5
              untuk respon yang tepat.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-indigo-400 border border-white/10 text-lg">
              3
            </div>
            <h4 className="font-bold">Bantuan Profesional</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Jika situasi mendesak, Admin akan mengambil alih untuk memberikan
              solusi nyata.
            </p>
          </div>
        </div>
      </div>

      {/* SOS ALERT FOOTER */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shrink-0 animate-bounce">
            <TriangleAlert size={24} />
          </div>
          <div>
            <h4 className="font-bold text-rose-900">Butuh Bantuan Mendesak?</h4>
            <p className="text-xs text-rose-700">
              Gunakan Tombol SOS jika Anda merasa dalam bahaya fisik sekarang.
            </p>
          </div>
        </div>
        <button className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 group whitespace-nowrap">
          Lihat Prosedur Darurat
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default Panduan;
