import { useQuery } from "@tanstack/react-query";
import { getAllStudentsAPI } from "../../../services/api/hod.service";

export const useAllStudents = (className, division) => {
  return useQuery({
    queryKey: ["hod-students", className, division],
    queryFn: () => getAllStudentsAPI(className, division),
    enabled: !!className && !!division,
  });
};
