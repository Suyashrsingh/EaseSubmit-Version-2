const injectDefaultSubjects = (allocations, teacherId) => {
  const defaultSubjects = [
    {
      subject: "TGS",
      subjectType: "Theory",
    },
    {
      subject: "Major Project",
      subjectType: "Practical",
    },
  ];

  defaultSubjects.forEach((defaultSub) => {
    const exists = allocations.some(
      (a) => a.subject === defaultSub.subject
    );

    if (!exists) {
      allocations.push({
        subject: defaultSub.subject,
        subjectType: defaultSub.subjectType,
        className: "ANY",
        division: "ANY",
        batch: null,
        teacherId,
      });
    }
  });

  return allocations;
};

export default injectDefaultSubjects;