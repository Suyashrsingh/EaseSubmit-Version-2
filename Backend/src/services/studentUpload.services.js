import { normalizeStudentRow } from "../utils/excelStudent.helper.js";
import Student from "../models/student.model.js";
import Verification from "../models/verified.model.js";

export const processStudentUpload = async (rows, defaults, userId) => {
  const skippedRows = [];
  const rollNosInSheet = new Set();
  const validStudents = [];

  // Step 1: Normalize + Validate
  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const student = normalizeStudentRow(row, defaults);

    const missing = [];

    if (!student.name) missing.push("name");
    if (!student.rollNumber) missing.push("rollNumber");
    if (!student.className) missing.push("className");
    if (!student.division) missing.push("division");
    if (!student.batch) missing.push("batch");
    if (!student.subjects.length) missing.push("subjects");

    if (missing.length) {
      skippedRows.push({
        row: rowNumber,
        rollNumber: student.rollNumber || "",
        reason: `Missing: ${missing.join(", ")}`,
      });
      return;
    }

    if (rollNosInSheet.has(student.rollNumber)) {
      skippedRows.push({
        row: rowNumber,
        rollNumber: student.rollNumber,
        reason: "Duplicate in sheet",
      });
      return;
    }

    rollNosInSheet.add(student.rollNumber);

    // IMPORTANT: store rowNumber for later
    validStudents.push({ ...student, rowNumber });
  });

  // Step 2: DB duplicate check
  const existing = await Student.find({
    rollNumber: { $in: validStudents.map((s) => s.rollNumber) },
  }).select("rollNumber");

  const existingSet = new Set(existing.map((s) => s.rollNumber));

  const finalStudents = [];

  validStudents.forEach((s) => {
    if (existingSet.has(s.rollNumber)) {
      skippedRows.push({
        row: s.rowNumber, // ✅ correct row
        rollNumber: s.rollNumber,
        reason: "Already exists in DB",
      });
    } else {
      finalStudents.push(s);
    }
  });

  // Remove rowNumber before insert
  const studentsToInsert = finalStudents.map(({ rowNumber, ...rest }) => rest);

  // Step 3: Insert
  let createdStudents = [];
  if (studentsToInsert.length) {
    createdStudents = await Student.insertMany(studentsToInsert, {
      ordered: false,
    });
  }

  // Step 4: Verification
  const verifications = createdStudents.map((s) => ({
    studentId: s._id,
    coordinatorId: userId,
    status: "Not Verified",
  }));

  const createdVerifications = verifications.length
    ? await Verification.insertMany(verifications)
    : [];

  // Step 5: Link verification safely
  const verificationMap = new Map();
  createdVerifications.forEach((v) => {
    verificationMap.set(v.studentId.toString(), v._id);
  });

  const updates = createdStudents.map((s) => ({
    updateOne: {
      filter: { _id: s._id },
      update: {
        finalVerification: verificationMap.get(s._id.toString()),
      },
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