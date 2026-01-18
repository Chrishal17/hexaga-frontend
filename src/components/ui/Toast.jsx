import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import clsx from "clsx";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: "bg-white border-green-200 text-green-800 shadow-green-100",
  error: "bg-white border-red-200 text-red-800 shadow-red-100",
  info: "bg-white border-blue-200 text-blue-800 shadow-blue-100",
};

const iconStyles = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
};

export const Toast = ({
  id,
  type = "info",
  message,
  onClose,
  duration = 4000,
}) => {
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  return (
    <div
      className={clsx(
        "flex items-center p-4 mb-3 w-full max-w-sm rounded-xl border shadow-lg transform transition-all duration-300 animate-slide-in backdrop-blur-sm",
        styles[type]
      )}
    >
      <div
        className={clsx(
          "p-2 rounded-full bg-opacity-10 mr-3",
          type === "success"
            ? "bg-green-100"
            : type === "error"
              ? "bg-red-100"
              : "bg-blue-100"
        )}
      >
        <Icon className={clsx("w-5 h-5", iconStyles[type])} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
