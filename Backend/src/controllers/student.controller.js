import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from "../utils/api-response.js"
import { normalizeStudentRow } from '../utils/excelStudent.helper.js';
import { processStudentUpload } from '../services/studentUpload.services.js';
import Student from '../models/student.model.js';
import Submission from "../models/submission.model.js";
import TeacherAllocation from "../models/teacherAllocation.model.js";
import xlsx from "xlsx";
import { buildStudentFilter, studentPopulate, studentSelect } from '../utils/student-helper.js';

export const createStudent = asyncHandler(async (req, res) => {
  if (req.user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Access denied");
  }

  const { name, rollNumber, className, division, subjects, batch } = req.body;

  if (!name || !rollNumber || !className || !division || !subjects || !batch) {
    throw new ApiError(400, "All fields are required");
  }

  const exists = await Student.findOne({ rollNumber });
  if (exists) {
    throw new ApiError(400, "Student already exists");
  }

  const student = await Student.create({
    name,
    rollNumber,
    className,
    division,
    subjects,
    batch,
  });

  const verification = await Verification.create({
    studentId: student._id,
    verificationStatus: "Pending",
  });

  student.finalVerification = verification._id;
  await student.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, student, "Created"));
});

// Get students with optional filters for class, division, subject, subjectType, and batch - only class and division are mandatory for frontend to fetch students for submission marking
export const getStudentsFiltered = asyncHandler(async (req, res) => {
  const { className, division, subject, subjectType, batch } = req.body;

  if (!className || !division) {
    throw new ApiError(400, "Class & Division required");
  }

  const filter = buildStudentFilter({
    className,
    division,
    subject,
    subjectType,
    batch,
  });

  const students = await Student.find(filter)
    .populate(studentPopulate)
    .sort({ rollNumber: 1 })
    .select(studentSelect);
  if (!students.length) {
    throw new ApiError(404, "No students found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Success"));
});

// Update student details - only class coordinator
export const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Not found");

  if (
    student.className !== req.user.className ||
    student.division !== req.user.division
  ) {
    throw new ApiError(403, "You can only update students from your class and division  ");
  }

  Object.assign(student, req.body);

  await student.save();

  return res
    .status(200)
    .json(new ApiResponse(200, student, "Updated"));
});

export const uploadStudentsFromExcel = asyncHandler(async (req, res) => {
  if (req.user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Only Class Coordinator can upload students");
  }

  if (!req.file) {
    throw new ApiError(400, "Excel file is required");
  }

  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new ApiError(400, "No sheet found");
  }

  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
  });

  if (!rows.length) {
    throw new ApiError(400, "Excel sheet is empty");
  }

  const defaults = {
    className: req.body.className,
    division: req.body.division,
    batch: req.body.batch,
  };

  const { createdStudents, skippedRows } =
    await processStudentUpload(rows, defaults, req.user._id);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        createdCount: createdStudents.length,
        skippedCount: skippedRows.length,
        created: createdStudents,
        skipped: skippedRows,
      },
      "Students uploaded successfully"
    )
  );
});

// get all students for tgs marking
export const getAllStudents = asyncHandler(async (req, res) => {
  const { className, division, batch } = req.body;
  const user = req.user;
  console.log(req.body)

  let query = {};
  if (!(className == "ANY" || division == "ANY")) {
    if (className) query.className = className;
    if (division) query.division = division;
    if (batch) query.batch = batch;
  }


  const students = await Student.find(query).select("name rollNumber className division batch subjects submission finalVerification").lean().populate("submission finalVerification").sort({ rollNumber: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
})

// get all students for a specific class across all divisions (HOD use)
export const getStudentsByClass = asyncHandler(async (req, res) => {
  const { className } = req.body;

  if (!className) {
    throw new ApiError(400, "className is required");
  }

  const students = await Student.find({ className })
    .select("name rollNumber className division batch subjects submission finalVerification")
    .lean()
    .populate("submission finalVerification")
    .sort({ division: 1, rollNumber: 1 });
  console.log(students);

  return res
    .status(200)
    .json(new ApiResponse(200, students, `Students of class ${className} fetched successfully`));
})

// controller for student to view their own submission details

export const getStudentSubmissionStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "Student") {
    throw new ApiError(403, "Access denied");
  }

  const { rollNumber } = req.body;

  if (!rollNumber) {
    throw new ApiError(400, "Roll number is required");
  }

  const student = await Student.findOne({ rollNumber })
    .select("name rollNumber className division batch subjects submission verification")
    .populate("submission")
    .populate("finalVerification")
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res.status(200).json(
    new ApiResponse(200, student, "Submission details fetched successfully")
  );
});