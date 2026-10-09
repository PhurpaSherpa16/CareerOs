import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser, useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import HeaderUserDashboard from "../../../../components/Header.UserDashboard";
import { Heading } from "../../../../components/Heading.UserDashboard";
import { Card } from "../../../../components/Card.UserDashboard";
import ErrorMessage from "../../../../components/ErrorMessage";
import WelcomeBanner from "./components/WelcomeBanner";
import ProfileEditor from "./components/ProfileEditor";
import AIModelSelector from "./components/AIModelSelector";
import UpgradeModal from "./components/UpgradeModal";
import LogoutSection from "./components/LogoutSection";
import { mockUser, subscriptionPlans, formatAiModel } from "./account.data";
import type { UserProfile, AIModel, PlanTier, SubscriptionPlan } from "./account.types";
import useGet from "../../../../hooks/useGet.hook";
import axios_api from "../../../../api/axios";

interface BackendAiModelItem {
  id: string;
  model: string;
  modelProvider: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CurrentModelResponse {
  id: string;
  userId: string;
  modelId: string;
  model: BackendAiModelItem;
}

export default function Account() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isLoaded, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // ── Profile states ────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── AI Model & Subscription states ────────────────────────────────────────
  // Tier is fixed to "free" as requested
  const [currentTier] = useState<PlanTier>("free");
  const [activeModelId, setActiveModelId] = useState<string>("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [modelUpdateError, setModelUpdateError] = useState<string | null>(null);
  const [isUpdatingModel, setIsUpdatingModel] = useState(false);
  const [updatingModelId, setUpdatingModelId] = useState<string | null>(null);

  // ── Fetch Available Models & Current Model ─────────────────────────────────
  const {
    data: modelsData,
    loading: isModelsLoading,
    error: modelsError,
    refetch: refetchModels,
  } = useGet<BackendAiModelItem[]>("/ai/model/list");

  const {
    data: currentModelData,
    loading: isCurrentLoading,
    error: currentError,
    refetch: refetchCurrentModel,
  } = useGet<CurrentModelResponse>("/ai/model/current");

  // Transform backend models to UI models
  const aiModels: AIModel[] = useMemo(() => {
    if (!Array.isArray(modelsData)) return [];
    return modelsData.map(formatAiModel);
  }, [modelsData]);

  // Sync active model ID from API
  useEffect(() => {
    if (currentModelData?.modelId) {
      setActiveModelId(currentModelData.modelId);
    } else if (aiModels.length > 0 && !activeModelId) {
      setActiveModelId(aiModels[0].id);
    }
  }, [currentModelData, aiModels, activeModelId]);

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
  const handleSelectModel = async (model: AIModel) => {
    // Prevent random clicking while already updating or if same model
    if (isUpdatingModel || model.id === activeModelId) return;

    const previousModelId = activeModelId;
    setActiveModelId(model.id);
    setIsUpdatingModel(true);
    setUpdatingModelId(model.id);
    setModelUpdateError(null);

    try {
      let token: string | null = null;
      try {
        token = await getToken({ template: "careeros" });
      } catch {
        token = await getToken();
      }

      await axios_api.patch(
        "/ai/model/update",
        { modelId: model.id },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      // Invalidate current model cache in TanStack Query
      await queryClient.invalidateQueries({ queryKey: ["/ai/model/current"] });
    } catch (err: any) {
      console.error("Failed to update AI model:", err);
      setActiveModelId(previousModelId);
      setModelUpdateError(
        err?.response?.data?.message || "Failed to update AI model. Please try again."
      );
    } finally {
      setIsUpdatingModel(false);
      setUpdatingModelId(null);
    }
  };

  // ── Upgrade plan select handler ───────────────────────────────────────────
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setIsUpgradeModalOpen(false);
    console.log("Selected plan:", plan.name);
  };

  // ── Logout handler ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn("Clerk signOut error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // ── Profile Loading state ─────────────────────────────────────────────────
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

  // ── Profile Error state ───────────────────────────────────────────────────
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
            setProfile(
              clerkUser
                ? {
                    firstName: clerkUser.firstName || mockUser.firstName,
                    lastName: clerkUser.lastName || mockUser.lastName,
                    email: clerkUser.primaryEmailAddress?.emailAddress || mockUser.email,
                    avatarUrl: clerkUser.imageUrl || mockUser.avatarUrl,
                  }
                : mockUser
            );
            setLoading(false);
          }}
        />
      </div>
    );
  }

  // ── Empty profile fallback ────────────────────────────────────────────────
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

  const isAiSectionLoading = isModelsLoading || isCurrentLoading;
  const aiSectionError = modelsError || currentError;

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

        {/* Loading Skeleton */}
        {isAiSectionLoading ? (
          <Card>
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-56 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-lg animate-pulse" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border-2 border-slate-100 bg-slate-50/60 space-y-3 animate-pulse"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-slate-200" />
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                    </div>
                    <div className="h-3 w-4/5 bg-slate-200/60 rounded" />
                    <div className="h-4 w-14 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : aiSectionError ? (
          /* Error Card */
          <Card>
            <div className="p-6 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-rose-50 text-rose-500">
                <FiAlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Unable to load AI models</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {aiSectionError}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  refetchModels();
                  refetchCurrentModel();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                <FiRefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          </Card>
        ) : (
          /* Loaded Model Selector */
          <div className="space-y-2">
            {modelUpdateError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center justify-between animate-fadeIn">
                <span>{modelUpdateError}</span>
                <button
                  type="button"
                  onClick={() => setModelUpdateError(null)}
                  className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer text-sm"
                >
                  ×
                </button>
              </div>
            )}
            <AIModelSelector
              models={aiModels}
              activeModelId={activeModelId}
              currentTier={currentTier}
              onSelect={handleSelectModel}
              onUpgradeClick={() => setIsUpgradeModalOpen(true)}
              isUpdating={isUpdatingModel}
              updatingModelId={updatingModelId}
            />
          </div>
        )}
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
