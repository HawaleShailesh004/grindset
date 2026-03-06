import { memo } from "react";

function EmptyChatInner() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-14 px-4 rounded-lg border border-dashed"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3 border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border-2)",
          color: "var(--green)",
        }}
      >
        <span className="text-xl" aria-hidden>💬</span>
      </div>
      <p
        className="font-semibold mb-1"
        style={{ color: "var(--text)", fontSize: "14px" }}
      >
        Start a conversation
      </p>
      <p
        className="max-w-[260px] leading-relaxed"
        style={{ color: "var(--muted)", fontSize: "12px" }}
      >
        Ask a question, request a hint, or tap a quick prompt above.
      </p>
    </div>
  );
}

export const EmptyChat = memo(EmptyChatInner);
