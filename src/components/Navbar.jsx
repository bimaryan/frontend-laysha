import React from "react";
import { Bell, Shield } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 bg-[#0055A5] border-b border-blue-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-4">
        <Shield className="w-10 h-10 text-[#0055A5] bg-white p-2 rounded-xl shadow-sm" />
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wide text-white">
            SafeTalk
          </span>
          <span className="text-xs text-blue-100 opacity-90">Mode Anonim</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-blue-100 hover:bg-blue-600 rounded-full relative transition">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0055A5]"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 shadow-sm flex items-center justify-center text-xs text-white font-bold">
          
        </div>
      </div>
    </header>
  );
};

export default Navbar;
