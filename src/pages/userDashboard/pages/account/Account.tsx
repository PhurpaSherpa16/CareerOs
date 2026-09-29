import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/react";
import HeaderUserDashboard from "../../../../components/Header.UserDashboard";
import { Heading } from "../../../../components/Heading.UserDashboard";
import ErrorMessage from "../../../../components/ErrorMessage";
import WelcomeBanner from "./components/WelcomeBanner";
import ProfileEditor from "./components/ProfileEditor";
import AIModelSelector from "./components/AIModelSelector";
import UpgradeModal from "./components/UpgradeModal";
import LogoutSection from "./components/LogoutSection";
import { mockUser, aiModels, subscriptionPlans } from "./account.data";
import type { UserProfile, AIModel, PlanTier, SubscriptionPlan } from "./account.types";

export default function Account() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isLoaded, user: clerkUser } = useUser();

  // ── States ────────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Model & Subscription states
  const [currentTier, setCurrentTier] = useState<PlanTier>("free");
  const [activeModelId, setActiveModelId] = useState<string>("gpt-4o-mini");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // ── Initialize user data ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      if (!isLoaded) return;

      if (clerkUser) {
        setProfile({
          firstName: clerkUser.firstName || mockUser.firstName,
          lastName: clerkUser.lastName || mockUser.lastName,
          email: clerkUser.primaryEmailAddress?.emailAddress || mockUser.email,
          avatarUrl: clerkUser.imageUrl || mockUser.avatarUrl,
        });
      } else {
        // Fallback to mock data if no clerk session
        setProfile(mockUser);
      }
      setLoading(false);
    } catch {
      setError("Unable to load account information. Please try again.");
      setLoading(false);
    }
  }, [isLoaded, clerkUser]);

  // ── Profile update handler ────────────────────────────────────────────────
  const handleSaveProfile = async (updated: UserProfile) => {
    // If clerk is present, attempt updating first & last name
    if (clerkUser) {
      try {
        await clerkUser.update({
          firstName: updated.firstName,
          lastName: updated.lastName,
        });
      } catch (err) {
        console.warn("Clerk profile update notice:", err);
      }
    }
    setProfile(updated);
  };

  // ── AI Model selection handler ────────────────────────────────────────────
  const handleSelectModel = (model: AIModel) => {
    setActiveModelId(model.id);
  };

  // ── Upgrade plan select handler ───────────────────────────────────────────
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    // For now, close modal as per requirements
    setIsUpgradeModalOpen(false);
    console.log("Selected plan:", plan.name);
  };

  // ── Logout handler ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mainDiv space-y-8 pb-10">
        <HeaderUserDashboard
          title="Account"
          subTitle="Manage your account preferences, profile, and subscription"
        />
        <div className="w-full h-44 rounded-2xl bg-slate-100 animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-40 bg-slate-100 rounded-md animate-pulse" />
          <div className="w-full h-64 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="mainDiv space-y-8 pb-10">
        <HeaderUserDashboard
          title="Account"
          subTitle="Manage your account preferences, profile, and subscription"
        />
        <ErrorMessage
          title="Account Error"
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            setProfile(clerkUser ? {
              firstName: clerkUser.firstName || mockUser.firstName,
              lastName: clerkUser.lastName || mockUser.lastName,
              email: clerkUser.primaryEmailAddress?.emailAddress || mockUser.email,
              avatarUrl: clerkUser.imageUrl || mockUser.avatarUrl,
            } : mockUser);
            setLoading(false);
          }}
        />
      </div>
    );
  }

  // ── Empty state fallback ──────────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="mainDiv space-y-8 pb-10">
        <HeaderUserDashboard
          title="Account"
          subTitle="Manage your account preferences, profile, and subscription"
        />
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500 text-sm">No profile details found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mainDiv space-y-8 pb-10">
      {/* Page Header */}
      <HeaderUserDashboard
        title="Account"
        subTitle="Manage your personal information, AI models, and subscriptions"
      />

      {/* Top Welcome / Friendly Banner */}
      <WelcomeBanner
        firstName={profile.firstName || "there"}
        email={profile.email}
      />

      {/* Section 1: User Profile & Details */}
      <div className="space-y-4">
        <Heading label="Personal Details" />
        <ProfileEditor user={profile} onSave={handleSaveProfile} />
      </div>

      {/* Section 2: AI Model Selection & Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading label="AI Model & Subscription" />
        </div>
        <AIModelSelector
          models={aiModels}
          activeModelId={activeModelId}
          currentTier={currentTier}
          onSelect={handleSelectModel}
          onUpgradeClick={() => setIsUpgradeModalOpen(true)}
        />
      </div>

      {/* Section 3: Logout & Session */}
      <div className="space-y-4">
        <Heading label="Session & Security" />
        <LogoutSection onLogout={handleLogout} />
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        plans={subscriptionPlans}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}
