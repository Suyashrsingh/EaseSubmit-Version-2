import React, { useState, useMemo } from "react";
import { Search, Check, CheckCircle2, AlertTriangle, X, BoxSelect } from "lucide-react";
import {
  useVerifyStudent,
  useUndoVerifyStudent,
  useBulkVerifyStudents,
} from "../hooks/useCoordinatorQueries";
import { useAuthStore } from "../../../app/stores";
import BulkActionMenu from "../../../components/BulkActionMenu";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
import { deriveSubjects } from "../../../utils/exportToExcel";

export default function StudentsTable({ students, isLoading }) {
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(null); // { student, isUndo }

  const user = useAuthStore((state) => state.user);

  const verifyMutation = useVerifyStudent(user?.className, user?.division);
  const undoVerifyMutation = useUndoVerifyStudent(user?.className, user?.division);
  const bulkMutation = useBulkVerifyStudents(user?.className, user?.division);

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
  console.log(allSubjects)
  const getSubjectStatus = (student, subject) => {
    if (!student.submission) return false;
    const sub = student.submission.find((s) => s.subject === subject);
    return sub && (sub.status === "Submitted");
  };

  const openConfirm = (student) => {
    setConfirming({ student, isUndo: student.finalVerification?.status === "Verified" });
  };

  const handleConfirm = () => {
    if (!confirming) return;

    const mutationOptions = {
      onSuccess: () => {
        setConfirming(null);
      },
    };

    if (confirming.isUndo) {
      undoVerifyMutation.mutate(confirming.student._id, mutationOptions);
    } else {
      verifyMutation.mutate(confirming.student._id, mutationOptions);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col relative overflow-hidden h-full">
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

          <div className="flex items-center gap-3">
            <ExcelDownloadButton
              students={filtered}
              filename={`Students_${user?.className ?? ""}_${user?.division ?? ""}`}
              mode="coordinator"
              allSubjects={allSubjects}
              disabled={isLoading}
              label="Export Excel"
            />

            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search students..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
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
                <th className="py-3 px-4 text-center min-w-[120px]">
                  <div className="inline-flex items-center gap-1.5">
                    <span>Final Action</span>
                    <BulkActionMenu
                      verifyLabel="Verify All"
                      undoLabel="Undo All"
                      isPending={bulkMutation.isPending}
                      onVerifyAll={() => {
                        const ids = filtered.map((s) => s._id);
                        bulkMutation.mutate({ studentIds: ids, status: "Verified" });
                      }}
                      onUndoAll={() => {
                        const ids = filtered.map((s) => s._id);
                        bulkMutation.mutate({ studentIds: ids, status: "Not Verified" });
                      }}
                    />
                  </div>
                </th>
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
                      className="hover:bg-gray-50/50 transition-colors group border-b border-gray-100 last:border-0"
                    >
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {s.rollNumber}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">

                          <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors truncate">
                            {s.name}
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
                          onClick={() => openConfirm(s)}
                          disabled={verifyMutation.isPending || undoVerifyMutation.isPending}
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-md border transition-all ${isVerified
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                            : "border-gray-200 bg-white text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
                            }`}
                          title={isVerified ? "Undo verification" : "Verify submission"}
                        >
                          {isVerified ? <Check size={14} /> : <BoxSelect size={14} />}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">
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

      {/* Confirmation Modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !verifyMutation.isPending && !undoVerifyMutation.isPending && setConfirming(null)}
          />
          <div className="relative z-10 w-full max-w-md mx-4 transform transition-all">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-100">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border ${confirming.isUndo ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                {confirming.isUndo ? (
                  <AlertTriangle size={24} className="text-red-500" />
                ) : (
                  <CheckCircle2 size={24} className="text-blue-500" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {confirming.isUndo ? "Undo Final Verification" : "Confirm Final Verification"}
              </h3>

              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {confirming.isUndo ? (
                  <>
                    You are about to <strong className="text-red-600">undo</strong> the final verification for <strong className="text-slate-800">{confirming.student.name}</strong> ({confirming.student.rollNumber}).
                  </>
                ) : (
                  <>
                    You are about to complete the final verification for <strong className="text-slate-800">{confirming.student.name}</strong> ({confirming.student.rollNumber}). This confirms all subject submissions are reviewed.
                  </>
                )}
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setConfirming(null)}
                  disabled={verifyMutation.isPending || undoVerifyMutation.isPending}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={verifyMutation.isPending || undoVerifyMutation.isPending}
                  className={`px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-70 inline-flex items-center gap-2 ${confirming.isUndo
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                >
                  {(verifyMutation.isPending || undoVerifyMutation.isPending) ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" fill="none" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      {confirming.isUndo ? "Undoing..." : "Verifying..."}
                    </>
                  ) : (
                    confirming.isUndo ? "Confirm Undo" : "Confirm Verification"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
