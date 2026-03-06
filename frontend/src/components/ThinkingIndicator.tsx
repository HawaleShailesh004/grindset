import { Loader2 } from "lucide-react";
import { memo } from "react";

function ThinkingIndicatorInner() {
  return (
    <div
      className="flex items-start gap-2 py-1"
      style={{ color: "var(--text-2)", fontSize: "13px" }}
    >
      <div
        className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--green)" }} />
      </div>
      <div
        className="px-3 py-2 rounded border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          fontFamily: "var(--mono)",
        }}
      >
        Thinking…
      </div>
    </div>
  );
}

export const ThinkingIndicator = memo(ThinkingIndicatorInner);
