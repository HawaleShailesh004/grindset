import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../constants";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(
      [STORAGE_KEYS.GYM_USER_ID, STORAGE_KEYS.GYM_TOKEN],
      (res) => {
        const id = res[STORAGE_KEYS.GYM_USER_ID] as string | undefined;
        const t = res[STORAGE_KEYS.GYM_TOKEN] as string | undefined;
        if (id) setUserId(id);
        if (t) setToken(t);
        setIsAuthChecking(false);
      }
    );
  }, []);

  const handleLoginSuccess = useCallback((id: string, authToken: string) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.GYM_USER_ID]: id,
      [STORAGE_KEYS.GYM_TOKEN]: authToken,
    });
    setUserId(id);
    setToken(authToken);
  }, []);

  const handleLogout = useCallback(() => {
    if (!confirm("Log out?")) return;
    chrome.storage.local.remove([STORAGE_KEYS.GYM_USER_ID, STORAGE_KEYS.GYM_TOKEN]);
    setUserId(null);
    setToken(null);
  }, []);

  return {
    userId,
    token,
    isAuthChecking,
    handleLoginSuccess,
    handleLogout,
    isAuthenticated: !!userId,
  };
}
