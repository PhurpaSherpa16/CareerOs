import { useState, useMemo } from "react";
import { FiCheck, FiCpu, FiArrowRight } from "react-icons/fi";
import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import useGet from "../../../hooks/useGet.hook";
import { formatAiModel } from "../pages/account/account.data";
import axios_api from "../../../api/axios";
import type { AIModel } from "../pages/account/account.types";

interface AIModelSelectionModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  userId?: string;
}

interface BackendModelItem {
  id: string;
  model: string;
  modelProvider: string;
}

export default function AIModelSelectionModal({
  isOpen,
  onSuccess,
  userId,
}: AIModelSelectionModalProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available AI models
  const {
    data: modelsData,
    loading: modelsLoading,
    error: modelsError,
  } = useGet<BackendModelItem[]>("/ai/model/list", { enabled: isOpen });

  const models: AIModel[] = useMemo(() => {
    if (!Array.isArray(modelsData)) return [];
    return modelsData.map(formatAiModel);
  }, [modelsData]);

  // Set default selection when models load
  useMemo(() => {
    if (models.length > 0 && !selectedModelId) {
      setSelectedModelId(models[0].id);
    }
  }, [models, selectedModelId]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedModelId || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      let token: string | null = null;
      try {
        token = await getToken({ template: "careeros" });
      } catch {
        token = await getToken();
      }

      await axios_api.post(
        "/ai/model/create",
        { modelId: selectedModelId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      // Set registration markers in localStorage
      localStorage.setItem("userRegistered", "true");
      if (userId) {
        localStorage.setItem("registeredId", userId);
      }

      // Invalidate queries so dashboard & account update instantly
      await queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      await queryClient.invalidateQueries({ queryKey: ["/ai/model/current"] });

      onSuccess();
    } catch (err: any) {
      console.error("Error setting initial AI model:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to save AI model choice. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scaleUp">
        {/* Top Header Glow */}
        <div className="h-2 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Title */}
          <div className="space-y-2 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-1">
              <FiCpu className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Choose Your AI Model
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Welcome to CareerOS! Please select the AI model to power your resume &
              job description analyses.
            </p>
          </div>

          {/* Error notice */}
          {(error || modelsError) && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 animate-fadeIn">
              {error || modelsError}
            </div>
          )}

          {/* Model Selection Grid */}
          <div className="space-y-3">
            {modelsLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 animate-pulse flex items-center justify-between"
                  >
                    <div className="space-y-2 w-3/4">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-48 bg-slate-200/60 rounded" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : models.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400">
                No models available right now.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {models.map((model) => {
                  const isSelected = model.id === selectedModelId;

                  return (
                    <button
                      key={model.id}
                      type="button"
                      disabled={submitting}
                      onClick={() => setSelectedModelId(model.id)}
                      className={`
                        w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex items-center justify-between group
                        ${submitting ? "opacity-60 cursor-not-allowed" : ""}
                        ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/60 shadow-sm shadow-indigo-100"
                            : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3.5 pr-4">
                        <span className="text-2xl">{model.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {model.name}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
                              Free
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {model.description}
                          </p>
                        </div>
                      </div>

                      {/* Selection Check Circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                          ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 group-hover:border-slate-400"
                          }
                        `}
                      >
                        {isSelected && <FiCheck className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!selectedModelId || submitting || modelsLoading}
              onClick={handleConfirm}
              className={`
                w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer
                ${
                  !selectedModelId || submitting || modelsLoading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-[0.99]"
                }
              `}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving your selection...</span>
                </>
              ) : (
                <>
                  <span>Continue with Selected Model</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              You can switch your AI model anytime from Account Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
