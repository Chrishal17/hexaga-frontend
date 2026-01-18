import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

const EmergencyAlert = ({ severity, message, onDismiss, className }) => {
  if (!severity || severity === "low") return null;

  const styles = {
    medium: "bg-amber-50 border-amber-200 text-amber-800",
    high: "bg-orange-50 border-orange-200 text-orange-900",
    critical: "bg-red-50 border-red-200 text-red-900 animate-pulse",
  };

  return (
    <div
      className={clsx(
        "p-4 rounded-xl border flex items-center shadow-sm",
        styles[severity],
        className
      )}
    >
      <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="font-bold uppercase text-xs tracking-wider mb-1 opacity-80">
          {severity} ALERT
        </h3>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default EmergencyAlert;
