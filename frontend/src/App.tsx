import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { useProblemContext } from "./hooks/useProblemContext";
import { useChatStream } from "./hooks/useChatStream";
import { useAuth } from "./hooks/useAuth";
import { useExtensionStorage } from "./hooks/useExtensionStorage";
import { useQuickPrompts } from "./hooks/useQuickPrompts";

import { Header } from "./components/Header";
import { MessageBubble } from "./components/MessageBubble";
import { QuickPrompts } from "./components/QuickPrompts";
import { WorkoutLogger } from "./components/WorkoutLogger";
import { Dashboard } from "./components/Dashboard";
import { Timer } from "./components/Timer";
import { Login } from "./components/Login";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { EmptyChat } from "./components/EmptyChat";
import { ThinkingIndicator } from "./components/ThinkingIndicator";
import { ChatFooter } from "./components/ChatFooter";
import { ChatInputBar } from "./components/ChatInputBar";

import { STORAGE_KEYS } from "./constants";

export default function App() {
  const { slug, problemData } = useProblemContext();
  const {
    userId,
    token,
    isAuthChecking,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();
  const {
    userKey,
    setUserKey,
    aiProvider,
    setAiProvider,
    language,
    setLanguage,
  } = useExtensionStorage();
  const quickPromptsFromApi = useQuickPrompts(token);

  const [showSettings, setShowSettings] = useState(false);
  const [showLogger, setShowLogger] = useState(false);
  const [showTimerOverlay, setShowTimerOverlay] = useState(false);
  const [input, setInput] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const problemContext = useMemo(
    () => ({
      title: problemData?.questionTitle ?? problemData?.title ?? "",
      difficulty: problemData?.difficulty ?? "",
      description: problemData?.content ?? problemData?.question ?? "",
    }),
    [
      problemData?.questionTitle,
      problemData?.title,
      problemData?.difficulty,
      problemData?.content,
      problemData?.question,
    ]
  );

  const { messages, loading, sendMessage, setMessages } = useChatStream(
    problemData,
    userKey,
    slug,
    token
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const openSettings = useCallback(() => setShowSettings(true), []);
  const toggleTimerOverlay = useCallback(() => setShowTimerOverlay((v) => !v), []);
  const closeTimerOverlay = useCallback(() => setShowTimerOverlay(false), []);
  const closeLogger = useCallback(() => setShowLogger(false), []);

  const handleClearChat = useCallback(() => {
    if (!confirm("Clear conversation?")) return;
    setMessages([]);
    if (slug) chrome.storage.local.remove([`${STORAGE_KEYS.CHAT_PREFIX}${slug}`]);
  }, [slug, setMessages]);

  const handleSendMessage = useCallback(
    (text?: string) => {
      const toSend = (text ?? input).trim();
      if (!toSend) return;
      sendMessage(toSend);
      setInput("");
    },
    [input, sendMessage]
  );

  const onSelectPrompt = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      sendMessage(text);
      setInput("");
    },
    [sendMessage]
  );

  const toggleSettings = useCallback(() => setShowSettings((s) => !s), []);

  if (isAuthChecking) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <Loader2 className="animate-spin" style={{ color: "var(--green)" }} />
      </div>
    );
  }

  if (!userId) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (!slug) {
    return <Dashboard userId={userId} token={token} onLogout={handleLogout} />;
  }

  return (
    <div
      className="h-screen flex flex-col font-sans"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <Header
        title={problemData?.title ?? "Unknown Problem"}
        difficulty={problemData?.difficulty ?? "Unknown"}
        onToggleTimer={toggleTimerOverlay}
        onSettings={toggleSettings}
        onClear={handleClearChat}
        onLogout={handleLogout}
      />

      <SettingsDrawer
        isOpen={showSettings}
        aiProvider={aiProvider}
        setAiProvider={setAiProvider}
        userKey={userKey}
        setUserKey={setUserKey}
        language={language}
        setLanguage={setLanguage}
        token={token}
        onClose={() => setShowSettings(false)}
      />

      {!loading && (
        <div
          className="shrink-0 overflow-x-auto overflow-y-hidden border-b"
          style={{
            padding: "8px 12px 4px",
            backgroundColor: "var(--bg)",
            borderColor: "var(--border)",
          }}
        >
          <QuickPrompts onSelect={onSelectPrompt} prompts={quickPromptsFromApi} />
        </div>
      )}

      <div className="flex-1 min-h-0 relative flex flex-col">
        <Timer
          slug={slug}
          difficulty={problemData?.difficulty ?? "Medium"}
          onTimeUpdate={setTimeTaken}
          showOverlay={showTimerOverlay}
          onClose={closeTimerOverlay}
        />
        <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-2">
          {messages.length === 0 && <EmptyChat />}
          <div className="space-y-4">
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                role={m.role}
                content={m.content}
                isError={m.isError}
                onAction={openSettings}
              />
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <ThinkingIndicator />
            )}
          </div>
          <div ref={scrollRef} />
        </div>
      </div>

      {showLogger ? (
        <WorkoutLogger
          slug={slug}
          title={problemData?.title}
          token={token}
          onLogComplete={closeLogger}
          messages={messages}
          problemContext={problemContext}
          onCancel={closeLogger}
          timeTaken={timeTaken}
          language={language}
        />
      ) : (
        <ChatInputBar
          value={input}
          onChange={setInput}
          onSend={() => handleSendMessage()}
          onOpenLogger={() => setShowLogger(true)}
          isLoading={loading}
        />
      )}

      <ChatFooter
        hasOwnApiKey={!!userKey.trim()}
        timeTakenSeconds={timeTaken}
      />
    </div>
  );
}
