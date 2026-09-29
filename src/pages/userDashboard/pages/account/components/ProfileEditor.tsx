import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { FiCamera, FiSave, FiX, FiEdit2 } from "react-icons/fi";
import { Card } from "../../../../../components/Card.UserDashboard";
import type { UserProfile, LoadingState } from "../account.types";

interface ProfileEditorProps {
  user: UserProfile;
  onSave: (updated: UserProfile) => Promise<void>;
}

export default function ProfileEditor({ user, onSave }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>({ ...user });
  const [preview, setPreview] = useState<string | null>(user.avatarUrl);
  const [saveState, setSaveState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Avatar handling ──────────────────────────────────────────────────────
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setPreview(null);
    setForm((prev) => ({ ...prev, avatarUrl: null }));
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Field change ─────────────────────────────────────────────────────────
  const handleChange = (field: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (form.firstName.trim().length < 2) return "First name must be at least 2 characters.";
    if (form.lastName.trim().length < 2) return "Last name must be at least 2 characters.";
    return null;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaveState("loading");
    setError(null);

    try {
      await onSave({ ...form, avatarUrl: preview });
      setSaveState("success");
      setIsEditing(false);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
      setError("Failed to save changes. Please try again.");
    }
  };

  // ── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = () => {
    setForm({ ...user });
    setPreview(user.avatarUrl);
    setError(null);
    setIsEditing(false);
  };

  // ── Initials fallback ────────────────────────────────────────────────────
  const initials =
    `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase();

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {/* Section title */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Personal Information</h3>
            <p className="text-xs text-slate-400 mt-0.5">Update your name and profile picture</p>
          </div>
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer border border-slate-200">
              <FiEdit2 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        {/* Avatar + Name grid */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-200 bg-linear-to-br from-indigo-100 to-violet-100 grid place-content-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-indigo-400 select-none">
                  {initials || "?"}
                </span>
              )}
            </div>

            {isEditing && (
              <>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-colors cursor-pointer"
                  title="Change avatar">
                  <FiCamera className="w-3.5 h-3.5" />
                </button>

                {preview && (
                  <button type="button" onClick={removeAvatar} className="absolute -top-1 -right-1 p-1 bg-rose-500 hover:bg-rose-600 
                  text-white rounded-full shadow-lg transition-colors cursor-pointer" title="Remove avatar">
                    <FiX className="w-3 h-3" />
                  </button>
                )}
              </>
            )}

            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange}/>
          </div>

          {/* Name fields */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                First Name
              </label>
              {isEditing ? (
                <input type="text" value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-800 transition-all"
                  placeholder="First name"
                  maxLength={30}
                />
              ) : (
                <p className="text-sm font-medium text-slate-800 px-1 py-2">
                  {form.firstName || <span className="text-slate-300 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-800 transition-all"
                  placeholder="Last name"
                  maxLength={30}
                />
              ) : (
                <p className="text-sm font-medium text-slate-800 px-1 py-2">
                  {form.lastName || <span className="text-slate-300 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">
                Email
              </label>
              <p className="text-sm text-slate-500 px-1 py-2 flex items-center gap-1.5">
                {form.email}
                <span className="text-[10px] font-medium bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md border border-emerald-100">
                  Verified
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium animate-fadeIn">
            <FiX className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        {isEditing && (
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saveState === "loading"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--primaryBlue) hover:bg-(--primaryBlue)/90 text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-3.5 h-3.5" />
              {saveState === "loading" ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saveState === "loading"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Success toast */}
        {saveState === "success" && (
          <p className="text-xs font-medium text-emerald-600 animate-fadeIn">
            ✓ Profile updated successfully!
          </p>
        )}
      </form>
    </Card>
  );
}
