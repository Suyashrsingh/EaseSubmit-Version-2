import React, { useState } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import StudentsTable from "./components/StudentsTable";
import { useAllStudents } from "./hooks/useHodQueries";

export default function HodDashboard() {
  const [className, setClassName] = useState("ANY");
  const [division, setDivision] = useState("ANY");

  const { data: students = [], isLoading } = useAllStudents(
    className === "ANY" ? null : className,
    division === "ANY" ? null : division
  );

  return (
    <div className="bg-slate-50 h-screen flex flex-col overflow-hidden">
      <DashboardNavbar />

      {/* Main dashboard area */}
      <div className="w-full max-w-[1600px] mx-auto px-[2vw] md:px-[5vw] pt-6 pb-6 flex-1 flex flex-col overflow-hidden gap-6">
        
        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shrink-0 flex flex-col sm:flex-row gap-6 sm:items-end">
          <div className="flex-1 w-full max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white cursor-pointer"
            >
              <option value="ANY">All Classes</option>
              <option value="TY">TY</option>
              <option value="SY">SY</option>
              <option value="FY">FY</option>
            </select>
          </div>

          <div className="flex-1 w-full max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white cursor-pointer"
            >
              <option value="ANY">All Divisions</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <StudentsTable students={students} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
