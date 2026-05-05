import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "../services/api/axiosInstance";
import { Toaster } from "../utils/Toaster";
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      roleRoute: {
        "Student": "/student",
        "HOD": "/hod",
        "ClassCoordinator": "/classcoordinator",
        "Teacher": "/teacher",
      },

      setAuth: (user) => {
        set({
          user: user,
        });
      },


    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);