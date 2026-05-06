import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubjects,
  getStudents,
  verifySubmission,
  undoVerifySubmission,
  bulkUpdateSubmissions,
} from "../../../services/api/faculty.service";
import { Toaster } from "../../../utils/Toaster";

export const useSubjects = () => {
  return useQuery({
    queryKey: ["faculty-subjects"],
    queryFn: getSubjects,
  });
};

export const useStudents = (selectedSubject) => {
  return useQuery({
    queryKey: ["faculty-students", selectedSubject?._id || selectedSubject?.subject],
    queryFn: () => getStudents(selectedSubject),
    enabled: !!selectedSubject,
  });
};

export const useVerifySubmission = (selectedSubject) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifySubmission,
    onMutate: async ({ studentId, subjectData }) => {
      // Optimistic update
      const queryKey = ["faculty-students", selectedSubject?._id || selectedSubject?.subject];
      await queryClient.cancelQueries({ queryKey });

      const previousStudents = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return old.map((student) => {
          if (student._id === studentId) {
            const existingSubmissions = Array.isArray(student.submission) ? student.submission : [];
            const idx = existingSubmissions.findIndex(
              (sub) => sub.subject === subjectData.subject && sub.subjectType === subjectData.subjectType
            );

            let updatedSubmissions;
            if (idx !== -1) {
              updatedSubmissions = [...existingSubmissions];
              updatedSubmissions[idx] = { ...updatedSubmissions[idx], status: "Completed" };
            } else {
              updatedSubmissions = [
                ...existingSubmissions,
                { subject: subjectData.subject, subjectType: subjectData.subjectType, status: "Completed" },
              ];
            }

            return { ...student, submission: updatedSubmissions };
          }
          return student;
        });
      });

      return { previousStudents };
    },
    onError: (err, newTodo, context) => {
      console.log("Verification error:", err?.response);
      queryClient.setQueryData(
        ["faculty-students", selectedSubject?._id || selectedSubject?.subject],
        context.previousStudents
      );
      Toaster({ title: "Error", message: err?.response?.data?.message || "Verification failed", status: "error" });
    },
    onSuccess: (res) => {
      Toaster({ title: "Success", message: res.data.message || "Successfully verified", status: "success" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["faculty-students", selectedSubject?._id || selectedSubject?.subject],
      });
    },
  });
};

export const useUndoVerifySubmission = (selectedSubject) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, subjectData }) => {
      console.log("from undo")
      return undoVerifySubmission({ studentId, subjectData });
    },
    onMutate: async ({ studentId, subjectData }) => {
      // Optimistic update
      const queryKey = ["faculty-students", selectedSubject?._id || selectedSubject?.subject];
      await queryClient.cancelQueries({ queryKey });

      const previousStudents = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return old.map((student) => {
          if (student._id === studentId) {
            const existingSubmissions = Array.isArray(student.submission) ? student.submission : [];
            const idx = existingSubmissions.findIndex(
              (sub) => sub.subject === subjectData.subject && sub.subjectType === subjectData.subjectType
            );

            let updatedSubmissions;
            if (idx !== -1) {
              updatedSubmissions = [...existingSubmissions];
              updatedSubmissions[idx] = { ...updatedSubmissions[idx], status: "Not Submitted" };
            } else {
              updatedSubmissions = [
                ...existingSubmissions,
                { subject: subjectData.subject, subjectType: subjectData.subjectType, status: "Not Submitted" },
              ];
            }

            return { ...student, submission: updatedSubmissions };
          }
          return student;
        });
      });

      return { previousStudents };
    },
    onError: (err, variables, context) => {
      console.error("Undo Verify Error:", err?.response?.data || err.message || err);
      if (context?.previousStudents) {
        queryClient.setQueryData(
          ["faculty-students", selectedSubject?._id || selectedSubject?.subject],
          context.previousStudents
        );
      }
      Toaster({
        title: "Error",
        message: err?.response?.data?.message || err.message || "Undo failed",
        status: "error"
      });
    },
    onSuccess: (res) => {
      Toaster({ title: "Success", message: res.data.message || "Successfully undone", status: "success" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["faculty-students", selectedSubject?._id || selectedSubject?.subject],
      });
    },
  });
};

export const useBulkUpdateSubmissions = (selectedSubject) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentIds, status }) =>
      bulkUpdateSubmissions({
        studentIds,
        subject: selectedSubject?.subject,
        subjectType: selectedSubject?.subjectType,
        status,
      }),
    onSuccess: (_, { status }) => {
      Toaster({
        title: "Success",
        message:
          status === "Submitted"
            ? "All submissions marked as Submitted"
            : "All submissions marked as Not Submitted",
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
        queryKey: ["faculty-students", selectedSubject?._id || selectedSubject?.subject],
      });
    },
  });
};
