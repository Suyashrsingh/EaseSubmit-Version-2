export const buildStudentFilter = ({
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

export const studentPopulate = [
  { path: "finalVerification" },
  { path: "submission" },
];

export const studentSelect =
  "name rollNo className division batch subjects finalVerification submission HodVerified";