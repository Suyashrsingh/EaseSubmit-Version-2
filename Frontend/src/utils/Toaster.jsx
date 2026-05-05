import toast from "react-hot-toast";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

export const Toaster = ({
  title,
  message,
  status = "info",
}) => {
  const variants = {
    success: {
      icon: <CheckCircle2 size={18} className="text-emerald-400" />,
    },
    error: {
      icon: <XCircle size={18} className="text-red-400" />,
    },
    warning: {
      icon: <AlertTriangle size={18} className="text-amber-400" />,
    },
    info: {
      icon: <Info size={18} className="text-blue-400" />,
    },
  };

  const current = variants[status] || variants.info;

  toast.custom(
    (t) => (
      <div
        className={`
          pointer-events-auto
          w-[380px]
          max-w-[92vw]

          text-zinc-900
          bg-zinc-100

          border border-gray-200
          shadow-xl

          rounded-lg
          px-4 py-3

          flex gap-3 items-start
        `}
      >
        {/* ICON */}
        <div className="mt-[2px] flex-shrink-0">
          {current.icon}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col gap-1">
          {title && (
            <p className="text-sm font-semibold">
              {title}
            </p>
          )}

          {message && (
            <p className="text-sm text-zinc-400">
              {message}
            </p>
          )}

        </div>
      </div>
    ),
    {
      duration: 3500,
      position: "bottom-right",
    }
  );
};