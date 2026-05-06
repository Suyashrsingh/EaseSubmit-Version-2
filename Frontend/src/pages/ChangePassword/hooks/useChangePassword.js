import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { changePasswordAPI } from "../../../services/api/user.service";
import { Toaster } from "../../../utils/Toaster";
import { useAuthStore } from "../../../app/stores";

/**
 * useChangePassword
 *
 * TanStack mutation hook that calls POST /users/change-password.
 * On success it shows a toast, clears auth (forces re-login) and
 * redirects to /login for security.
 */
export const useChangePassword = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: (data) => {
      Toaster({
        title: "Password Changed",
        message: data?.message || "Your password has been updated successfully.",
        status: "success",
      });
      // Force re-login so the new password takes effect cleanly
      setAuth(null);
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      Toaster({
        title: "Change Failed",
        message:
          error?.response?.data?.message ||
          error.message ||
          "Failed to change password. Please try again.",
        status: "error",
      });
    },
  });
};
