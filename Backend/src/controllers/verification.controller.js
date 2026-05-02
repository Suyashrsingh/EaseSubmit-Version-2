import {asyncHandler} from '../utils/async-handler.js'
import {ApiError} from '../utils/api-error.js'; 
import {ApiResponse} from "../utils/api-response.js"


export const updateVerificationStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Only Class Coordinator can verify students");
  }

  const { studentId } = req.params;
  const { status } = req.body;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

 
  if (!["Verified", "Not Verified"].includes(status)) {
    throw new ApiError(400, "Invalid status");
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

  const verification = await Verification.create({
    studentId: student._id,
    coordinatorId: user._id,
    status: status,
    verifiedAt: status === "Verified" ? Date.now() : null,
  });

  student.finalVerification = verification._id;

  student.isFinalSubmitted = status === "Verified";

  await student.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student,
        verification,
      },
      `Student marked as ${status}`
    )
  );
});