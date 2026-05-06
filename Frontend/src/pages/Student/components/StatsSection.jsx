import React from "react";
import { BookOpen, FileCheck, Clock } from "lucide-react";
import { MDM } from "../../../utils/constants";

export default function StatsSection({ student }) {
  if (!student) return null;

  let totalSubjects = 0;
  let submissionsDone = 0;

  if (student.subjects) {
    let mdmCountedInTotal = false;
    let mdmCountedInSubmissions = false;

    // Count total subjects, treating all MDM subjects as 1
    student.subjects.forEach((subject) => {
      if (MDM.includes(subject)) {
        if (!mdmCountedInTotal) {
          totalSubjects++;
          mdmCountedInTotal = true;
        }
      } else {
        totalSubjects++;
      }
    });

    // Count submissions done, treating all MDM submissions as 1
    if (student.submission) {
      student.submission.forEach((s) => {
        if (s.status === "Submitted" && student.subjects.includes(s.subject)) {
          if (MDM.includes(s.subject)) {
            if (!mdmCountedInSubmissions) {
              submissionsDone++;
              mdmCountedInSubmissions = true;
            }
          } else {
            submissionsDone++;
          }
        }
      });
    }
  }

  const pendingSubjects = totalSubjects - submissionsDone;

  const stats = [
    {
      title: "Total Subjects",
      value: totalSubjects,
      icon: <BookOpen size={24} className="text-blue-500" />,
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
      title: "Pending Subjects",
      value: pendingSubjects > 0 ? pendingSubjects : 0,
      icon: <Clock size={24} className="text-amber-500" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-600",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-base font-semibold text-gray-900">
          Your Submission Statistics
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 transition-all"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-100 bg-gray-50">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
