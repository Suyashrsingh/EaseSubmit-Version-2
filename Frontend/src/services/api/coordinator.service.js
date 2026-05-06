import { Toaster } from "../../utils/Toaster";
import axios from "../api/axiosInstance";

export const getClassStudents = async (className, division) => {
  if (!className || !division) return [];
  try {
    const res = await axios.post("/students/filter", { className, division });
    if (res.data?.message) {
      Toaster({ title: "Success", message: res.data.message, status: "success" });
    }
    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch students";
    Toaster({ title: "Error", message, status: "error" });
    throw error;
  }
};

export const verifyStudent = async (studentId) => {
  const res = await axios.put(`/verification/update/${studentId}`, { status: "Verified" });
  return res.data;
};

export const undoVerifyStudent = async (studentId) => {
  const res = await axios.delete(`/verification/undo/${studentId}`);
  return res.data;
};

export const bulkVerifyStudents = async ({ studentIds, status }) => {
  const res = await axios.post("/verification/bulk-update", { studentIds, status });
  return res.data;
};
