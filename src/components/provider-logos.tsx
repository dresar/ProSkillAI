import * as React from "react";

export type ProviderId =
  | "anthropic"
  | "openai"
  | "gemini"
  | "cursor"
  | "cmdc"
  | "deepseek";

interface ProviderLogoProps {
  provider: ProviderId;
  className?: string;
}

function AnthropicMark() {
  return (
    <g fill="currentColor">
      <rect x="11" y="2.5" width="2" height="19" rx="1" />
      <rect x="11" y="2.5" width="2" height="19" rx="1" transform="rotate(60 12 12)" />
      <rect x="11" y="2.5" width="2" height="19" rx="1" transform="rotate(120 12 12)" />
    </g>
  );
}

function OpenAIMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.6c2.6 2.2 4.2 4.3 4.2 6.6 0 1.9-.8 3.4-2.1 4.6" />
      <path d="M12 21.4c-2.6-2.2-4.2-4.3-4.2-6.6 0-1.9.8-3.4 2.1-4.6" />
      <path d="M9.4 4.2c2.9.2 5.3 1 7 2.6" />
      <path d="M14.6 19.8c-2.9-.2-5.3-1-7-2.6" />
      <circle cx="12" cy="12" r="2.1" />
    </g>
  );
}

function GeminiMark() {
  return (
    <path
      fill="currentColor"
      d="M12 1.8c.6 5.2 3.4 8.4 8.4 9.2-5 .8-7.8 4-8.4 9.2-.6-5.2-3.4-8.4-8.4-9.2 5-.8 7.8-4 8.4-9.2z"
    />
  );
}

function CursorMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3.2 20.2 7.6v8.8L12 20.8 3.8 16.4V7.6z" />
      <path d="M3.8 7.6 12 12l8.2-4.4M12 12v8.8" />
    </g>
  );
}

function CmdcMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.8" y="4.4" width="18.4" height="15.2" rx="3.2" />
      <path d="M8.4 9.6 11 12l-2.6 2.4" />
      <path d="M12.6 14.6h3.4" />
    </g>
  );
}

function DeepSeekMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.4 8.6c2.6-2 5.6-2.6 7.6-2.2 2.4.5 3.6 2.4 3.2 4.6-.3 1.9-1.7 3.1-3.6 3.4" />
      <path d="M6.6 12.6c-1 .9-1.1 2.1-.4 3.1.9 1.3 2.9 1.7 4.8 1.2 1.6-.4 3-1.3 4-2.4" />
      <circle cx="15.6" cy="8.4" r="1.1" fill="currentColor" stroke="none" />
    </g>
  );
}

const MARKS: Record<ProviderId, () => React.JSX.Element> = {
  anthropic: AnthropicMark,
  openai: OpenAIMark,
  gemini: GeminiMark,
  cursor: CursorMark,
  cmdc: CmdcMark,
  deepseek: DeepSeekMark,
};

export function ProviderLogo({ provider, className }: ProviderLogoProps) {
  const Mark = MARKS[provider];
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Mark />
    </svg>
  );
}

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  anthropic: "Anthropic Claude",
  openai: "OpenAI ChatGPT",
  gemini: "Google Gemini",
  cursor: "Cursor",
  cmdc: "Command Code",
  deepseek: "DeepSeek",
};

interface ProviderBadgeProps {
  provider: ProviderId;
  className?: string;
}

export function ProviderBadge({ provider, className }: ProviderBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground ${className ?? ""}`}
      title={PROVIDER_LABELS[provider]}
    >
      <ProviderLogo provider={provider} className="w-3.5 h-3.5 text-foreground" />
      <span>{PROVIDER_LABELS[provider]}</span>
    </span>
  );
}
