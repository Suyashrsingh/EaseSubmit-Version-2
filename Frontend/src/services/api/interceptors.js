import axiosInstance from "./axiosInstance";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";

    if (error.response) {
      const status = error.response.status;

      // backend message if available
      message = error.response.data?.message || message;

      if (status === 401) {
        message = "Unauthorized. Please login again.";
        // optional: redirect to login
        // window.location.href = "/login";
      } else if (status === 403) {
        message = "Access denied.";
      } else if (status === 500) {
        message = "Server error. Try again later.";
      }
    } else if (error.request) {
      message = "Network error. Check your connection.";
    }

    // 🔥 Global toast
    toast.error(message);

    return Promise.reject(error);
  }
);