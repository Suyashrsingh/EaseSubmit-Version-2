export const buildStudentFilter = (input) => {
  const buildSingle = ({
    className,
    division,
    subject,
    subjectType,
    batch,
  }) => {
    const filter = {
      className,
      division,
    };

    if (subject) {
      filter.subjects = { $in: [subject] };
    }

    if (subjectType === "Practical" && batch) {
      filter.batch = batch;
    }

    return filter;
  };

  if (Array.isArray(input)) {
    return {
      $or: input.map((alloc) => buildSingle(alloc)),
    };
  }

  return buildSingle(input);
};

export const studentPopulate = [
  { path: "finalVerification" },
  { path: "submission" },
];

export const studentSelect =
  "name rollNumber className division batch subjects finalVerification submission HodVerified";