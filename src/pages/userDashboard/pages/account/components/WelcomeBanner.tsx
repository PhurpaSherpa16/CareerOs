import { FiUser } from "react-icons/fi";

interface WelcomeBannerProps {
  firstName: string;
  email: string;
}

export default function WelcomeBanner({ firstName, email }: WelcomeBannerProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-800 via-blue-800 to-blue-950 px-6 py-7 sm:px-8 sm:py-9 text-white shadow-lg">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
          <FiUser className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-sm text-white/70">
            Manage your profile, preferences, and subscription from here.
          </p>
          <p className="text-xs text-white/50 mt-0.5">{email}</p>
        </div>
      </div>
    </div>
  );
}
