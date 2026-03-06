/**
 * Shared inline style helpers for form controls (focus ring, etc.).
 * Use in event handlers to avoid repeated object literals.
 */

export function applyFocusStyles(
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
): void {
  const t = e.currentTarget;
  t.style.borderColor = "var(--green)";
  t.style.boxShadow = "0 0 0 1px var(--green)";
}

export function applyBlurStyles(
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
): void {
  const t = e.currentTarget;
  t.style.borderColor = "var(--border)";
  t.style.boxShadow = "none";
}

export function applyGreenButtonHover(
  e: React.MouseEvent<HTMLButtonElement>,
  isHover: boolean
): void {
  const t = e.currentTarget;
  t.style.backgroundColor = isHover ? "var(--green-hover)" : "var(--green)";
}

export function applyCardButtonHover(
  e: React.MouseEvent<HTMLButtonElement>,
  isHover: boolean
): void {
  const t = e.currentTarget;
  if (isHover) {
    t.style.color = "var(--green)";
    t.style.borderColor = "var(--border-green)";
    t.style.backgroundColor = "var(--green-dim)";
  } else {
    t.style.color = "var(--text-2)";
    t.style.borderColor = "var(--border)";
    t.style.backgroundColor = "var(--card)";
  }
}
