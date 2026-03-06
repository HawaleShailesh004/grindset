import { useState, useEffect, useCallback } from "react";
import type { AiProvider } from "../types";
import { STORAGE_KEYS } from "../constants";

const INITIAL_KEYS = [
  STORAGE_KEYS.GROQ_KEY,
  STORAGE_KEYS.OPENAI_KEY,
  STORAGE_KEYS.AI_PROVIDER,
  STORAGE_KEYS.PREFERRED_LANGUAGE,
] as const;

export function useExtensionStorage() {
  const [userKey, setUserKey] = useState("");
  const [aiProvider, setAiProvider] = useState<AiProvider>("groq");
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    chrome.storage.local.get([...INITIAL_KEYS], (res) => {
      const groq = res[STORAGE_KEYS.GROQ_KEY] as string | undefined;
      const openai = res[STORAGE_KEYS.OPENAI_KEY] as string | undefined;
      const provider = (res[STORAGE_KEYS.AI_PROVIDER] as AiProvider) || "groq";
      const lang = res[STORAGE_KEYS.PREFERRED_LANGUAGE] as string | undefined;
      if (provider === "openai" && openai) setUserKey(openai);
      else if (groq) setUserKey(groq);
      if (provider === "groq" || provider === "openai") setAiProvider(provider);
      if (lang) setLanguage(lang);
    });
  }, []);

  const setLanguageAndPersist = useCallback((val: string) => {
    setLanguage(val);
    chrome.storage.local.set({ [STORAGE_KEYS.PREFERRED_LANGUAGE]: val });
  }, []);

  const setAiProviderAndPersist = useCallback((val: AiProvider) => {
    setAiProvider(val);
    chrome.storage.local.set({ [STORAGE_KEYS.AI_PROVIDER]: val });
  }, []);

  return {
    userKey,
    setUserKey,
    aiProvider,
    setAiProvider: setAiProviderAndPersist,
    language,
    setLanguage: setLanguageAndPersist,
  };
}
