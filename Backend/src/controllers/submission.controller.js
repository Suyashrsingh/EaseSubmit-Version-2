import {asyncHandler} from '../utils/async-handler.js'
import {ApiError} from '../utils/api-error.js'; 
import {ApiResponse} from "../utils/api-response.js"

export const postSubmission = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { subject, subjectType, className, division, batch, status } = req.body;
  const user = req.user;

  const subjectConfig = {
    TGS: ["Theory"],
    "Major Project": ["Practical"],
    ECE: ["Theory", "Practical"],
    CED: ["Theory", "Practical"],
    PPE: ["Theory", "Practical"],
    MED: ["Theory", "Practical"],
    AED: ["Theory", "Practical"],
    EED: ["Theory", "Practical"],
  };

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (!subject || !student.subjects.includes(subject)) {
    throw new ApiError(400, "Invalid or missing subject for this student");
  }

  const baseData = {
    studentId,
    subject,
    className: student.className,
    division: student.division,
    batch: student.batch,
    teacherId: user._id,
    status,
    markedAt: new Date(),
  };

  const types = subjectConfig[subject];

  if (types) {
    const submissions = await Promise.all(
      types.map((type) =>
        Submission.findOneAndUpdate(
          { studentId, subject, subjectType: type },
          { ...baseData, subjectType: type },
          { new: true, upsert: true }
        )
      )
    );

    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { submission: { $each: submissions.map((s) => s._id) } },
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        submissions.length === 1 ? submissions[0] : submissions,
        `${subject} submission ensured successfully`
      )
    );
  }

  const teacher = await TeacherAllocation.findOne({
    teacher: user._id,
    subject,
    subjectType,
    className,
    division,
    ...(subjectType === "Practical" ? { batch } : {}),
  });

  if (!teacher) {
    throw new ApiError(
      401,
      "Teacher not authorized for this subject/class/division/batch."
    );
  }

  const submission = await Submission.findOneAndUpdate(
    { studentId, subject, subjectType },
    { ...baseData, subjectType },
    { new: true, upsert: true }
  );

  await Student.findByIdAndUpdate(studentId, {
    $addToSet: { submission: submission._id },
  });

  return res.status(201).json(
    new ApiResponse(201, submission, "Submission ensured successfully")
  );
});

export const undoSubmissionStatus = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { subject, subjectType } = req.body;
  const user = req.user;

  const subjectConfig = {
    TGS: ["Theory"],
    "Major Project": ["Practical"],
    ECE: ["Theory", "Practical"],
    CED: ["Theory", "Practical"],
    PPE: ["Theory", "Practical"],
    MED: ["Theory", "Practical"],
    AED: ["Theory", "Practical"],
    EED: ["Theory", "Practical"],
  };

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (!subject || !student.subjects.includes(subject)) {
    throw new ApiError(400, "Invalid or missing subject for this student");
  }

  const types = subjectConfig[subject] || [subjectType];

  if (!types || types.length === 0) {
    throw new ApiError(400, "Subject type is required");
  }

  const submissions = await Submission.find({
    studentId,
    subject,
    subjectType: { $in: types },
  });

  if (!submissions || submissions.length === 0) {
    throw new ApiError(404, "Submission not found");
  }

  const ops = submissions.map((s) => ({
    updateOne: {
      filter: { _id: s._id },
      update: {
        status: "Not Submitted",
        markedAt: null,
        teacherId: user._id,
      },
    },
  }));

  await Submission.bulkWrite(ops);

  const updated = await Submission.find({
    _id: { $in: submissions.map((s) => s._id) },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      updated.length === 1 ? updated[0] : updated,
      "Submission undone successfully"
    )
  );
});

export const bulkUpdateSubmissionStatus = asyncHandler(async (req, res) => {
  const { studentIds, subject, subjectType, status } = req.body;
  const user = req.user;

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    throw new ApiError(400, "Student IDs are required");
  }

  if (!subject) {
    throw new ApiError(400, "Subject is required");
  }

  const allowedStatus = ["Submitted", "Not Submitted"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const subjectConfig = {
    TGS: ["Theory"],
    "Major Project": ["Practical"],
    ECE: ["Theory", "Practical"],
    CED: ["Theory", "Practical"],
    PPE: ["Theory", "Practical"],
    MED: ["Theory", "Practical"],
    AED: ["Theory", "Practical"],
    EED: ["Theory", "Practical"],
  };

  const students = await Student.find({
    _id: { $in: studentIds },
  });

  if (students.length !== studentIds.length) {
    throw new ApiError(404, "Some students not found");
  }

  const types = subjectConfig[subject] || [subjectType];

  if (!types || types.length === 0) {
    throw new ApiError(400, "Subject type is required");
  }

  const baseUpdate = {
    status,
    markedAt: status === "Submitted" ? new Date() : null,
    teacherId: user._id,
  };

  const ops = [];

  for (const student of students) {
    if (!student.subjects.includes(subject)) {
      continue;
    }

    for (const type of types) {
      ops.push({
        updateOne: {
          filter: {
            studentId: student._id,
            subject,
            subjectType: type,
          },
          update: {
            $set: {
              ...baseUpdate,
              className: student.className,
              division: student.division,
              batch: student.batch,
            },
          },
          upsert: true,
        },
      });
    }
  }

  if (ops.length === 0) {
    throw new ApiError(400, "No valid students for this subject");
  }

  await Submission.bulkWrite(ops);

  const updatedSubmissions = await Submission.find({
    studentId: { $in: studentIds },
    subject,
    subjectType: { $in: types },
  });

  const studentUpdateOps = updatedSubmissions.map((s) => ({
    updateOne: {
      filter: { _id: s.studentId },
      update: {
        $addToSet: { submission: s._id },
      },
    },
  }));

  if (studentUpdateOps.length > 0) {
    await Student.bulkWrite(studentUpdateOps);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      `Bulk submission marked as ${status}`
    )
  );
});
const groupAllocations = (allocations) => {
  const map = new Map();

  for (const alloc of allocations) {
    const key = `${alloc.className}-${alloc.division}`;

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(alloc);
  }

  return map;
};

const buildStudentFilter = (allocations) => {
  return {
    $or: allocations.map((a) => ({
      className: a.className,
      division: a.division,
    })),
  };
};

export const getAssignedStudentsForSubmission = asyncHandler(async (req, res) => {
  const user = req.user;

  const allocations = await TeacherAllocation.find({ teacher: user._id }).lean();

  if (!allocations.length) {
    throw new ApiError(404, "No allocations found");
  }

  const allocationMap = groupAllocations(allocations);
  const studentFilter = buildStudentFilter(allocations);

  const students = await Student.find(studentFilter)
    .select("name rollNo className division batch subjects")
    .lean();

  const result = [];

  for (const alloc of allocations) {
    const filteredStudents = students.filter((s) => {
      if (
        s.className !== alloc.className ||
        s.division !== alloc.division
      ) {
        return false;
      }

      if (
        alloc.subjectType === "Practical" &&
        alloc.batch &&
        s.batch !== alloc.batch
      ) {
        return false;
      }

      return s.subjects.includes(alloc.subject);
    });

    result.push({
      subject: alloc.subject,
      subjectType: alloc.subjectType,
      className: alloc.className,
      division: alloc.division,
      batch: alloc.batch || "All",
      students: filteredStudents,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        teacher: user.name,
        totalSubjects: allocations.length,
        assignedClasses: result,
      },
      "Students fetched successfully"
    )
  );
});