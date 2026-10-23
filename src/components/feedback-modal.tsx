"use client";

import * as React from "react";
import { useActionState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/feedback";

interface FeedbackModalProps {
  locale?: string;
  defaultOpen?: boolean;
  onClose?: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function FeedbackModal({
  locale = "id",
  defaultOpen = false,
  onClose,
  user,
}: FeedbackModalProps) {
  const isEn = locale === "en";
  const [open, setOpen] = React.useState(defaultOpen);
  const [state, formAction, isPending] = useActionState(
    submitFeedbackAction,
    null
  );
  const [category, setCategory] = React.useState("general");
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  const handleOpen = () => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const categories = [
    { id: "general", label: isEn ? "General" : "Umum" },
    { id: "bug", label: isEn ? "Bug Report" : "Laporan Bug" },
    { id: "skill_request", label: isEn ? "Skill Request" : "Permintaan Skill" },
    { id: "ux", label: isEn ? "UI / Design" : "Saran UI/UX" },
    { id: "other", label: isEn ? "Other" : "Lainnya" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isEn ? "Feedback" : "Umpan Balik"}</span>
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/70 text-muted-foreground">
          {isEn ? "Direct" : "Langsung"}
        </span>
      </button>

      {open && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="fixed inset-0"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[6px] bg-foreground text-background flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-background" />
                </div>
                <div>
                  <h2
                    id="feedback-modal-title"
                    className="text-sm font-semibold text-foreground tracking-tight"
                  >
                    {isEn ? "Send Feedback" : "Kirim Umpan Balik"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    {isEn
                      ? "Directly received and reviewed by the admin team"
                      : "Diterima dan ditinjau langsung oleh tim pengembang"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 rounded-[6px] border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {state?.success ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {isEn ? "Feedback Received!" : "Umpan Balik Terkirim!"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    {isEn
                      ? "Thank you for helping us improve ProSkillAI. Your feedback has been forwarded to the admin panel."
                      : "Terima kasih telah berkontribusi memajukan ProSkillAI. Pesan Anda telah tersimpan di panel admin."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 inline-flex items-center justify-center h-8 px-4 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
                >
                  {isEn ? "Close" : "Tutup"}
                </button>
              </div>
            ) : (
              <form action={formAction} className="mt-4 space-y-4">
                <input type="hidden" name="url" value={currentUrl} />
                <input type="hidden" name="category" value={category} />

                {state?.error && (
                  <div className="p-2.5 rounded-[6px] border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    {isEn ? "Category" : "Kategori Umpan Balik"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`h-7 px-2.5 rounded-[5px] text-xs font-medium border transition-all cursor-pointer ${
                          category === c.id
                            ? "bg-foreground text-background border-foreground font-semibold shadow-2xs"
                            : "bg-surface hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="feedback-message"
                    className="block text-xs font-medium text-foreground mb-1.5"
                  >
                    {isEn ? "Your Message / Feedback" : "Pesan atau Masukan"} *
                  </label>
                  <textarea
                    id="feedback-message"
                    name="message"
                    required
                    rows={4}
                    placeholder={
                      isEn
                        ? "Describe your suggestion, bug encountered, or skill request..."
                        : "Tuliskan saran, kendala teknis yang dialami, atau skill yang ingin ditambahkan..."
                    }
                    className="w-full p-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground transition-all leading-relaxed placeholder:text-muted-foreground/60 resize-y min-h-[90px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="feedback-user-name"
                      className="block text-[11px] font-medium text-muted-foreground mb-1"
                    >
                      {isEn ? "Your Name (Optional)" : "Nama Anda (Opsional)"}
                    </label>
                    <input
                      id="feedback-user-name"
                      name="userName"
                      type="text"
                      defaultValue={user?.name || ""}
                      placeholder={isEn ? "e.g. Alex" : "mis. Budi"}
                      className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="feedback-user-email"
                      className="block text-[11px] font-medium text-muted-foreground mb-1"
                    >
                      {isEn ? "Email (Optional)" : "Email Anda (Opsional)"}
                    </label>
                    <input
                      id="feedback-user-email"
                      name="userEmail"
                      type="email"
                      defaultValue={user?.email || ""}
                      placeholder="email@example.com"
                      className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/80">
                  <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                    {currentUrl.replace(/^https?:\/\/[^/]+/, "") || "/"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="h-8 px-3 rounded-[6px] border border-border text-foreground hover:bg-muted text-xs font-medium cursor-pointer"
                    >
                      {isEn ? "Cancel" : "Batal"}
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>
                        {isPending
                          ? isEn
                            ? "Sending..."
                            : "Mengirim..."
                          : isEn
                          ? "Submit"
                          : "Kirim Umpan Balik"}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
