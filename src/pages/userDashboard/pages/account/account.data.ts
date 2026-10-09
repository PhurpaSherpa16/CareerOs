import type { UserProfile, AIModel, SubscriptionPlan } from "./account.types";

// ─── Mock user data ──────────────────────────────────────────────────────────
export const mockUser: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  avatarUrl: null,
};

// ─── Format backend AI model to UI AIModel ───────────────────────────────────
export const formatAiModel = (item: {
  id: string;
  model: string;
  modelProvider: string;
}): AIModel => {
  const normalizedModel = item.model.toLowerCase();

  let name = item.model;
  let description = `Powered by ${item.modelProvider}`;
  let icon = "🤖";

  if (normalizedModel.includes("openrouter")) {
    name = "OpenRouter Free";
    description = "Fast, efficient AI model via OpenRouter";
    icon = "⚡";
  } else if (normalizedModel.includes("deepseek")) {
    name = "DeepSeek V4 Flash";
    description = "High precision, fast deep-reasoning model";
    icon = "🧠";
  } else if (normalizedModel.includes("qwen")) {
    name = "Qwen 3.4B Instruct";
    description = "Optimized instruction-tuned language model";
    icon = "✨";
  } else {
    name = item.model.charAt(0).toUpperCase() + item.model.slice(1);
    description = `Model provided by ${item.modelProvider}`;
  }

  return {
    id: item.id, 
    name,
    description,
    tier: "free",
    icon,
  };
};

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
      "OpenRouter Free model",
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
      "DeepSeek & Qwen models",
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
      "Custom fine-tuned models",
      "Team collaboration (up to 10)",
      "Custom branding & reports",
      "Dedicated account manager",
    ],
  },
];
