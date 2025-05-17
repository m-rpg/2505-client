export function focusRef<T extends HTMLElement>(legacyRefInner: T | null) {
  legacyRefInner?.focus();
}
