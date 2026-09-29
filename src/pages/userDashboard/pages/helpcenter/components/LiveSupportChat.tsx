import { useState, useRef, useEffect, type FormEvent } from "react";
import { FiSend, FiUser, FiHeadphones } from "react-icons/fi";
import { Card } from "../../../../../components/Card.UserDashboard";
import type { ChatMessage } from "../helpCenter.data";
import Icons from "../../../../../utils/Icons";

interface LiveSupportChatProps {
  initialMessages: ChatMessage[];
  quickPrompts: string[];
}

export default function LiveSupportChat({
  initialMessages,
  quickPrompts,
}: LiveSupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateReply = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    if (q.includes("ats") || q.includes("score")) {
      return "Our ATS scoring checks keyword frequency, hard skills vs job requirements, formatting cleanliness, and section hierarchy. Aim for 80%+ match rate!";
    }
    if (q.includes("model") || q.includes("gpt") || q.includes("claude")) {
      return "You can switch between GPT-4o Mini, GPT-4o, Claude Sonnet 4, and Gemini 2.5 Pro inside your Account settings tab under 'AI Model & Subscription'.";
    }
    if (q.includes("pdf") || q.includes("download") || q.includes("export")) {
      return "You can export full analysis reports as PDF directly from the Analysis Report page using the top right 'Export PDF' button.";
    }
    if (q.includes("bill") || q.includes("upgrade") || q.includes("price") || q.includes("plan")) {
      return "You can upgrade or manage your tier under Account settings. Pro is $12/month and Enterprise is $29/month.";
    }
    return `Thank you for reaching out! Regarding "${userQuery}", our team has noted this inquiry. For urgent issues, feel free to call our priority helpline at +1 (888) 789-9800.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");

    // Simulate agent response
    setIsTyping(true);
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: generateReply(query),
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <Card>
      <div className="flex flex-col h-[520px] rounded-2xl overflow-hidden bg-white">
        {/* Chat Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-(--primaryBlue) flex items-center justify-center text-white">
                <FiHeadphones className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">CareerOS Support Agent</h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Typical reply time: instant
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[11px] text-slate-400 font-medium">Session ID:</span>
            <p className="text-xs font-mono text-slate-300">#COS-8842</p>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAgent = msg.sender === "agent";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isAgent ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAgent
                      ? "bg-indigo-100 text-(--primaryBlue)"
                      : "bg-(--primaryBlue) text-white"
                  }`}
                >
                  {isAgent ? <FiHeadphones className="w-4 h-4" /> : <FiUser className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isAgent
                        ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                        : "bg-(--primaryBlue) text-white rounded-tr-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[10px] text-slate-400 px-1 ${
                      isAgent ? "justify-start" : "justify-end"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isAgent && <Icons name="check" className="text-indigo-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center mr-auto">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-(--primaryBlue) flex items-center justify-center shrink-0">
                <FiHeadphones className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
            Quick Ask:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-xs shrink-0 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-(--primaryBlue) text-slate-600 border border-slate-200/80 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question or issue here..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-xs sm:text-sm text-slate-800 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-(--primaryBlue) hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FiSend className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </Card>
  );
}
