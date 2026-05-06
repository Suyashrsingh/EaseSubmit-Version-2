import { useQuery } from "@tanstack/react-query";
import { getClassStudents } from "../../../services/api/student.service";

export const useClassStudents = (className, division) => {
  return useQuery({
    queryKey: ["student-class-students", className, division],
    queryFn: () => getClassStudents(className, division),
    enabled: !!className && !!division,
  });
};
