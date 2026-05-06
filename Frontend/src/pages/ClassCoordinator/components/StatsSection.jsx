import React from "react";
import { Users, FileCheck, Clock } from "lucide-react";

export default function StatsSection({ students }) {
  const totalStudents = students?.length || 0;
  const submissionsDone = students?.filter((s) => s.finalVerification?.status === "Verified").length || 0;
  const pendingStudents = totalStudents - submissionsDone;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: <Users size={24} className="text-blue-500" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Submissions Done",
      value: submissionsDone,
      icon: <FileCheck size={24} className="text-emerald-500" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-600",
    },
    {
      title: "Pending Students",
      value: pendingStudents,
      icon: <Clock size={24} className="text-amber-500" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 transition-all"
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border border-gray-100 bg-gray-50`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
