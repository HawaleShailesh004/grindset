/** Shared types. Naming: entities (nouns), handlers (handle*), callbacks (on*). */

export type AiProvider = "groq" | "openai";

export interface QuickPromptItem {
  label: string;
  text: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  isError?: boolean;
}

export interface ProblemContext {
  title: string;
  difficulty: string;
  description: string;
}

export interface SettingsResponse {
  quickPrompts?: QuickPromptItem[];
  preferredLanguage?: string;
  aiProvider?: AiProvider;
}

export interface LanguageOption {
  value: string;
  label: string;
}
