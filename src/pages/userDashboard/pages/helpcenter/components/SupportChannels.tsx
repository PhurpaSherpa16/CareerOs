import { useState } from "react";
import { FiPhoneCall, FiCopy, FiCheck, FiClock, FiMail, FiMessageCircle } from "react-icons/fi";
import { Card } from "../../../../../components/Card.UserDashboard";
import type { Helpline } from "../helpCenter.data";

interface SupportChannelsProps {
  helplines: Helpline[];
}

export default function SupportChannels({ helplines }: SupportChannelsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Helpline Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {helplines.map((line) => {
          const isCopied = copiedId === line.id;

          return (
            <Card key={line.id}>
              <div className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-4">
                {/* Header: Title and Type Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-(--primaryBlue) border border-indigo-100 shrink-0">
                      {line.type === "whatsapp" ? (
                        <FiMessageCircle className="w-5 h-5" />
                      ) : (
                        <FiPhoneCall className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                        {line.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{line.description}</p>
                    </div>
                  </div>

                  {line.badge && (
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-indigo-50 text-(--primaryBlue) border border-indigo-100">
                      {line.badge}
                    </span>
                  )}
                </div>

                {/* Number Display & Actions */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Helpline Number
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-800 font-mono tracking-tight">
                      {line.number}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(line.id, line.number)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-(--primaryBlue) hover:border-(--primaryBlue)/40 transition-colors cursor-pointer text-xs"
                      title="Copy number"
                    >
                      {isCopied ? (
                        <FiCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <FiCopy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`tel:${line.number.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-(--primaryBlue) hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <FiPhoneCall className="w-3.5 h-3.5" />
                      Call
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <FiClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{line.hours}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alternative Support Banner (Email & Ticket) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
            <FiMail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Email Help Desk</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Send us detailed logs or screenshots. Average response within 2 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="mailto:support@careeros.ai"
            className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            support@careeros.ai
          </a>
        </div>
      </div>
    </div>
  );
}
