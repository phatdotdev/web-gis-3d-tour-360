import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

export const LoadingSpinner = ({ size = 24, className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2 size={size} className="animate-spin text-blue-600" />
    </div>
  );
};
