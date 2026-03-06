import { memo } from "react";
import { FOOTER_HEIGHT_PX } from "../constants";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface ChatFooterProps {
  hasOwnApiKey: boolean;
  timeTakenSeconds: number;
}

function ChatFooterInner({ hasOwnApiKey, timeTakenSeconds }: ChatFooterProps) {
  return (
    <footer
      className="shrink-0 flex items-center justify-between border-t px-3"
      style={{
        height: FOOTER_HEIGHT_PX + "px",
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
        fontFamily: "var(--mono)",
        fontSize: "10px",
        color: "var(--muted)",
      }}
    >
      <span>
        {hasOwnApiKey ? (
          <span style={{ color: "var(--green)" }}>● Unlimited</span>
        ) : (
          "Community pool"
        )}
      </span>
      {timeTakenSeconds > 0 && (
        <span className="tabular-nums" style={{ color: "var(--green)" }}>
          Stopwatch {formatTime(timeTakenSeconds)}
        </span>
      )}
    </footer>
  );
}

export const ChatFooter = memo(ChatFooterInner);
