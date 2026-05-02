// services/studentUpload.service.js

import { normalizeStudentRow } from "../utils/excelStudent.helper.js";

export const processStudentUpload = async (rows, defaults, userId) => {
  const skippedRows = [];
  const rollNosInSheet = new Set();
  const validStudents = [];

  //  Step 1: Normalize + Validate
  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const student = normalizeStudentRow(row, defaults);

    const missing = [];

    if (!student.name) missing.push("name");
    if (!student.rollNo) missing.push("rollNo");
    if (!student.className) missing.push("className");
    if (!student.division) missing.push("division");
    if (!student.batch) missing.push("batch");
    if (!student.subjects.length) missing.push("subjects");

    if (missing.length) {
      skippedRows.push({
        row: rowNumber,
        rollNo: student.rollNo,
        reason: `Missing: ${missing.join(", ")}`,
      });
      return;
    }

    if (rollNosInSheet.has(student.rollNo)) {
      skippedRows.push({
        row: rowNumber,
        rollNo: student.rollNo,
        reason: "Duplicate in sheet",
      });
      return;
    }

    rollNosInSheet.add(student.rollNo);
    validStudents.push(student);
  });

  //  Step 2: DB duplicate check
  const existing = await Student.find({
    rollNo: { $in: validStudents.map((s) => s.rollNo) },
  }).select("rollNo");

  const existingSet = new Set(existing.map((s) => s.rollNo));

  const finalStudents = [];
  validStudents.forEach((s, i) => {
    if (existingSet.has(s.rollNo)) {
      skippedRows.push({
        row: i + 2,
        rollNo: s.rollNo,
        reason: "Already exists in DB",
      });
    } else {
      finalStudents.push(s);
    }
  });

  //  Step 3: Insert
  const createdStudents = finalStudents.length
    ? await Student.insertMany(finalStudents, { ordered: false })
    : [];

  //  Step 4: Verification
  const verifications = createdStudents.map((s) => ({
    studentId: s._id,
    coordinatorId: userId,
    status: "Not Verified",
  }));

  const createdVerifications = await Verification.insertMany(verifications);
// Step 5: Link verification to student
  const updates = createdStudents.map((s, i) => ({
    updateOne: {
      filter: { _id: s._id },
      update: { finalVerification: createdVerifications[i]._id },
    },
  }));

  if (updates.length) {
    await Student.bulkWrite(updates);
  }

  return {
    createdStudents,
    skippedRows,
  };
};