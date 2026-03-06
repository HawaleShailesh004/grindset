import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AiProvider } from "../types";
import { LANGUAGE_OPTIONS, AI_PROVIDER_LABELS, STORAGE_KEYS, formControlStyles } from "../constants";
import { patchSettings } from "../utils/api";
import { applyFocusStyles, applyBlurStyles, applyGreenButtonHover } from "../utils/formStyles";

interface SettingsDrawerProps {
  isOpen: boolean;
  aiProvider: AiProvider;
  setAiProvider: (v: AiProvider) => void;
  userKey: string;
  setUserKey: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  token: string | null;
  onClose: () => void;
}

function SettingsDrawerInner({
  isOpen,
  aiProvider,
  setAiProvider,
  userKey,
  setUserKey,
  language,
  setLanguage,
  token,
  onClose,
}: SettingsDrawerProps) {
  const baseInputStyle = formControlStyles.base;

  const handleAiProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as AiProvider;
    if (val !== "groq" && val !== "openai") return;
    setAiProvider(val);
    chrome.storage.local.set({ [STORAGE_KEYS.AI_PROVIDER]: val });
    if (token) {
      patchSettings(token, { aiProvider: val }).catch(() => {});
    }
  };

  const handleSaveApiKey = () => {
    const keyName = aiProvider === "groq" ? STORAGE_KEYS.GROQ_KEY : STORAGE_KEYS.OPENAI_KEY;
    chrome.storage.local.set({ [keyName]: userKey });
    onClose();
    if (token) {
      const body =
        aiProvider === "groq"
          ? { groqApiKey: userKey.trim() || null }
          : { openaiApiKey: userKey.trim() || null };
      patchSettings(token, body).catch(() => {});
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLanguage(val);
    chrome.storage.local.set({ [STORAGE_KEYS.PREFERRED_LANGUAGE]: val });
    if (token) patchSettings(token, { preferredLanguage: val }).catch(() => {});
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="border-b overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="p-4 space-y-2">
          <label
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-2)" }}
          >
            AI Provider & API Key
          </label>
          <div className="mb-2">
            <select
              value={aiProvider}
              onChange={handleAiProviderChange}
              className="w-full rounded-md px-3 py-1.5 text-xs outline-none transition-all border"
              style={baseInputStyle}
              onFocus={applyFocusStyles}
              onBlur={applyBlurStyles}
            >
              <option value="groq" style={baseInputStyle}>
                {AI_PROVIDER_LABELS.groq}
              </option>
              <option value="openai" style={baseInputStyle}>
                {AI_PROVIDER_LABELS.openai}
              </option>
            </select>
          </div>
          <label
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-2)" }}
          >
            {AI_PROVIDER_LABELS[aiProvider]} API Key (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              placeholder={aiProvider === "groq" ? "gsk_..." : "sk-..."}
              className="flex-1 rounded-md px-3 py-1.5 text-xs outline-none transition-colors border"
              style={baseInputStyle}
              onFocus={applyFocusStyles}
              onBlur={applyBlurStyles}
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
              style={{ backgroundColor: "var(--green)", color: "#000000" }}
              onMouseEnter={(e) => applyGreenButtonHover(e, true)}
              onMouseLeave={(e) => applyGreenButtonHover(e, false)}
            >
              Save
            </button>
          </div>
        </div>
        <div className="p-4 space-y-2 mt-2">
          <label
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-2)" }}
          >
            Preferred Language
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full rounded-md px-3 py-1.5 text-xs outline-none transition-all border"
            style={baseInputStyle}
            onFocus={applyFocusStyles}
            onBlur={applyBlurStyles}
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={baseInputStyle}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export const SettingsDrawer = memo(SettingsDrawerInner);
