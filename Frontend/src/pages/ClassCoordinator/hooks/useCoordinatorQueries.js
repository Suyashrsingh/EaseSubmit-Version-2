import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClassStudents,
  verifyStudent,
  undoVerifyStudent,
  bulkVerifyStudents,
} from "../../../services/api/coordinator.service";
import { Toaster } from "../../../utils/Toaster";

export const useClassStudents = (className, division) => {
  return useQuery({
    queryKey: ["coordinator-students", className, division],
    queryFn: () => getClassStudents(className, division),
    enabled: !!className && !!division,
  });
};

export const useVerifyStudent = (className, division) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId) => verifyStudent(studentId),
    onMutate: async (studentId) => {
      await queryClient.cancelQueries({ queryKey: ["coordinator-students", className, division] });

      const previousStudents = queryClient.getQueryData(["coordinator-students", className, division]);

      if (previousStudents) {
        queryClient.setQueryData(["coordinator-students", className, division], (old) => {
          return old.map((student) => {
            if (student._id === studentId) {
              return {
                ...student,
                finalVerification: {
                  ...student.finalVerification,
                  status: "Verified",
                  verifiedAt: new Date().toISOString(),
                },
                isFinalSubmitted: true,
              };
            }
            return student;
          });
        });
      }

      return { previousStudents };
    },
    onError: (err, newTodo, context) => {
      console.error("Verify Error:", err?.response?.data || err.message || err);
      if (context?.previousStudents) {
        queryClient.setQueryData(
          ["coordinator-students", className, division],
          context.previousStudents
        );
      }
      Toaster({
        title: "Error",
        message: err?.response?.data?.message || err.message || "Verification failed",
        status: "error",
      });
    },
    onSuccess: (res) => {
      Toaster({ title: "Success", message: "Successfully verified", status: "success" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["coordinator-students", className, division],
      });
    },
  });
};

export const useUndoVerifyStudent = (className, division) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId) => undoVerifyStudent(studentId),
    onMutate: async (studentId) => {
      await queryClient.cancelQueries({ queryKey: ["coordinator-students", className, division] });

      const previousStudents = queryClient.getQueryData(["coordinator-students", className, division]);

      if (previousStudents) {
        queryClient.setQueryData(["coordinator-students", className, division], (old) => {
          return old.map((student) => {
            if (student._id === studentId) {
              return {
                ...student,
                finalVerification: {
                  ...student.finalVerification,
                  status: "Not Verified",
                  verifiedAt: null,
                },
                isFinalSubmitted: false,
              };
            }
            return student;
          });
        });
      }

      return { previousStudents };
    },
    onError: (err, newTodo, context) => {
      console.error("Undo Verify Error:", err?.response?.data || err.message || err);
      if (context?.previousStudents) {
        queryClient.setQueryData(
          ["coordinator-students", className, division],
          context.previousStudents
        );
      }
      Toaster({
        title: "Error",
        message: err?.response?.data?.message || err.message || "Undo failed",
        status: "error",
      });
    },
    onSuccess: (res) => {
      Toaster({ title: "Success", message: "Successfully undone", status: "success" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["coordinator-students", className, division],
      });
    },
  });
};

export const useBulkVerifyStudents = (className, division) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentIds, status }) => bulkVerifyStudents({ studentIds, status }),
    onSuccess: (_, { status }) => {
      Toaster({
        title: "Success",
        message:
          status === "Verified"
            ? "All students verified successfully"
            : "All verifications undone successfully",
        status: "success",
      });
    },
    onError: (err) => {
      Toaster({
        title: "Error",
        message: err?.response?.data?.message || err.message || "Bulk update failed",
        status: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["coordinator-students", className, division],
      });
    },
  });
};
