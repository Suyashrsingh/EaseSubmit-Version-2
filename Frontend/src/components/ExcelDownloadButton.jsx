import React, { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { exportStudentsToExcel, deriveSubjects } from "../utils/exportToExcel";

/**
 * ExcelDownloadButton
 *
 * A self-contained, styled button that exports student data to Excel on click.
 *
 * Props:
 *  - students      {Array}                   — array of student objects from the API
 *  - filename      {string}                  — output file name without extension
 *  - mode          {"coordinator" | "hod"}   — controls which columns are included
 *  - allSubjects   {string[]}                — optional override; auto-derived if omitted
 *  - disabled      {boolean}                 — disable while data is loading
 *  - label         {string}                  — button label (default "Export Excel")
 */
export default function ExcelDownloadButton({
  students = [],
  filename = "Students_Export",
  mode = "coordinator",
  allSubjects,
  disabled = false,
  label = "Export Excel",
}) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!students.length) return;
    setLoading(true);
    try {
      const subjects = allSubjects ?? deriveSubjects(students);
      exportStudentsToExcel({ students, allSubjects: subjects, filename, mode });
    } finally {
      // Small delay so the spinner is visible for feedback
      setTimeout(() => setLoading(false), 600);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled || loading || !students.length}
      title={
        !students.length
          ? "No data to export"
          : `Download ${students.length} student(s) as Excel`
      }
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
        whitespace-nowrap transition-all duration-150 select-none
        ${
          disabled || !students.length
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : loading
            ? "border-emerald-200 bg-emerald-50 text-emerald-600 cursor-wait"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-sm active:scale-95"
        }
      `}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin shrink-0" />
      ) : (
        <FileSpreadsheet size={15} className="shrink-0" />
      )}
      <span>{loading ? "Exporting…" : label}</span>
    </button>
  );
}
