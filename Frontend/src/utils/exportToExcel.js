import * as XLSX from "xlsx";

/**
 * Derives all unique subjects from a student array.
 * @param {Array} students
 * @returns {string[]} sorted subject names
 */
export const deriveSubjects = (students = []) => {
  const set = new Set();
  students.forEach((s) => {
    if (Array.isArray(s.subjects)) s.subjects.forEach((sub) => set.add(sub));
  });
  return Array.from(set).sort();
};

/**
 * Returns submission status label for a given subject on a student.
 * @param {Object} student
 * @param {string} subject
 * @returns {"Submitted" | "Not Submitted" | "N/A"}
 */
const getSubjectStatus = (student, subject) => {
  if (!student.subjects?.includes(subject)) return "N/A";
  const sub = student.submission?.find((s) => s.subject === subject);
  return sub?.status === "Submitted" ? "Submitted" : "Not Submitted";
};

/**
 * Flattens an array of students into rows for Excel export.
 *
 * Columns:
 *  Roll No | Name | Class | Division | Batch | <subjects...> | Final Status | CC Verified
 *
 * @param {Array} students
 * @param {string[]} allSubjects  — ordered list of subject columns
 * @param {"coordinator" | "hod"} mode — controls which columns are included
 * @returns {Object[]} array of plain-object rows
 */
export const buildExcelRows = (students = [], allSubjects = [], mode = "coordinator") => {
  return students.map((s) => {
    const row = {
      "Roll No": s.rollNumber || "",
      Name: s.name || "",
      Class: s.className || "",
      Division: s.division || "",
      Batch: s.batch || "",
    };

    allSubjects.forEach((subject) => {
      row[subject] = getSubjectStatus(s, subject);
    });

    row["Final Status"] =
      s.finalVerification?.status === "Verified" ? "Verified" : "Pending";

    const verifiedAt = s.finalVerification?.verifiedAt;
    row["Verified At"] = verifiedAt
      ? new Date(verifiedAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

    if (mode === "hod") {
      row["HOD Verified"] =
        s.finalVerification?.status === "Verified" ? "Yes" : "No";
    }

    return row;
  });
};

/**
 * Generates and downloads an .xlsx file in the browser.
 *
 * @param {Object} options
 * @param {Array}   options.students    — raw student data
 * @param {string[]} options.allSubjects — ordered list of subject column names
 * @param {string}  options.filename    — output file name (without extension)
 * @param {"coordinator" | "hod"} options.mode
 */
export const exportStudentsToExcel = ({
  students,
  allSubjects,
  filename = "Students_Export",
  mode = "coordinator",
}) => {
  const rows = buildExcelRows(students, allSubjects, mode);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  // Auto-fit column widths
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((r) => String(r[key] ?? "").length)
    ) + 2,
  }));
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
