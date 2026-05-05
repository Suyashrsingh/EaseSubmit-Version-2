import React, { useState } from "react";
import { RiKey2Line } from "react-icons/ri";
import { HiOutlineMail, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useLoginMutation } from "./hooks/useLoginMutation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLoginMutation();

  const submitHandler = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center relative overflow-hidden sm:py-12">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-100/40 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100/50 ring-1 ring-slate-900/5">
            <img
              src="/assets/logo.png"
              alt="SubmitEase Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="hidden text-2xl font-bold bg-gradient-to-r from-[#1565ff] to-indigo-600 bg-clip-text text-transparent">
              SubmitEase
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Connecting Academia for Smarter Submission Management.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-[#1565ff] to-blue-400" />

          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-blue-50/80 text-[#1565ff] border border-blue-100/50 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565ff] animate-pulse" />
              Portal
            </span>
          </div>

          <form className="space-y-5" onSubmit={submitHandler}>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 ml-1"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1565ff] transition-colors">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="block w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1565ff] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1565ff]/10 transition-all duration-200"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-[#1565ff] hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1565ff] transition-colors">
                  <RiKey2Line className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1565ff] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1565ff]/10 transition-all duration-200"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center rounded-xl bg-[#1565ff] py-3.5 px-4 text-sm font-semibold text-white shadow-md shadow-[#1565ff]/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-[#1565ff]/30 focus:outline-none focus:ring-2 focus:ring-[#1565ff] focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Login to Portal"
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Secure access for authorized personnel only.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
