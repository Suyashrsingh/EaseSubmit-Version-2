export const getCellValue = (row, keys) => {
  const normalizedRow = {};

  // Normalize Excel keys (trim + lowercase)
  Object.keys(row).forEach((k) => {
    normalizedRow[k.trim().toLowerCase()] = row[k];
  });

  for (const key of keys) {
    const value = normalizedRow[key.toLowerCase()];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
};

export const normalizeStudentRow = (row, defaults = {}) => {
  const subjectsRaw = getCellValue(row, [
    "subjects",
    "subject",
  ]);

  let subjects = [];

  try {
    // Try JSON format
    subjects = JSON.parse(subjectsRaw);
  } catch {
    // Fallback to comma-separated
    subjects = subjectsRaw.split(",");
  }

  subjects = subjects
    .map((s) => String(s).trim().toUpperCase())
    .filter(Boolean);

  return {
    name: getCellValue(row, ["name", "student name"]),
    
    rollNumber: getCellValue(row, [
      "rollnumber",
      "roll number",
      "rollno",
      "roll no",
    ]),

    className:
      getCellValue(row, ["classname", "class"]) ||
      (defaults.className || "").trim(),

    division:
      getCellValue(row, ["division", "div"]) ||
      (defaults.division || "").trim(),

    batch:
      getCellValue(row, ["batch"]) ||
      (defaults.batch || "").trim(),

    subjects,
  };
};