import { memo } from "react";
import { Send, Code2 } from "lucide-react";
import { applyFocusStyles, applyBlurStyles, applyCardButtonHover } from "../utils/formStyles";
import { INPUT_PADDING } from "../constants";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onOpenLogger: () => void;
  isLoading: boolean;
  placeholder?: string;
}

function ChatInputBarInner({
  value,
  onChange,
  onSend,
  onOpenLogger,
  isLoading,
  placeholder = "Ask a question or request a hint…",
}: ChatInputBarProps) {
  const canSend = value.trim().length > 0 && !isLoading;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
    if (e.key === "Escape") onChange("");
  };

  return (
    <div
      className="shrink-0 border-t"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        padding: INPUT_PADDING,
      }}
    >
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={onOpenLogger}
          title="Log Workout"
          className="shrink-0 p-2.5 border rounded-md transition-all"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--text-2)",
          }}
          onMouseEnter={(e) => applyCardButtonHover(e, true)}
          onMouseLeave={(e) => applyCardButtonHover(e, false)}
        >
          <Code2 size={16} />
        </button>
        <div className="relative flex-1 min-w-0">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full rounded-md pl-3 pr-11 py-2.5 text-sm outline-none transition-all border resize-none"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
              fontFamily: "var(--mono)",
              fontSize: "13px",
            }}
            onFocus={applyFocusStyles}
            onBlur={applyBlurStyles}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            title="Send"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md flex items-center justify-center transition-all disabled:opacity-40"
            style={{
              backgroundColor: canSend ? "var(--green)" : "transparent",
              color: canSend ? "#000000" : "var(--text-2)",
            }}
            onMouseEnter={(e) => {
              if (canSend) e.currentTarget.style.backgroundColor = "var(--green-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = canSend ? "var(--green)" : "transparent";
            }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const ChatInputBar = memo(ChatInputBarInner);
