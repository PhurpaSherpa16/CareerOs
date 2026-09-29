export interface Helpline {
  id: string;
  title: string;
  number: string;
  description: string;
  hours: string;
  badge?: string;
  type: "toll-free" | "priority" | "international" | "whatsapp";
}

export interface SupportCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  articlesCount: number;
}

export interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
}

export const helplinesData: Helpline[] = [
  {
    id: "line-1",
    title: "General Toll-Free Support",
    number: "+1 (800) 555-2273",
    description: "Assistance with platform navigation, account setup, and general queries.",
    hours: "Mon – Fri: 24 Hours (EST)",
    badge: "Toll Free",
    type: "toll-free",
  },
  {
    id: "line-2",
    title: "Priority Technical Support",
    number: "+1 (888) 789-9800",
    description: "Dedicated line for resume parsing issues, API errors, and high-priority fixes.",
    hours: "24/7 Available",
    badge: "Pro & Enterprise",
    type: "priority",
  },
  {
    id: "line-3",
    title: "International Helpline",
    number: "+44 20 7946 0991",
    description: "Direct connection for users calling outside North America.",
    hours: "Mon – Sat: 8:00 AM – 8:00 PM GMT",
    type: "international",
  },
  {
    id: "line-4",
    title: "WhatsApp Quick Helpline",
    number: "+1 (415) 555-0199",
    description: "Chat directly with our support team on WhatsApp for fast answers.",
    hours: "Instant Replies (Avg 3 mins)",
    badge: "Fastest",
    type: "whatsapp",
  },
];

export const supportCategoriesData: SupportCategory[] = [
  {
    id: "cat-1",
    title: "Resume & ATS Optimization",
    description: "Learn how our ATS scoring engine evaluates formatting, keywords, and density.",
    iconName: "resume",
    articlesCount: 14,
  },
  {
    id: "cat-2",
    title: "Job Matching & Tracker",
    description: "How to save jobs, sync applications, and interpret job compatibility scores.",
    iconName: "job",
    articlesCount: 9,
  },
  {
    id: "cat-3",
    title: "AI Models & Accuracy",
    description: "Comparing GPT-4o, Claude Sonnet 4, and Gemini Pro for resume rewriting.",
    iconName: "ai",
    articlesCount: 12,
  },
  {
    id: "cat-4",
    title: "Account, Billing & Plans",
    description: "Manage your subscription, invoice history, payment methods, and upgrades.",
    iconName: "settings",
    articlesCount: 8,
  },
];

export const quickPrompts = [
  "How does ATS score calculation work?",
  "Why is my resume preview formatting different?",
  "How do I switch AI models?",
  "How can I download analysis as PDF?",
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "agent",
    text: "Hello! Welcome to CareerOS Help Center. I'm Alex from customer support.",
    timestamp: "Just now",
  },
  {
    id: "msg-2",
    sender: "agent",
    text: "How can I help you today? You can choose a quick question below or type your inquiry directly.",
    timestamp: "Just now",
  },
];
