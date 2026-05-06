import axios from "./axiosInstance";
import { Toaster } from "../../utils/Toaster";

export const getClassStudents = async (className, division) => {
  if (!className || !division) return [];
  try {
    const res = await axios.post("/students/all", { className, division });
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
