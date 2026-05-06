import API from "./axiosInstance";

/**
 * Calls POST /users/change-password
 * Requires the user to be logged in (cookie-based auth).
 * @param {{ oldPassword: string, newPassword: string }} payload
 */
export const changePasswordAPI = async ({ oldPassword, newPassword }) => {
  const res = await API.post("/users/change-password", { oldPassword, newPassword });
  return res.data;
};
