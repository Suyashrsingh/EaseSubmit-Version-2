import React from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { RiKey2Line } from "react-icons/ri";

/**
 * PasswordField
 *
 * A styled password input that matches the Login page design.
 * Includes show/hide toggle, left icon, label, and disabled state.
 *
 * Props:
 *  id           {string}    — unique input id
 *  label        {string}    — field label text
 *  value        {string}    — controlled value
 *  onChange     {function}  — change handler
 *  placeholder  {string}    — placeholder text
 *  disabled     {boolean}   — disabled while mutating
 *  show         {boolean}   — whether password is visible
 *  onToggle     {function}  — toggle show/hide
 */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  disabled = false,
  show,
  onToggle,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1565ff] transition-colors">
          <RiKey2Line className="w-5 h-5" />
        </div>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          disabled={disabled}
          required
          className="block w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1565ff] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1565ff]/10 transition-all duration-200"
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
          tabIndex={-1}
        >
          {show ? (
            <HiOutlineEyeOff className="w-5 h-5" />
          ) : (
            <HiOutlineEye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
