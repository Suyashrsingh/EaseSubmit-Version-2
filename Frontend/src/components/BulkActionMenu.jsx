import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, CheckCheck, Undo2 } from "lucide-react";

/**
 * BulkActionMenu
 * A small caret button that opens a dropdown with "Verify All" and "Undo All" options.
 *
 * Props:
 *  - onVerifyAll  : () => void  — called when "Verify All" is clicked
 *  - onUndoAll    : () => void  — called when "Undo All"   is clicked
 *  - isPending    : boolean     — disables both options while a mutation is in flight
 *  - verifyLabel  : string      — label for the verify action (default "Verify All")
 *  - undoLabel    : string      — label for the undo action   (default "Undo All")
 */
export default function BulkActionMenu({
  onVerifyAll,
  onUndoAll,
  isPending = false,
  verifyLabel = "Verify All",
  undoLabel = "Undo All",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handle = (fn) => {
    setOpen(false);
    fn();
  };

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        title="Bulk actions"
        className={`inline-flex items-center gap-0.5 px-1.5 py-1 rounded-md border text-[11px] font-semibold uppercase tracking-wider transition-all
          ${open
            ? "border-blue-300 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-1 z-50 min-w-[148px] bg-white rounded-xl border border-gray-200 shadow-xl py-1 animate-in"
          style={{ animation: "fadeSlideDown 0.12s ease-out both" }}
        >
          <button
            type="button"
            disabled={isPending}
            onClick={() => handle(onVerifyAll)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:opacity-50"
          >
            <CheckCheck size={14} className="text-emerald-500 shrink-0" />
            {verifyLabel}
          </button>
          <div className="h-px bg-gray-100 mx-2" />
          <button
            type="button"
            disabled={isPending}
            onClick={() => handle(onUndoAll)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <Undo2 size={14} className="text-red-400 shrink-0" />
            {undoLabel}
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
