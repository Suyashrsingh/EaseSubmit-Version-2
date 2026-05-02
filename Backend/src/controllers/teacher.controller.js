import {asyncHandler} from '../utils/async-handler.js'
import {ApiError} from '../utils/api-error.js'; 
import {ApiResponse} from "../utils/api-response.js"

export const getTeachers = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  console.log(userRole);

  if (userRole !== "ClassCoordinator" && userRole !== "HOD") {
    throw new ApiError(403, "Access denied");
  }

  const teachers = await User.find({ role: "Teacher" });

  if (teachers.length === 0) {
    throw new ApiError(404, "No teachers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teachers, "Teachers fetched successfully"));
});


export const allocateTeacher = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "ClassCoordinator") {
    throw new ApiError(403, "Only class coordinators can allocate teachers");
  }

  const { email, subject, className, division, subjectType, batch } = req.body;

  if (!email || !subject || !className || !division || !subjectType) {
    throw new ApiError(400, "All fields are required");
  }

  if (subjectType === "Practical" && !batch) {
    throw new ApiError(400, "Batch is required for practical subjects");
  }

  if (
    req.user.className !== className ||
    req.user.division !== division
  ) {
    throw new ApiError(403, "You can only allocate teachers to your class");
  }

  const teacher = await User.findOne({ email });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  if (teacher.role !== "Teacher") {
    throw new ApiError(400, "User is not a teacher");
  }

  const exists = await TeacherAllocation.findOne({
    teacher: teacher._id,
    subject,
    className,
    division,
    ...(subjectType === "Practical" ? { batch } : {}),
  });

  if (exists) {
    throw new ApiError(400, "Teacher already allocated");
  }

  const allocation = await TeacherAllocation.create({
    teacher: teacher._id,
    subject,
    className,
    division,
    subjectType,
    ...(subjectType === "Practical" ? { batch } : {}),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, allocation, "Teacher allocated successfully"));
});

export const teacherForSubjects = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const teacherId = user._id;

  let allocations = await TeacherAllocation.find({
    teacher: teacherId,
  }).lean();

  allocations = injectDefaultSubjects(allocations, teacherId);

  return res
    .status(200)
    .json(new ApiResponse(200, allocations, "Success"));
});
