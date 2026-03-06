/** Centralized constants. Single source of truth. */

import type { LanguageOption } from "../types";

export const STORAGE_KEYS = {
  GROQ_KEY: "groqKey",
  OPENAI_KEY: "openaiApiKey",
  AI_PROVIDER: "aiProvider",
  GYM_USER_ID: "gymUserId",
  GYM_TOKEN: "gymToken",
  PREFERRED_LANGUAGE: "preferredLanguage",
  THEME: "algolens-theme",
  CHAT_PREFIX: "chat_",
  TIMER_PREFIX: "timer_",
} as const;

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

export const AI_PROVIDER_LABELS: Record<string, string> = {
  groq: "Groq",
  openai: "OpenAI",
};

export const FOOTER_HEIGHT_PX = 32;
export const INPUT_PADDING = "10px 12px 12px";

export const formControlStyles = {
  base: {
    backgroundColor: "var(--surface)",
    borderColor: "var(--border)",
    color: "var(--text)",
  },
  focus: {
    borderColor: "var(--green)",
    boxShadow: "0 0 0 1px var(--green)",
  },
  blur: {
    borderColor: "var(--border)",
    boxShadow: "none",
  },
} as const;
