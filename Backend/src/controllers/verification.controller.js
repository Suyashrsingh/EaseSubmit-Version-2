import {asyncHandler} from '../utils/async-handler.js'
import {ApiError} from '../utils/api-error.js'; 
import {ApiResponse} from "../utils/api-response.js"
import Student from '../models/student.model.js';
import Verification from '../models/verified.model.js';


export const updateVerificationStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Only Class Coordinator can verify students");
  }

  const { studentId } = req.params;
  const { status } = req.body;

  if (!studentId) throw new ApiError(400, "Student ID is required");

  const allowedStatus = ["Verified", "Not Verified"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (
    student.className !== user.className ||
    student.division !== user.division
  ) {
    throw new ApiError(403, "Not allowed for this student");
  }

  const verification = await Verification.findOneAndUpdate(
    { studentId: student._id },
    {
      coordinatorId: user._id,
      status,
      verifiedAt: status === "Verified" ? Date.now() : null,
    },
    { new: true, upsert: true }
  );

  student.finalVerification = verification._id;
  student.isFinalSubmitted = status === "Verified";

  await student.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      { student, verification },
      `Student marked as ${status}`
    )
  );
});

export const bulkUpdateVerificationStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Only Class Coordinator can verify students");
  }

  const { studentIds, status } = req.body;

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    throw new ApiError(400, "Student IDs are required");
  }

  const allowedStatus = ["Verified", "Not Verified"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const students = await Student.find({
    _id: { $in: studentIds },
  });

  if (students.length !== studentIds.length) {
    throw new ApiError(404, "Some students not found");
  }

  const invalidStudent = students.find(
    (s) =>
      s.className !== user.className || s.division !== user.division
  );

  if (invalidStudent) {
    throw new ApiError(403, "Not allowed for some students");
  }

  const verificationOps = students.map((student) => ({
    updateOne: {
      filter: { studentId: student._id },
      update: {
        coordinatorId: user._id,
        status,
        verifiedAt: status === "Verified" ? Date.now() : null,
      },
      upsert: true,
    },
  }));

  await Verification.bulkWrite(verificationOps);

  const updatedVerifications = await Verification.find({
    studentId: { $in: studentIds },
  });

  const verificationMap = new Map();
  updatedVerifications.forEach((v) => {
    verificationMap.set(v.studentId.toString(), v._id);
  });

  const studentOps = students.map((student) => ({
    updateOne: {
      filter: { _id: student._id },
      update: {
        finalVerification: verificationMap.get(student._id.toString()),
        isFinalSubmitted: status === "Verified",
      },
    },
  }));

  await Student.bulkWrite(studentOps);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      `Bulk verification updated to ${status}`
    )
  );
});

export const undoVerificationStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Only Class Coordinator can undo verification");
  }

  const { studentId } = req.params;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }

  const student = await Student.findById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (
    student.className !== user.className ||
    student.division !== user.division
  ) {
    throw new ApiError(403, "Not allowed for this student");
  }

  const verification = await Verification.findOneAndUpdate(
    { studentId: student._id },
    {
      status: "Not Verified",
      verifiedAt: null,
      coordinatorId: user._id,
    },
    { new: true }
  );

  if (!verification) {
    throw new ApiError(404, "Verification record not found");
  }

  student.isFinalSubmitted = false;

  await student.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      { student, verification },
      "Verification undone successfully"
    )
  );
});