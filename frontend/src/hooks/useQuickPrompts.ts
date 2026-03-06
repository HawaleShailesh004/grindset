import { useState, useEffect } from "react";
import type { QuickPromptItem, SettingsResponse } from "../types";
import { fetchSettings } from "../utils/api";

export function useQuickPrompts(token: string | null) {
  const [quickPrompts, setQuickPrompts] = useState<QuickPromptItem[] | null>(null);

  useEffect(() => {
    if (!token) {
      setQuickPrompts(null);
      return;
    }
    fetchSettings(token)
      .then((res) => (res.ok ? (res.json() as Promise<SettingsResponse>) : null))
      .then((data) => {
        if (!data) {
          setQuickPrompts(null);
          return;
        }
        if (Array.isArray(data.quickPrompts) && data.quickPrompts.length > 0) {
          setQuickPrompts(data.quickPrompts);
        } else {
          setQuickPrompts(null);
        }
      })
      .catch(() => setQuickPrompts(null));
  }, [token]);

  return quickPrompts;
}
