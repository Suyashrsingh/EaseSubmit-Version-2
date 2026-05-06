import axios from "./axiosInstance";
import { Toaster } from "../../utils/Toaster";

export const getSubjects = async () => {
  try {
    const res = await axios.get("/teachers/get-subject-teacher");
    if (res.data?.message) {
      Toaster({ title: "Success", message: res.data.message, status: "success" });
    }
    return res.data?.data ?? [];
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch subjects";
    Toaster({ title: "Error", message, status: "error" });
    return [];
  }
};

export const getStudents = async (selectedSubject) => {
  if (!selectedSubject) return [];

  const { className, division, batch, subjectType, subject } = selectedSubject;

  try {
    let res;
    if (subject === "TGS" || subject === "Major Project") {
      res = await axios.post("/students/all", { className, division, batch });
    } else {
      res = await axios.post("/students/filter", { className, subject, subjectType, division, batch });
    }

    if (res.data?.message) {
      Toaster({ title: "Success", message: res.data.message, status: "success" });
    }
    return res.data?.data || [];
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch students";
    Toaster({ title: "Error", message, status: "error" });
    throw error;
  }
};

export const verifySubmission = async ({ studentId, subjectData }) => {
  const { className, division, batch, subject, subjectType } = subjectData;
  const Data = { className, division, batch, subject, subjectType, status: "Submitted" };
  const res = await axios.post(`/submissions/${studentId}`, Data);
  return res;
};

export const undoVerifySubmission = async ({ studentId, subjectData }) => {
  const { subject, subjectType } = subjectData;
  const res = await axios.delete(`/submissions/undo/${studentId}`, {
    data: { subject, subjectType },
  });
  return res;
};

export const bulkUpdateSubmissions = async ({ studentIds, subject, subjectType, status }) => {
  const res = await axios.post("/submissions/bulk-update", {
    studentIds,
    subject,
    subjectType,
    status,
  });
  return res.data;
};
