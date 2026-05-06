import React from "react";
import { useAuthStore } from "../../app/stores";
import StudentsTable from "./components/StudentsTable";
import { useClassStudents } from "./hooks/useStudentQueries";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function StudentDashboard() {
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
        <StudentsTable students={students} isLoading={isLoading} />
      </div>
    </div>
  );
}
