// ─── User Profile ────────────────────────────────────────────────────────────
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

// ─── AI Model & Subscription ─────────────────────────────────────────────────
export type PlanTier = "free" | "pro" | "enterprise";

export interface AIModel {
  id: string;
  name: string;
  description: string;
  tier: PlanTier;
  icon: string; // emoji or icon key
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PlanTier;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

// ─── Component state helpers ─────────────────────────────────────────────────
export type LoadingState = "idle" | "loading" | "success" | "error";
