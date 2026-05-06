import React from "react";
import { useAuthStore } from "../../app/stores";
import StatsSection from "./components/StatsSection";
import StudentsTable from "./components/StudentsTable";
import { useClassStudents } from "./hooks/useCoordinatorQueries";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function ClassCoordinatorDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: students = [], isLoading } = useClassStudents(
    user?.className,
    user?.division
  );

  return (
    <div className="bg-slate-50 h-screen flex flex-col overflow-hidden">
      <DashboardNavbar />

      {/* Main dashboard area */}
      <div className="w-full max-w-[1600px] mx-auto px-[2vw] md:px-[5vw] pt-6 pb-6 flex-1 flex flex-col overflow-hidden">
        <StatsSection students={students} />
        <div className="flex-1 overflow-hidden flex flex-col">
          <StudentsTable students={students} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
