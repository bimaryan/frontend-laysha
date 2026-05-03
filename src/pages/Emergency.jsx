import React from "react";
import {
  Phone,
  AlertCircle,
  Clock,
  Smartphone,
  Monitor,
  ShieldAlert,
} from "lucide-react";

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
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="bg-red-600 pt-8 pb-12 px-6 rounded-b-[2.5rem] shadow-md relative">
        <div className="w-full mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <ShieldAlert className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Bantuan Darurat
            </h1>
          </div>
          <p className="text-red-100 ml-[3.75rem] text-sm md:text-base">
            Hubungan langsung dengan layanan dukungan keamanan.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-4 mt-6 space-y-6">
        <div className="bg-[#FFF8E1] border-l-[6px] border-orange-400 p-5 rounded-r-xl shadow-sm flex items-start gap-4">
          <AlertCircle className="text-orange-500 w-6 h-6 mt-1 shrink-0" />
          <div>
            <h3 className="font-bold text-orange-900 text-sm md:text-base">
              Jika Anda dalam bahaya langsung
            </h3>
            <p className="text-orange-800 text-xs md:text-sm mt-1">
              Segera hubungi 110 (Polisi) atau segera lari ke tempat aman
              terdekat.
            </p>
          </div>
        </div>

        <h2 className="font-bold text-gray-800 text-lg px-1">
          Kontak Layanan Dukungan
        </h2>

        <div className="space-y-4">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  {contact.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{contact.subtitle}</p>

                <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm bg-gray-50 w-fit px-3 py-1 rounded-full">
                  <Clock size={14} />
                  <span>{contact.hours}</span>
                </div>
              </div>

              <a
                href={`tel:${contact.phoneUrl}`}
                className="block w-full bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-center transition-colors shadow-blue-200 shadow-lg flex items-center justify-center gap-2"
              >
                <Phone size={20} className="fill-current" />
                {contact.number}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 py-4">
          Tekan tombol biru untuk melakukan panggilan langsung.
        </p>
      </div>
    </div>
  );
};

export default Emergency;
