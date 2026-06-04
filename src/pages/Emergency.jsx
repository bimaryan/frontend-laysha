import React from "react";
import { Phone, AlertCircle, Clock, ShieldAlert } from "lucide-react";

const Emergency = () => {
  const emergencyContacts = [
    {
      name: "DP3A Kabupaten Indramayu",
      subtitle: "Dinas Pemberdayaan Perempuan dan Perlindungan Anak",
      hours: "Senin - Jumat: 08:00 - 16:00",
      number: "(0234) 272727",
      phoneUrl: "0234272727",
    },
    {
      name: "Komnas Perempuan",
      subtitle: "Komisi Nasional Anti Kekerasan terhadap Perempuan",
      hours: "24/7",
      number: "021-3903963",
      phoneUrl: "0213903963",
    },
    {
      name: "Layanan Psikologis (SEJIWA)",
      subtitle: "Layanan Psikologi untuk Sehat Jiwa",
      hours: "24/7",
      number: "119",
      phoneUrl: "119",
    },
    {
      name: "Polisi (Darurat)",
      subtitle: "Bantuan Kepolisian Segera",
      hours: "24/7",
      number: "110",
      phoneUrl: "110",
    },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TAMPILAN KHUSUS MOBILE (HP)                            */}
      {/* ========================================================= */}
      <div className="block md:hidden min-h-screen bg-slate-50 pb-24 relative w-full">
        {/* Header Melengkung ala Profil */}
        <div className="bg-rose-600 pt-12 pb-24 px-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-white/20 p-2 rounded-full">
              <ShieldAlert className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white">Bantuan Darurat</h1>
          </div>
          <p className="text-rose-100 text-sm mt-1 ml-14">
            Hubungan langsung dengan layanan keamanan.
          </p>
        </div>

        {/* Konten Utama ditarik ke atas menimpa header */}
        <div className="px-6 -mt-16 space-y-6">
          {/* Card Peringatan */}
          <div className="bg-orange-50 border-l-[6px] border-orange-400 p-5 rounded-xl shadow-sm flex items-start gap-4">
            <AlertCircle className="text-orange-500 w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-orange-900 text-sm">
                Jika Anda dalam bahaya langsung
              </h3>
              <p className="text-orange-800 text-xs mt-1.5 leading-relaxed">
                Segera hubungi 110 (Polisi) atau segera lari ke tempat aman
                terdekat.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-slate-800 font-bold mb-3">
              Kontak Layanan Dukungan
            </h2>
            <div className="space-y-4">
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                >
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">
                      {contact.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {contact.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-slate-500 text-xs bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={14} className="text-slate-400" />
                      <span className="font-medium">{contact.hours}</span>
                    </div>
                  </div>

                  {/* Tombol Dial ala Tombol Save Profil */}
                  <a
                    href={`tel:${contact.phoneUrl}`}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-blue-200 transition-all"
                  >
                    <Phone size={20} />
                    Hubungi {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 pt-2">
            Tekan tombol biru untuk melakukan panggilan langsung.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TAMPILAN KHUSUS DESKTOP (DASHBOARD LAYOUT)             */}
      {/* ========================================================= */}
      <div className="hidden md:block min-h-screen bg-slate-50 p-6 xl:p-8 w-full">
        <div className="mx-auto">
          {/* Header Desktop */}
          <div className="mb-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-50">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Bantuan Darurat
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Hubungan langsung dengan layanan dukungan keamanan dan
                psikologis.
              </p>
            </div>
          </div>

          {/* Card Peringatan Desktop */}
          <div className="bg-orange-50 border-l-[6px] border-orange-400 p-5 rounded-2xl shadow-sm flex items-start gap-4 mb-8">
            <AlertCircle className="text-orange-500 w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-orange-900 text-base">
                Jika Anda dalam bahaya langsung
              </h3>
              <p className="text-orange-800 text-sm mt-1">
                Segera hubungi 110 (Polisi) atau lari ke tempat aman terdekat.
              </p>
            </div>
          </div>

          {/* Grid Layout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed min-h-[40px]">
                    {contact.subtitle}
                  </p>

                  <div className="flex items-center gap-2 mt-5 text-slate-500 text-xs bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock size={14} className="text-slate-400" />
                    <span className="font-medium">{contact.hours}</span>
                  </div>
                </div>

                {/* Tombol Dial Desktop */}
                <div className="pt-6 mt-auto">
                  <a
                    href={`tel:${contact.phoneUrl}`}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-3 px-6 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                  >
                    <Phone size={18} />
                    Panggil {contact.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Emergency;
