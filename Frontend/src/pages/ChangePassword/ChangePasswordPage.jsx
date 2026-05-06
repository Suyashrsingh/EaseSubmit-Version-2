import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { useAuthStore } from "../../app/stores";
import { useChangePassword } from "./hooks/useChangePassword";
import PasswordField from "./components/PasswordField";

export default function ChangePasswordPage() {
  const user = useAuthStore((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword({ oldPassword, newPassword });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center relative overflow-hidden sm:py-12">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-100/40 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100/50 ring-1 ring-slate-900/5">
            <img
              src="/assets/logo.png"
              alt="SubmitEase Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="hidden text-2xl font-bold bg-gradient-to-r from-[#1565ff] to-indigo-600 bg-clip-text text-transparent">
              SubmitEase
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Change Password
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Keep your account secure by updating your password regularly.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-[#1565ff] to-blue-400" />

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-blue-50/80 text-[#1565ff] border border-blue-100/50 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565ff] animate-pulse" />
              Security
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email (read-only, pre-filled from session) */}
            <div className="space-y-1.5">
              <label
                htmlFor="cp-email"
                className="block text-sm font-medium text-slate-700 ml-1"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <input
                  id="cp-email"
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-500 cursor-default focus:outline-none"
                />
              </div>
            </div>

            {/* Current Password */}
            <PasswordField
              id="cp-old"
              label="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              disabled={isPending}
              show={showOld}
              onToggle={() => setShowOld((v) => !v)}
            />

            {/* New Password */}
            <PasswordField
              id="cp-new"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={isPending}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !oldPassword || !newPassword}
              className="w-full flex items-center justify-center rounded-xl bg-[#1565ff] py-3.5 px-4 text-sm font-semibold text-white shadow-md shadow-[#1565ff]/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-[#1565ff]/30 focus:outline-none focus:ring-2 focus:ring-[#1565ff] focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating Password…
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          You will be logged out after a successful password change.
        </p>
      </div>
    </div>
  );
}
