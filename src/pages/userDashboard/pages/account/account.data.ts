import type { UserProfile, AIModel, SubscriptionPlan } from "./account.types";

// ─── Mock user data ──────────────────────────────────────────────────────────
export const mockUser: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  avatarUrl: null,
};

// ─── AI Models available ─────────────────────────────────────────────────────
export const aiModels: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT‑4o Mini",
    description: "Fast & efficient for quick analysis",
    tier: "free",
    icon: "⚡",
  },
  {
    id: "gpt-4o",
    name: "GPT‑4o",
    description: "Balanced speed and intelligence",
    tier: "pro",
    icon: "🧠",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4",
    description: "Advanced reasoning & nuanced outputs",
    tier: "pro",
    icon: "✨",
  },
  {
    id: "gemini-pro",
    name: "Gemini 2.5 Pro",
    description: "Google's flagship multimodal model",
    tier: "enterprise",
    icon: "💎",
  },
];

// ─── Subscription plans ──────────────────────────────────────────────────────
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Starter",
    tier: "free",
    price: "$0",
    period: "forever",
    features: [
      "5 resume analyses / month",
      "GPT‑4o Mini model",
      "Basic ATS scoring",
      "Community support",
    ],
  },
  {
    id: "plan-pro",
    name: "Pro",
    tier: "pro",
    price: "$12",
    period: "/ month",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited resume analyses",
      "GPT‑4o & Claude Sonnet 4",
      "AI cover letter generator",
      "Advanced skill-gap insights",
      "Priority support",
    ],
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    tier: "enterprise",
    price: "$29",
    period: "/ month",
    features: [
      "Everything in Pro",
      "Gemini 2.5 Pro model",
      "Team collaboration (up to 10)",
      "Custom branding & reports",
      "Dedicated account manager",
    ],
  },
];
