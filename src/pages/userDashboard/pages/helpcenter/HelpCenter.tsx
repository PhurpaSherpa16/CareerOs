import HeaderUserDashboard from "../../../../components/Header.UserDashboard";
import { Heading } from "../../../../components/Heading.UserDashboard";
import SupportChannels from "./components/SupportChannels";
import LiveSupportChat from "./components/LiveSupportChat";
import SupportCategories from "./components/SupportCategories";
import {
  helplinesData,
  supportCategoriesData,
  initialChatMessages,
  quickPrompts,
} from "./helpCenter.data";
import { FiCheckCircle, FiClock } from "react-icons/fi";

export default function HelpCenter() {
  return (
    <div className="mainDiv space-y-8 pb-12">
      {/* Top Page Header */}
      <HeaderUserDashboard
        title="Help Center"
        subTitle="Direct helpline numbers, interactive AI support chat, and self-service guides"
      />

      {/* Status Highlight Banner */}
      <div className="rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Support Desks Online
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            How can our support team assist you today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Reach out via our toll-free lines, start a live chat, or browse our knowledge guides.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-slate-200">
            <FiClock className="w-4 h-4 text-indigo-300" />
            <span>Avg Wait: <strong className="text-white">&lt; 2 min</strong></span>
          </div>
          <span className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-slate-200">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Resolution: <strong className="text-white">99.4%</strong></span>
          </div>
        </div>
      </div>

      {/* Helplines Section */}
      <div className="space-y-4">
        <Heading label="Helpline Numbers & Phone Support" />
        <SupportChannels helplines={helplinesData} />
      </div>

      {/* Live Chat Section */}
      <div className="space-y-4">
        <Heading label="Live Support Assistant" />
        <LiveSupportChat
          initialMessages={initialChatMessages}
          quickPrompts={quickPrompts}
        />
      </div>

      {/* Common Help Categories */}
      <div className="space-y-4">
        <Heading label="Knowledge Base & Guides" />
        <SupportCategories categories={supportCategoriesData} />
      </div>
    </div>
  );
}
