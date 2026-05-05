
export const getCellValue = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
};

export const normalizeStudentRow = (row, defaults = {}) => {
  const subjectsRaw = getCellValue(row, [
    "subjects",
    "Subjects",
    "subject",
    "Subject",
  ]);

  return {
    name: getCellValue(row, ["name", "Name", "studentName", "Student Name"]),
    rollNo: getCellValue(row, ["rollNo", "Roll No", "roll no", "RollNo"]),
    className:
      getCellValue(row, ["className", "Class", "class"]) ||
      defaults.className,
    division:
      getCellValue(row, ["division", "Division", "div"]) ||
      defaults.division,
    batch:
      getCellValue(row, ["batch", "Batch"]) ||
      defaults.batch,
    subjects: subjectsRaw
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean),
  };
};