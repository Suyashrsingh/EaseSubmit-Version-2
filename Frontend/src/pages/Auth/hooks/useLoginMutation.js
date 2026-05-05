import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/stores";
import API from "../../../services/api/axiosInstance";
import { Toaster } from "../../../utils/Toaster";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const roleRoute = useAuthStore((state) => state.roleRoute);

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await API.post("/users/login", credentials);
      console.log(response)
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.data);
      Toaster({
        title: "Login Successful",
        message: "Welcome to SubmitEase, where submissions are made easier.",
        status: "success",
      });

      const userRole = data.data.role;
      const route = roleRoute[userRole] || "/";
      navigate(route, { replace: true });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      Toaster({
        title: "Login Failed",
        message: errorMessage,
        status: "error",
      });
    },
  });
};
