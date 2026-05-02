import {asyncHandler} from '../utils/async-handler.js'
import {ApiError} from '../utils/api-error.js'; 
import {ApiResponse} from "../utils/api-response.js"
import { normalizeStudentRow } from '../utils/excelStudent.helper.js';
import { processStudentUpload } from '../services/studentUpload.services.js';

export const createStudent = asyncHandler(async (req, res) => {
  if (req.user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Access denied");
  }

  const { name, rollNo, className, division, subjects, batch } = req.body;

  if (!name || !rollNo || !className || !division || !subjects || !batch) {
    throw new ApiError(400, "All fields are required");
  }

  const exists = await Student.findOne({ rollNo });
  if (exists) {
    throw new ApiError(400, "Student already exists");
  }

  const student = await Student.create({
    name,
    rollNo,
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
    .select(studentSelect);

  if (!students.length) {
    throw new ApiError(404, "No students found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Success"));
});

export const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Not found");

  if (
    student.className !== req.user.className ||
    student.division !== req.user.division
  ) {
    throw new ApiError(403, "Not allowed");
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