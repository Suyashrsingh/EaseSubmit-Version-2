import React, { useState, useMemo } from "react";
import { Search, Check, X, CheckCircle2, BoxSelect } from "lucide-react";
import { useAuthStore } from "../../../app/stores";
import StatsSection from "./StatsSection";

export default function StudentsTable({ students, isLoading }) {
  const [query, setQuery] = useState("");
  const user = useAuthStore((state) => state.user);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? students.filter(
      (s) =>
        (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
        (s.name && s.name.toLowerCase().includes(q))
    )
    : students;

  // Compute unique subjects dynamically
  const allSubjects = useMemo(() => {
    if (!students || students.length === 0) return [];
    const subjectsSet = new Set();
    students.forEach((student) => {
      if (student.subjects) {
        student.subjects.forEach((sub) => subjectsSet.add(sub));
      }
    });
    return Array.from(subjectsSet).sort();
  }, [students]);

  const getSubjectStatus = (student, subject) => {
    if (!student.submission) return false;
    const sub = student.submission.find((s) => s.subject === subject);
    return sub && (sub.status === "Submitted");
  };

  return (
    <>
      {filtered.length === 1 && <StatsSection student={filtered[0]} />}

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col relative overflow-hidden flex-1 h-full">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900">
              Students Submission Overview
            </h2>
            {user?.className && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                {user.className} - {user.division}
              </span>
            )}
          </div>

          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search students by name or roll no..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <svg className="w-8 h-8 animate-spin text-blue-500" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" fill="none" />
              <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[100px]">Roll No</th>
                <th className="py-3 px-4 min-w-[180px]">Student Name</th>
                {allSubjects.map((sub) => (
                  <th key={sub} className="py-3 px-2 text-center min-w-[100px]">
                    {sub}
                  </th>
                ))}
                <th className="py-3 px-4 text-center min-w-[120px]">Final Action</th>
                <th className="py-3 px-4 text-right min-w-[100px]">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {filtered.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={allSubjects.length + 4} className="py-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center text-gray-400">
                      <Search size={32} className="mb-3 opacity-50" />
                      <p className="text-sm">No students found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => {
                  const isVerified = s.finalVerification?.status === "Verified";

                  return (
                    <tr
                      key={s._id || s.rollNumber || i}
                      className={`hover:bg-gray-50/50 transition-colors group border-b border-gray-100 last:border-0 ${user?._id === s._id ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {s.rollNumber}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">

                          <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors truncate">
                            {s.name} {user?._id === s._id && <span className="text-xs text-blue-500 font-normal ml-1">(You)</span>}
                          </span>
                        </div>
                      </td>

                      {allSubjects.map((sub) => {
                        const isSubDone = getSubjectStatus(s, sub);
                        const isEnrolled = s.subjects?.includes(sub);

                        return (
                          <td key={sub} className="py-4 px-2 text-center">
                            {!isEnrolled ? (
                              <span className="text-gray-500 font-bold text-lg leading-none">-</span>
                            ) : isSubDone ? (
                              <div className="inline-flex items-center justify-center text-green-600">
                                <Check size={16} strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center text-gray-500">
                                <X size={16} strokeWidth={3} />
                              </div>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          disabled={true}
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-md border transition-all cursor-default ${isVerified
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600 opacity-80"
                            : "border-gray-200 bg-white text-gray-400 opacity-60"
                            }`}
                          title={isVerified ? "Verified" : "Pending Verification"}
                        >
                          {isVerified ? <Check size={14} /> : <BoxSelect size={14} />}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 opacity-90">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 opacity-90">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
