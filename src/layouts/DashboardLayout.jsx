import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 h-full relative">
        {/* <Navbar /> */}

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
