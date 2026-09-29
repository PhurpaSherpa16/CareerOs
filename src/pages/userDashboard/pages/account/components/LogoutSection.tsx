import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";

interface LogoutSectionProps {
  onLogout?: () => Promise<void>;
}

export default function LogoutSection({ onLogout }: LogoutSectionProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await signOut();
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Sign out error:", error);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-rose-500 bg-rose-50/40">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Sign Out</h3>
        <p className="text-xs text-slate-400">
          Log out of your account on this device
        </p>
      </div>

      <div className="flex items-center gap-3">
        {confirming ? (
          <>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              {loading ? "Signing out…" : "Yes, Sign Out"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors cursor-pointer border border-rose-200 hover:border-rose-300"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
