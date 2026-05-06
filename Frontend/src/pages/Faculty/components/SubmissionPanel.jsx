import React, { useState } from "react";
import { CheckCircle2, Search, Check, BoxSelect, AlertTriangle } from "lucide-react";
import {
  useStudents,
  useUndoVerifySubmission,
  useVerifySubmission,
  useBulkUpdateSubmissions,
} from "../hooks/useFacultyQueries";
import BulkActionMenu from "../../../components/BulkActionMenu";

export default function SubmissionPanel({ selectedsubject }) {
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(null); // { student, submission }
  const [isUndo, setisUndo] = useState(false)
  const { data: students = [], isLoading } = useStudents(selectedsubject);
  const verifyMutation = useVerifySubmission(selectedsubject);
  const undoVerifyMutation = useUndoVerifySubmission(selectedsubject);
  const bulkMutation = useBulkUpdateSubmissions(selectedsubject);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? students.filter(
      (s) =>
        (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
        (s.name && s.name.toLowerCase().includes(q))
    )
    : students;

  const getSubmissionFor = (student) => {
    return (
      student.submission?.find(
        (sub) =>
          sub.subject === selectedsubject?.subject &&
          sub.subjectType === selectedsubject?.subjectType
      ) || null
    );
  };

  const openConfirm = (student) => {
    const sub = getSubmissionFor(student);
    setisUndo(sub && sub.status === "Submitted");
    if (sub && sub.status === "Completed") return; // no-op if already verified
    setConfirming({ student, submission: sub });
  };

  const handleConfirm = () => {
    if (!confirming || !selectedsubject) return;
    if (isUndo) {
      undoVerifyMutation.mutate(
        { studentId: confirming.student._id, subjectData: selectedsubject },
        {
          onSuccess: () => {
            setConfirming(null);
            setisUndo(false);
          },
        }
      );
      return;
    }
    verifyMutation.mutate(
      { studentId: confirming.student._id, subjectData: selectedsubject },
      {
        onSuccess: () => {
          setConfirming(null);
        },
      }
    );
  };

  if (!selectedsubject) {
    return (
      <div className="flex-1 h-full bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-800">No Subject Selected</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            Please select a subject from the sidebar to view student submissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 h-full relative">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col relative overflow-hidden h-full">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-gray-900">
                {selectedsubject?.subject} Submissions
              </h2>
              {selectedsubject?.batch && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                  Batch {selectedsubject.batch}
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
                placeholder="Search students..."
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
            <table className="w-full table-auto">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                <tr className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Division</th>
                  <th className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span>Action</span>
                      <BulkActionMenu
                        verifyLabel="Submit All"
                        undoLabel="Undo All"
                        isPending={bulkMutation.isPending}
                        onVerifyAll={() => {
                          const ids = filtered.map((s) => s._id);
                          bulkMutation.mutate({ studentIds: ids, status: "Submitted" });
                        }}
                        onUndoAll={() => {
                          const ids = filtered.map((s) => s._id);
                          bulkMutation.mutate({ studentIds: ids, status: "Not Submitted" });
                        }}
                      />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {filtered.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="inline-flex flex-col items-center justify-center text-gray-400">
                        <Search size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">No students found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, i) => {
                    const submission = getSubmissionFor(s);
                    const isSubmitted = submission?.status === "Submitted";

                    return (
                      <tr
                        key={s._id || s.rollNumber || i}
                        className="hover:bg-gray-50/50 transition-colors group border-b border-gray-100 last:border-0"
                      >
                        <td className="py-4 px-4 text-sm font-medium text-gray-700">
                          {s.rollNumber}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                              {s.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-600 text-center">
                          {s.division}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => openConfirm(s)}
                            disabled={verifyMutation.isPending || undoVerifyMutation.isPending}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-md border transition-all ${isSubmitted
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                              : "border-gray-200 bg-white text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
                              }`}
                            title={isSubmitted ? "Undo verification" : "Verify submission"}
                          >
                            {isSubmitted ? (
                              <Check size={14} />
                            ) : (
                              <BoxSelect size={14} />
                            )}
                          </button>
                        </td>

                        <td className="py-4 px-4 text-right">
                          {isSubmitted ? (
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
                {confirming.submission?.status === "Submitted" ? (
                  <AlertTriangle size={24} className="text-red-500" />
                ) : (
                  <CheckCircle2 size={24} className="text-blue-500" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {confirming.submission?.status === "Submitted" ? "Undo Verification" : "Verify Submission"}
              </h3>

              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {confirming.submission?.status === "Submitted" ? (
                  <>
                    You are about to <strong className="text-red-600">undo</strong> the submission verification for <strong className="text-slate-800">{confirming.student.name}</strong> ({confirming.student.rollNo}) in <strong className="text-slate-800">{selectedsubject?.subject}</strong>. This will mark it as not submitted.
                  </>
                ) : (
                  <>
                    You are about to mark the submission for <strong className="text-slate-800">{confirming.student.name}</strong> ({confirming.student.rollNo}) as completed for <strong className="text-slate-800">{selectedsubject?.subject}</strong>. This action will be recorded.
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
                      {confirming.submission?.status === "Submitted" ? "Undoing..." : "Verifying..."}
                    </>
                  ) : (
                    confirming.submission?.status === "Submitted" ? "Confirm Undo" : "Confirm Verification"
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
