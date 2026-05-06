import React, { useEffect, useState } from "react";
import SidebarFilter from "./components/SidebarFilter";
import SubmissionPanel from "./components/SubmissionPanel";
import { useAuthStore } from "../../app/stores";
import DashboardNavbar from "../../components/DashboardNavbar";

const FacultyDashboard = () => {
  const [selectedsubject, setselectedsubject] = useState(null);
  const user = useAuthStore((state) => state.user);

  // Height adjustment logic
  const [contentHeight, setContentHeight] = useState("100dvh");

  useEffect(() => {
    const updateHeight = () => {
      const nav = document.getElementById("dashboard_navbar");
      const navHeight = nav?.offsetHeight || 64; // Default fallback to 64px if no navbar id
      setContentHeight(`calc(100dvh - ${navHeight}px)`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <DashboardNavbar />

      {/* Main dashboard area */}
      <div
        className="w-full max-w-[1600px] mx-auto overflow-hidden flex px-[2vw] md:px-[5vw] gap-4 md:gap-6 pt-6 pb-6"
        style={{ height: contentHeight }}
      >
        <SidebarFilter
          selectedsubject={selectedsubject}
          setselectedsubject={setselectedsubject}
        />
        
        <SubmissionPanel
          selectedsubject={selectedsubject}
        />
      </div>
    </div>
  );
};

export default FacultyDashboard;
