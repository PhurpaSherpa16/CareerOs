import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  tryLaterLink?: string;
  onTryLater?: () => void;
  tryLogin?: string;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred while processing your request. Please try again later.",
  onRetry,
  tryLaterLink,
  tryLogin='/login',
  onTryLater,
}: ErrorMessageProps) {
  return (
    <div className="w-full max-w-md mx-auto my-8 bg-white border border-rose-100/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-500/5 text-center flex flex-col items-center space-y-4 animate-fadeIn">
      {/* Warning Icon Badge */}
      <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100/80">
        <FiAlertCircle className="text-3xl text-rose-500" />
      </div>

      {/* Title & Message */}
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
          {message}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
        {onRetry && (
          <button type="button" onClick={onRetry} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 
          rounded-xl bg-(--primaryBlue) hover:bg-(--primaryBlue)/90 text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm">
            <FiRefreshCw className="text-xs" />
            Try Again
          </button>
        )}

        {(tryLaterLink || onTryLater) && (
          <Link to={tryLaterLink || "/"} onClick={(e) => {
            if (onTryLater) {
                e.preventDefault();
                onTryLater();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-(--primaryBlue) 
            hover:bg-(--primaryBlue)/90 text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm">
            Try later
          </Link>
        )}
        {(tryLogin) && (
          <Link to={tryLogin || "/login"} onClick={(e) => {
            if (onTryLater) {
                e.preventDefault();
                onTryLater();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-(--primaryBlue) 
            hover:bg-(--primaryBlue)/90 text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

